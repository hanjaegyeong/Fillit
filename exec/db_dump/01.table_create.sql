SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- drop database fillit;
-- create database fillit;
-- use fillit;

-- -----------------------------------------------------
-- Table `fillit`.`app_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`app_user` (
  `id` VARCHAR(255) NOT NULL,
  `birth_date` DATE NULL DEFAULT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `introduction` VARCHAR(255) NULL DEFAULT NULL,
  `is_deleted` BIT(1) NOT NULL,
  `main_prompt` TEXT NULL DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `personal_id` VARCHAR(255) NOT NULL,
  `profile_image_url` VARCHAR(255) NULL DEFAULT NULL,
  `social_domain` VARCHAR(255) NULL DEFAULT NULL,
  `social_id` VARCHAR(255) NULL DEFAULT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UKlwitsl880ug7enome3e8mfdjl` (`personal_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`app_follow`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`app_follow` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `followee_id` VARCHAR(255) NOT NULL,
  `follower_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK2kto12l2l7yhk2j0fvf1y47w5` (`followee_id` ASC) VISIBLE,
  INDEX `FKgvvuj8r471qlk6g2e6tslnih9` (`follower_id` ASC) VISIBLE,
  CONSTRAINT `FK2kto12l2l7yhk2j0fvf1y47w5`
    FOREIGN KEY (`followee_id`)
    REFERENCES `fillit`.`app_user` (`id`),
  CONSTRAINT `FKgvvuj8r471qlk6g2e6tslnih9`
    FOREIGN KEY (`follower_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`board`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`board` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(2000) NULL DEFAULT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `is_deleted` BIT(1) NOT NULL,
  `keyword` VARCHAR(15) NULL DEFAULT NULL,
  `like_count` BIGINT NOT NULL,
  `page_number` INT NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `x` DOUBLE NOT NULL,
  `y` DOUBLE NOT NULL,
  `z` DOUBLE NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKsi56qgcov09xmbnndf163e66k` (`user_id` ASC) VISIBLE,
  FULLTEXT INDEX `content` (`content`, `keyword`) VISIBLE,
  FULLTEXT INDEX `content_2` (`content`, `keyword`) VISIBLE,
  CONSTRAINT `FKsi56qgcov09xmbnndf163e66k`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`board_image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`board_image` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `image_url` VARCHAR(255) NOT NULL,
  `board_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_board_image_board` (`board_id` ASC) VISIBLE,
  CONSTRAINT `fk_board_image_board`
    FOREIGN KEY (`board_id`)
    REFERENCES `fillit`.`board` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`interest`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`interest` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`board_interest`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`board_interest` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `board_id` BIGINT NOT NULL,
  `interest_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK7g85gsbe64f9rccwl64ub1cqc` (`board_id` ASC) VISIBLE,
  INDEX `FK65bs1sojigcefoccbm12glq3g` (`interest_id` ASC) VISIBLE,
  CONSTRAINT `FK65bs1sojigcefoccbm12glq3g`
    FOREIGN KEY (`interest_id`)
    REFERENCES `fillit`.`interest` (`id`),
  CONSTRAINT `FK7g85gsbe64f9rccwl64ub1cqc`
    FOREIGN KEY (`board_id`)
    REFERENCES `fillit`.`board` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`board_like`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`board_like` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `board_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKk7rxm8vl1ptqqhwdj2sjmlpvq` (`board_id` ASC) VISIBLE,
  INDEX `FKtila54yx2w0n549goor3ln0yf` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKk7rxm8vl1ptqqhwdj2sjmlpvq`
    FOREIGN KEY (`board_id`)
    REFERENCES `fillit`.`board` (`id`),
  CONSTRAINT `FKtila54yx2w0n549goor3ln0yf`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`chat_room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`chat_room` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `last_message_content` VARCHAR(255) NULL DEFAULT NULL,
  `last_message_time` DATETIME(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`chat_participants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`chat_participants` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `unread_message_count` BIGINT NOT NULL,
  `chat_room_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKpnx1qvv3a9enu9fa3oil8hdrd` (`chat_room_id` ASC) VISIBLE,
  INDEX `FKlxj48crnyx5qi6f1l0e2dharc` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKlxj48crnyx5qi6f1l0e2dharc`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`),
  CONSTRAINT `FKpnx1qvv3a9enu9fa3oil8hdrd`
    FOREIGN KEY (`chat_room_id`)
    REFERENCES `fillit`.`chat_room` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`chat_message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`chat_message` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `message_content` VARCHAR(1000) NOT NULL,
  `chat_participants_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKlvr69ut15ej4ppo99w2s83hef` (`chat_participants_id` ASC) VISIBLE,
  CONSTRAINT `FKlvr69ut15ej4ppo99w2s83hef`
    FOREIGN KEY (`chat_participants_id`)
    REFERENCES `fillit`.`chat_participants` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`comment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(1000) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `like_count` BIGINT NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `board_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKlij9oor1nav89jeat35s6kbp1` (`board_id` ASC) VISIBLE,
  INDEX `FK37mjvnvpwbqdpewm39q75h9q` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK37mjvnvpwbqdpewm39q75h9q`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`),
  CONSTRAINT `FKlij9oor1nav89jeat35s6kbp1`
    FOREIGN KEY (`board_id`)
    REFERENCES `fillit`.`board` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`comment_like`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`comment_like` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `comment_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKqlv8phl1ibeh0efv4dbn3720p` (`comment_id` ASC) VISIBLE,
  INDEX `FKpd3l2ahc09tis0tqrry7iawa7` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKpd3l2ahc09tis0tqrry7iawa7`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`),
  CONSTRAINT `FKqlv8phl1ibeh0efv4dbn3720p`
    FOREIGN KEY (`comment_id`)
    REFERENCES `fillit`.`comment` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`email_verify_code`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`email_verify_code` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `expired_at` DATETIME(6) NOT NULL,
  `verify_code` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_email_verify_code_user` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_email_verify_code_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`feeds`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`feeds` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `is_recommended` BIT(1) NULL DEFAULT NULL,
  `board_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKrmiubwtvp990v0bvhyuxjrk4t` (`board_id` ASC) VISIBLE,
  INDEX `FK8tfmd14hh9xwj9yyifu8lubsw` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK8tfmd14hh9xwj9yyifu8lubsw`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`),
  CONSTRAINT `FKrmiubwtvp990v0bvhyuxjrk4t`
    FOREIGN KEY (`board_id`)
    REFERENCES `fillit`.`board` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`notifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `is_read` BIT(1) NOT NULL,
  `reference_id` BIGINT NULL DEFAULT NULL,
  `type` ENUM('BOARDLIKE', 'COMMENT', 'COMMENTLIKE', 'FOLLOW', 'MESSAGE', 'RECOMMENT', 'VOICEREPLY') NULL DEFAULT NULL,
  `receiver_id` VARCHAR(255) NOT NULL,
  `sender_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKrjrp3gou6n3xone9ma0opn3fh` (`receiver_id` ASC) VISIBLE,
  INDEX `FKh9jtwl2wry76mgovfdl6lifgy` (`sender_id` ASC) VISIBLE,
  CONSTRAINT `FKh9jtwl2wry76mgovfdl6lifgy`
    FOREIGN KEY (`sender_id`)
    REFERENCES `fillit`.`app_user` (`id`),
  CONSTRAINT `FKrjrp3gou6n3xone9ma0opn3fh`
    FOREIGN KEY (`receiver_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`reply`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`reply` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(1000) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `like_count` BIGINT NOT NULL,
  `updated_at` DATETIME(6) NULL DEFAULT NULL,
  `comment_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK6w0ns67lrq1jdiwi5xvtj1vxx` (`comment_id` ASC) VISIBLE,
  INDEX `FKey5mh14xucgi4cnx3w7akrclw` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK6w0ns67lrq1jdiwi5xvtj1vxx`
    FOREIGN KEY (`comment_id`)
    REFERENCES `fillit`.`comment` (`id`),
  CONSTRAINT `FKey5mh14xucgi4cnx3w7akrclw`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`reply_like`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`reply_like` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `reply_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKqf4y6h9cfw6jtjrd04p1rpbbj` (`reply_id` ASC) VISIBLE,
  INDEX `FKcy1jftv4ci3o9ef935x4jjrtt` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKcy1jftv4ci3o9ef935x4jjrtt`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`),
  CONSTRAINT `FKqf4y6h9cfw6jtjrd04p1rpbbj`
    FOREIGN KEY (`reply_id`)
    REFERENCES `fillit`.`reply` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`subreddit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`subreddit` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` TEXT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `UK2ruiwxdk1ntwdbdx1bkx8fd4h` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`user_interest`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`user_interest` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `interest_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKb2c20k2dqknrm5t337typ3s1b` (`interest_id` ASC) VISIBLE,
  INDEX `FKj4n57tatx7jahll9x3dk50kyr` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKb2c20k2dqknrm5t337typ3s1b`
    FOREIGN KEY (`interest_id`)
    REFERENCES `fillit`.`interest` (`id`),
  CONSTRAINT `FKj4n57tatx7jahll9x3dk50kyr`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 88
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`user_subreddit_mapping`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`user_subreddit_mapping` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `subreddit_id` BIGINT NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKqv0y7u6r9c6tw6yjtdsx99v9r` (`subreddit_id` ASC) VISIBLE,
  INDEX `FK38drrthtnvru18aaejco7rqbh` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK38drrthtnvru18aaejco7rqbh`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`),
  CONSTRAINT `FKqv0y7u6r9c6tw6yjtdsx99v9r`
    FOREIGN KEY (`subreddit_id`)
    REFERENCES `fillit`.`subreddit` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 76
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`voice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`voice` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `audio_url` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK7pkalrkd04rokjf3thb8wyec4` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK7pkalrkd04rokjf3thb8wyec4`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`voice_reply`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`voice_reply` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `audio_url` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `voice_voice_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKoklk40yxrfbeyruwb80caevwf` (`user_id` ASC) VISIBLE,
  INDEX `FK4jhhok3xr7vfl3o14je6p6cd6` (`voice_voice_id` ASC) VISIBLE,
  CONSTRAINT `FK4jhhok3xr7vfl3o14je6p6cd6`
    FOREIGN KEY (`voice_voice_id`)
    REFERENCES `fillit`.`voice` (`id`),
  CONSTRAINT `FKoklk40yxrfbeyruwb80caevwf`
    FOREIGN KEY (`user_id`)
    REFERENCES `fillit`.`app_user` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`youtube_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`youtube_category` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 45
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fillit`.`youtube`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fillit`.`youtube` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `channel_title` VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(1000) NULL DEFAULT NULL,
  `prompt` VARCHAR(2000) NULL DEFAULT NULL,
  `published_at` VARCHAR(255) NULL DEFAULT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `topic_category` VARCHAR(255) NULL DEFAULT NULL,
  `url` VARCHAR(255) NULL DEFAULT NULL,
  `category_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FKmu415fjx9jbiaeqodewpwnc2p` (`category_id` ASC) VISIBLE,
  CONSTRAINT `FKmu415fjx9jbiaeqodewpwnc2p`
    FOREIGN KEY (`category_id`)
    REFERENCES `fillit`.`youtube_category` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
