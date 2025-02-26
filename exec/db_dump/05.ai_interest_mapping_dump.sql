INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content = ('Literature', 'Music', 'Pets')
WHERE u.personal_id = 'itsbeki.m';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content = 'Tech'
WHERE u.personal_id = 'codewithtom';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Music', 'Sports')
WHERE u.personal_id = 'O.leo';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Literature', 'Daily')
WHERE u.personal_id = 'sunny.liv';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Games', 'Tech')
WHERE u.personal_id = 'noahxd';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Entertainment', 'Daily')
WHERE u.personal_id = 'so_ssip';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Travel', 'Photograpy', 'Sports')
WHERE u.personal_id = 'kai_wai_';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Tech', 'Games', 'Movies')
WHERE u.personal_id = 'hyuny777';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Tech', 'Literature')
WHERE u.personal_id = 'kafka.S';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Music', 'Fashion','Entertainment')
WHERE u.personal_id = 'Dear_mia';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Sports', 'Daily','Food')
WHERE u.personal_id = 'Sean.sportsmode';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Fashion', 'Beauty','Photograpy')
WHERE u.personal_id = 'Hunter.Kill';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Travel', 'Sports','Pets')
WHERE u.personal_id = 'Goose.to';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Art', 'Pets')
WHERE u.personal_id = 'Do.doodles';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Games', 'Tech')
WHERE u.personal_id = 'nemo.nemo';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Music', 'Fashion')
WHERE u.personal_id = 'I_vintage';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Food', 'Photograpy')
WHERE u.personal_id = 'Ch_ris_aos';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Literature', 'Art','Beauty','Food')
WHERE u.personal_id = 'js.000.23';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Pets', 'Daily')
WHERE u.personal_id = 'O_JasOn';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Movies', 'Music')
WHERE u.personal_id = 'cienna.mov';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Travel', 'Literature','Art')
WHERE u.personal_id = 'mimimy.stery';

INSERT INTO user_interest (user_id, interest_id)
SELECT u.id, i.id
FROM app_user u
JOIN interest i ON i.content IN ('Fashion', 'Entertainment','Beauty')
WHERE u.personal_id = 'saw.ord';