package com.social.a406.domain.board.service;

import com.social.a406.domain.board.dto.BoardRequest;
import com.social.a406.domain.board.dto.BoardResponse;
import com.social.a406.domain.board.entity.Board;
import com.social.a406.domain.board.entity.BoardImage;
import com.social.a406.domain.board.repository.BoardImageRepository;
import com.social.a406.domain.board.repository.BoardRepository;
import com.social.a406.domain.comment.service.CommentService;
import com.social.a406.domain.user.entity.User;
import com.social.a406.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardImageRepository boardImageRepository;
    private final UserRepository userRepository;
    private final S3Client s3Client;
    private final CommentService commentService;

    // AWS S3 환경 변수
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;
    @Value("${cloud.aws.region.static}")
    private String region;

    // 게시글 생성
    @Transactional
    public BoardResponse createBoard(BoardRequest boardRequest, UserDetails userDetails, List<MultipartFile> files) {
        User user = findUserBypersonalId(userDetails.getUsername());
        Board board = buildBoard(boardRequest, user);
        Board newBoard = boardRepository.save(board);
        List<String> imageUrls = null;
        if(files != null && !files.isEmpty()) {
            //게시글 이미지 저장
            imageUrls = saveBoardImage(newBoard.getId(), files);
        }
        return mapToResponseDto(newBoard, imageUrls);
    }

    // AI 게시글 생성
    @Transactional
    public BoardResponse createAiBoard(BoardRequest boardRequest, String aiPersonalId) {
        User aiUser = findUserBypersonalId(aiPersonalId);
        Board board = buildBoard(boardRequest, aiUser);
        return mapToResponseDto(boardRepository.save(board), null); // AI 게시글 이미지
    }

    // 게시글 단건 조회
    @Transactional(readOnly = true)
    public BoardResponse getBoardById(Long boardId) {
        Board board = findBoardById(boardId);
        List<String> imageUrls = getBoardImages(boardId);
        return mapToResponseDto(board, imageUrls);
    }

    // 게시글 수정
    @Transactional
    public BoardResponse updateBoard(Long boardId, BoardRequest boardRequest, UserDetails userDetails, List<MultipartFile> newFiles) {
        User user = findUserBypersonalId(userDetails.getUsername());
        Board board = findBoardById(boardId);

        validateBoardOwnership(board, user);

        board.updateContent(boardRequest.getContent());

        // 기존 이미지 유지 여부 확인 후 처리
        List<String> existingImageUrls = getBoardImages(boardId);  // 기존 이미지 가져오기
        List<String> newImageUrls = new ArrayList<>(existingImageUrls);          // 기존 이미지 복사

        if (newFiles != null && !newFiles.isEmpty()) {
            // 새 이미지 업로드 및 기존 이미지 삭제
            deleteBoardImage(boardId); // 기존 이미지 삭제 (선택적)
            newImageUrls = saveBoardImage(boardId, newFiles); // 새 이미지 저장
        }
        return mapToResponseDto(board, newImageUrls);
    }

    // 게시글 내용 조회
    @Transactional(readOnly = true)
    public String getBoardContentById(Long boardId) {
        return findBoardById(boardId).getContent();
    }

    // 게시글 작성자 닉네임 조회
    @Transactional(readOnly = true)
    public String getBoardAuthorpersonalIdById(Long boardId) {
        return findBoardById(boardId).getUser().getPersonalId();
    }

    // 유저 조회 유틸 메서드
    private User findUserBypersonalId(String personalId) {
        return userRepository.findByPersonalId(personalId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with personalId: " + personalId));
    }

    // 게시글 조회 유틸 메서드
    private Board findBoardById(Long boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Board not found with id: " + boardId));
    }

    // 랜덤 게시글 조회
    public Long getRandomBoardId() {
        List<Long> boardIds = boardRepository.findAllIds();

        if (boardIds.isEmpty()) {
            System.err.println("No boards available for random selection.");
            return null;
        }

        Random random = new Random();
        return boardIds.get(random.nextInt(boardIds.size()));
    }

    // 본인 게시글 / 댓글 단 게시글 제외 랜덤 게시글 조회
    public Long getRandomAvailableBoardIdExcludingUser(String personalId) {
        List<Long> availableBoardIds = boardRepository.findAvailableIdsExcludingUser(personalId);

        if (availableBoardIds.isEmpty()) {
            System.err.println("No available boards for random selection.");
            return null; // 조건에 맞는 게시글이 없을 경우
        }

        // 랜덤 게시글 선택
        Random random = new Random();
        return availableBoardIds.get(random.nextInt(availableBoardIds.size()));
    }

    // 게시글 생성 유틸 메서드
    private Board buildBoard(BoardRequest boardRequest, User user) {
        return Board.builder()
                .content(boardRequest.getContent())
                .user(user)
                .likeCount(0L)
                .x(boardRequest.getX())
                .y(boardRequest.getY())
                .z(boardRequest.getZ())
                .keyword(boardRequest.getKeyword())
                .pageNumber(boardRequest.getPageNumber())
                .build();
    }

    // 게시글 소유권 검증
    private void validateBoardOwnership(Board board, User user) {
        if (!board.getUser().equals(user)) {
            throw new SecurityException("User is not authorized to update this board");
        }
    }

    // Board 엔티티를 Response DTO로 변환
    private BoardResponse mapToResponseDto(Board board, List<String> imageUrls) {
        return BoardResponse.builder()
                .boardId(board.getId())
                .content(board.getContent())
                .personalId(board.getUser().getPersonalId())
                .likeCount(board.getLikeCount())
                .commentCount(commentService.getCommentCountByBoard(board.getId()))
                .x(board.getX())
                .y(board.getY())
                .z(board.getZ())
                .keyword(board.getKeyword())
                .pageNumber(board.getPageNumber())
                .imageUrls(imageUrls)
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }

    @Transactional
    public List<String> saveBoardImage(Long boardId, List<MultipartFile> files) {
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new IllegalArgumentException("Not found board to save Image")
        );
        List<String> imageUrls = new ArrayList<>();
        for(MultipartFile file : files){
            String imageUrl = saveBoardImageAtS3(boardId, file);
            BoardImage boardImage = BoardImage.builder()
                    .board(board)
                    .imageUrl(imageUrl)
                    .build();
            boardImageRepository.save(boardImage);
            imageUrls.add(imageUrl);
        }
        return imageUrls;
    }

    //이미지 저장
    public String saveBoardImageAtS3(Long boardId, MultipartFile file) {
        try{
            String fileName = "board/" + boardId + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

            // 이미지의 MIME 타입 추출
            String contentType = getContentType(file.getOriginalFilename());

            // S3 업로드
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .contentType(contentType)
                    .contentDisposition("inline")
                    .build();

            s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(
                    file.getInputStream(), file.getSize()));

            String fileUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileName;

            return fileUrl;
        } catch(IOException e){
            throw new RuntimeException("Failed to store the file", e);
        }
    }
    // 파일 확장자에 맞는 MIME 타입을 반환하는 메서드
    private String getContentType(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream"; // 기본 값
        }
    }

    // 게시글 이미지 가져오기
    @Transactional
    public List<String> getBoardImages(Long boardId) {
        return boardImageRepository.findAllByBoardId(boardId);
    }

    @Transactional
    public List<BoardResponse> getBoardByUser(String personalId) {
        List<Board> boards = boardRepository.findAllByPersonalId(personalId);
        List<BoardResponse> responses = new ArrayList<>();
        for(Board board : boards){
            List<String> imageUrls = getBoardImages(board.getId());
            responses.add(mapToResponseDto(board,imageUrls));
        }
        return responses;
    }

    //게시글 삭제
    @Transactional
    public void deleteBoard(Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new IllegalArgumentException("Not found board")
        );
        try {
            deleteBoardImage(boardId);  // 이미지 삭제
        } catch (Exception e) {
            // 이미지 삭제 실패 처리 (예: 로그 기록)
            throw new RuntimeException("Fail to delete board Image: " + e.getMessage(), e);
        }
        boardRepository.delete(board);
    }

    // 게시글 이미지 삭제
    public void deleteBoardImage(Long boardId) {
        List<String> imageUrls = boardImageRepository.findAllByBoardId(boardId);

        if (imageUrls != null && !imageUrls.isEmpty()) {
            for (String imageUrl : imageUrls) {
                // S3 버킷 내에서 삭제하려는 파일의 키(파일 경로) 추출
                String fileKey = imageUrl.substring(imageUrl.indexOf("board/" + boardId + "/"));  // 'board/'부터 시작하는 경로 추출

                // S3에서 해당 파일 삭제
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileKey)
                        .build());
            }
            boardImageRepository.deleteByBoardId(boardId);
        }
    }
}
