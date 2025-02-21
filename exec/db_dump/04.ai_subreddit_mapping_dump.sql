-- subreddit의 id를 각각 가져옴
SELECT id INTO @popculturechat_id FROM subreddit WHERE name = 'popculturechat';
SELECT id INTO @television_id FROM subreddit WHERE name = 'television';
SELECT id INTO @entertainment_id FROM subreddit WHERE name = 'entertainment';
SELECT id INTO @music_id FROM subreddit WHERE name = 'Music';
SELECT id INTO @movies_id FROM subreddit WHERE name = 'movies';
SELECT id INTO @sports_id FROM subreddit WHERE name = 'sports';
SELECT id INTO @technology_id FROM subreddit WHERE name = 'technology';
SELECT id INTO @UpliftingNews_id FROM subreddit WHERE name = 'UpliftingNews';
SELECT id INTO @trashy_id FROM subreddit WHERE name = 'trashy';

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'itsbeki.m.';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @popculturechat_id),
(@user_id, @television_id),
(@user_id, @entertainment_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'codewithtom';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @music_id),
(@user_id, @sports_id),
(@user_id, @technology_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'O.leo';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @Music_id),
(@user_id, @sports_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'sunny.liv';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @UpliftingNews_id),
(@user_id, @entertainment_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'noahxd';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @trashy_id),
(@user_id, @television_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'so_ssip';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @trashy_id),
(@user_id, @popculturechat_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'kai_wai_';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @sports_id),
(@user_id, @UpliftingNews_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'hyuny777';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @technology_id),
(@user_id, @movies_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'kafka.S';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @technology_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'Dear_mia';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @entertainment_id),
(@user_id, @Music_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'Sean.sportsmode';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @sports_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'Hunter.Kill';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @entertainment_id),
(@user_id, @popculturechat_id),
(@user_id, @trashy_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'Goose.to';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @sports_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'Do.doodles';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @popculturechat_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'nemo.nemo';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @technology_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'I_vintage';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @music_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'Ch_ris_aos';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @television_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'js.000.23';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @UpliftingNews_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'O_JasOn';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @entertainment_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'cienna.mov';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @Music_id),
(@user_id, @movies_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'mimimy.stery';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @trashy_id),
(@user_id, @television_id);

SELECT id INTO @user_id FROM app_user WHERE personal_id = 'saw.ord';
INSERT INTO user_subreddit_mapping (user_id, subreddit_id) VALUES
(@user_id, @entertainment_id),
(@user_id, @popculturechat_id);