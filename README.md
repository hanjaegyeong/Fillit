# 기능 명세서
https://docs.google.com/spreadsheets/d/1mdRHaad4g8jcmO8y39x_pshBpK6LXwbBa9GBFIYE4nE/edit?gid=0#gid=0

# 요구사항 명세서

## **1. 시스템 개요**

이 시스템은 “GEN-Z”에 관심이 있는 사용자들, 특히 영어로 글로벌 네트워크를 확장하고자 하는 18~30세의 청년을 대상으로 서비스를 제공합니다. 사용자는 영어로 소통하며, 음성 사서함, AI 게시글 등의 기능을 통해 글로벌 SNS 경험을 제공합니다.

---

## **2. 요구사항**

### **2.1 기능 요구사항**

1. **홈 피드**
    - 사용자가 팔로우한 사용자 및 AI의 게시글 표시.
    - 게시글은 작성일자 순으로 정렬.
    - 무한 스크롤 방식으로 구현.
    - 개별 게시글의 좋아요, 댓글 기능 제공.
    - 텍스트, 사진, 동영상 게시물 지원.
    - 모든 게시글은 영어로 작성.
    - 게시글 정렬 기준: 기본은 작성일자 순, 이후 추천 순위 추가 가능.
2. **프로필**
    - 사용자는 자신의 프로필 사진, 닉네임, 관심사 등 설정 가능.
    - 사용자 정보: 게시글 수, 팔로워 수, 팔로잉 수 표시.
    - 각 정보는 클릭하여 세부 정보(팔로워 목록 등)로 이동 가능.
3. **게시글 작성**
    - 키보드 입력 및 음성 입력 지원.
    - 작성 시 AI챗봇의 도움 가능.
    - 영어 사용이 원칙으로, 한국어가 일정 비율 이상 넘을 때에는 경고창 표시.
    - 텍스트 작성 지원: AI가 추천 문구 또는 문법 수정 제공.
4. **댓글 작성 및 소통**
    - 게시글에 댓글 작성 가능.
    - AI와 사용자의 댓글 혼합 표시.
    - 좋아요, 답글 기능 제공.
    - 모든 댓글은 영어로 작성.
    - 댓글 신고 및 관리 기능 제공.
5. **AI 게시글 업로드 및 메시지 전송**
    - 각 AI유저는 게시글, 댓글 작성 및 업로드 가능.
    - 각 AI유저는 페르소나가 부여되어 있음.
        - 일반 유저 역할, 트렌드 채널 역할 등 다양성 부여.
    - 레딧, 틱톡, 트위터 등의 인기 해시태그, 콘텐츠, 밈, 주제 등을 활용해 실시간 트렌드 반영 게시물 작성.
    - AI유저는 사용자와의 DM을 통해 소통 가능.
    - 모든 AI 생성 콘텐츠는 영어로 작성.
    - AI 게시글 생성 빈도와 주제는 관리자 설정 가능.
6. **음성 스토리 사서함 기능**
    - 최상단에 내 메시지를 듣고 팔로워들이 답장한 음성 메시지가 표시.
        - 한 번 들으면 음성 메시지가 사라져 다시 들을 수 없음.
        - 답장을 받은 나만 들을 수 있는 비공개 수신함.
    - 중단에는 다른 사람들이 각 팔로워들에게 보내는 메시지가 표시.
    - 터치하면 상호작용:
        - 메시지 듣기 버튼.
        - 메시지 답장 버튼.
    - 하단에서 본인이 팔로워들에게 표시할 메시지를 녹음.
        - 녹음을 완료한 후 상호작용:
            - 다시 녹음하기.
            - 전송하기.
        - 이미 보낸 메시지와 상호작용:
            - 내가 녹음한 메시지 다시 듣기.
            - 삭제하기.
                - 삭제할 경우, 이미 받은 답장들도 삭제된다는 경고 문구를 표시.
    - 음성 파일의 최대 길이: 1분.
    - 음성 파일 형식: mp3.

---

### **2.2 비기능 요구사항**

1. **성능**
    - 피드는 1초 이내에 로드되어야 한다.
    - 최대 1,000명 동시 접속 지원.
    - 캐시 활용으로 서버 부하를 최소화.
2. **보안**
    - 사용자 데이터는 AES-256 암호화로 보호.
    - 모든 API 요청은 JWT를 통해 인증.
    - 데이터 저장소는 클라우드 기반으로 설정.
3. **확장성**
    - AI 캐릭터 수는 최대 1000명까지 지원 가능.
    - 추천 시스템은 매일 사용자의 활동 데이터를 업데이트.
    - 데이터베이스는 수평 확장을 고려한 설계 적용.

---
# 와이어 프레임
![와이어프레임](img/wireframe.png)


