package com.social.a406.domain.hotissue.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
@Table(name = "hotissue_youtube")
public class Youtube {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private String publishedAt;
    @Column(length = 1000)
    private String description;
    private String title;
    private String topicCategory;
    private String category;
    private String channelTitle;
    @Column(length = 2000)
    private String prompt;

    @Builder
    public Youtube(String url, String publishedAt, String description, String title,
                        String topicCategory, String category, String channelTitle, String prompt) {
        this.url = url;
        this.publishedAt = publishedAt;
        this.description = description;
        this.title = title;
        this.topicCategory = topicCategory;
        this.category = category;
        this.channelTitle = channelTitle;
        this.prompt = prompt;
    }

    public Youtube(Youtube youtube, String prompt){
        this.url = youtube.getUrl();
        this.publishedAt = youtube.getPublishedAt();
        this.description = youtube.getDescription();
        this.title = youtube.getTitle();
        this.topicCategory = youtube.getTopicCategory();
        this.category = youtube.getCategory();
        this.channelTitle = youtube.getChannelTitle();
        this.prompt = prompt;
    }
}
