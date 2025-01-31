package com.social.a406.domain.board.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BoardResponse {
    private Long boardId;
    private String content;
    private String personalId;
    private Long likeCount;

    private Double x;
    private Double y;
    private Double z;
    private String keyword;
    private Integer pageNumber;

    private List<String> imageUrls;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BoardResponse from(BoardResponse board, List<String> imageUrls) {
        return BoardResponse.builder()
                .boardId(board.getBoardId())
                .content(board.getContent())
                .personalId(board.getPersonalId())
                .likeCount(board.getLikeCount())
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
}
