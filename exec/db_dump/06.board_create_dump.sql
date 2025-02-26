-- SELECT * FROM fillit.board;

-- ALTER TABLE board
-- Modify column like_count bigINT DEFAULT 0,
-- MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
-- MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
-- MODIFY COLUMN is_deleted BOOLEAN DEFAULT FALSE;

INSERT INTO board
(
	content,
    keyword,
    page_number,
    x,
    y,
    z,
    user_id
)
values
-- 1
(
    "Just wrapped up another late-night convo about life. Nothing beats deep talks under the stars. 🌌✨",
    "deeptalk",
    1,
    37.7749,
    -122.4194,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'O.leo')
),
-- 2
(
    "Perfect workout today. The playlist was on point, and the energy was unreal. Let’s go again tomorrow! 🔥🎶",
    "energy",
    1,
    40.7128,
    -74.0060,
    8,
    (SELECT id FROM app_user WHERE personal_id = 'O.leo')
),
-- 3
(
    "There’s something magical about discovering a song that fits your mood perfectly. Just found my new obsession. 🎧",
    "music",
    1,
    34.0522,
    -118.2437,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'O.leo')
),
-- 4
(
    "Midnight drive with the perfect playlist. Just me, the open road, and good vibes. Best way to clear my mind. 🚗💨",
    "drive",
    1,
    51.5074,
    -0.1278,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'O.leo')
),
-- 5
(
    "Late-night thoughts hit different. Sometimes, all you need is a good conversation and a chill beat in the background. 🌙",
    "deeptalk",
    1,
    48.8566,
    2.3522,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'O.leo')
),
-- 6
(
    "Happiness is a choice, and today I’m choosing all the sunshine and good vibes! ☀️✨",
    "joy",
    1,
    21.3069,
    -157.8583,
    3,
    (SELECT id FROM app_user WHERE personal_id = 'sunny.liv')
),
-- 7
(
    "Surround yourself with things that make your heart smile. Cute mugs, cozy blankets, and pastel dreams! 🎀💖",
    "aesthetic",
    1,
    34.0522,
    -118.2437,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'sunny.liv')
),
-- 8
(
    "A little kindness goes a long way. Let’s make the world brighter, one smile at a time! 🌼😊",
    "kindness",
    1,
    40.7128,
    -74.0060,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'sunny.liv')
),
-- 9
(
    "Found the cutest café today! The vibes were immaculate, and the latte art was just perfection. ☕💕",
    "coffee",
    1,
    48.8566,
    2.3522,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'sunny.liv')
),
-- 10
(
    "Sending love and positive energy your way! You’re doing amazing, and don’t you forget it! 💛🌟",
    "positive",
    1,
    51.5074,
    -0.1278,
    2,
    (SELECT id FROM app_user WHERE personal_id = 'sunny.liv')
),
-- 11
(
    "Finally beat a boss I’ve been stuck on for hours. Now I’m just waiting for the game to punish me again. 🤷‍♂️",
    "gaming",
    1,
    40.7128,
    -74.0060,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'noahxd')
),
-- 12
(
    "Just found a new game. It’s tough, it’s brutal, and it’s exactly what I needed to feel alive again. 🖤",
    "challenge",
    1,
    34.0522,
    -118.2437,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'noahxd')
),
-- 13
(
    "You ever start a game and realize you’re already rage-quitting before you even hit the first boss? 😂",
    "ragequit",
    1,
    51.5074,
    -0.1278,
    3,
    (SELECT id FROM app_user WHERE personal_id = 'noahxd')
),
-- 14
(
    "If I had a dollar for every time I died in a Soulslike game, I’d have enough for a new game... to die in. 💀",
    "soulslike",
    1,
    48.8566,
    2.3522,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'noahxd')
),
-- 15
(
    "I’m convinced the best game designers are secretly evil geniuses. The pain they put me through is unmatched. 😈",
    "designer",
    1,
    40.7306,
    -73.9352,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'noahxd')
),
-- 16
(
    "You deserve the world, so stop settling for anything less. Period. 💯",
    "advice",
    1,
    40.4168,
    -3.7038,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'so_ssip')
),
-- 17
(
    "Don’t waste time on people who don’t make you feel like you matter. You’re the main character, act like it. 👑",
    "boundaries",
    1,
    41.9028,
    12.4964,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'so_ssip')
),
-- 18
(
    "Spilling tea: If they really wanted to, they’d make the effort. Don’t chase anyone who’s not chasing you. 👀☕",
    "tea",
    1,
    48.8566,
    2.3522,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'so_ssip')
),
-- 19
(
    "Real talk: Life’s too short to pretend everything’s fine. Speak your truth, even if it’s messy. 🙌",
    "honesty",
    1,
    40.7306,
    -73.9352,
    3,
    (SELECT id FROM app_user WHERE personal_id = 'so_ssip')
),
-- 20
(
    "Stop waiting for permission to live your life. You’re the boss. Make it happen. 🔥",
    "empower",
    1,
    41.3784,
    2.1915,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'so_ssip')
),
-- 21
(
    "There’s something magical about waking up in a new place. Can’t wait to explore this hidden gem. ✈️🌄",
    "travel",
    1,
    35.2271,
    -80.8431,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'kai_wai_')
),
-- 22
(
    "Life’s beauty is in the small things: a quiet sunrise, the sound of rain, and a cup of coffee. ☕🌧️",
    "beauty",
    1,
    36.1627,
    -86.7816,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'kai_wai_')
),
-- 23
(
    "Just captured the perfect moment in a place I’ve always wanted to visit. These are the memories that last. 📸💙",
    "memories",
    1,
    34.0522,
    -118.2437,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'kai_wai_')
),
-- 24
(
    "Planning my next adventure. Where should I go next? The world’s too big to stay in one place. 🌍✌️",
    "adventure",
    1,
    51.5074,
    -0.1278,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'kai_wai_')
),
-- 25
(
    "There’s beauty in the chaos of travel. The missed flights, the unexpected moments — it’s all part of the journey. ✨🌎",
    "chaos",
    1,
    40.7306,
    -73.9352,
    3,
    (SELECT id FROM app_user WHERE personal_id = 'kai_wai_')
),
-- 26
(
    "Just got my hands on the latest gadget, and it’s a game-changer. The future is now! 🔥🤖",
    "tech",
    1,
    47.6062,
    -122.3321,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'hyuny777')
),
-- 27
(
    "Tech tip of the day: Always optimize your settings for maximum performance. Small tweaks, big results. ⚙️💡",
    "advice",
    1,
    34.0522,
    -118.2437,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'hyuny777')
),
-- 28
(
    "Explaining complex tech stuff in simple terms is my superpower. Who’s ready for a tech breakdown? 💻⚡",
    "simple",
    1,
    40.7128,
    -74.0060,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'hyuny777')
),
-- 29
(
    "I swear, the best part of a new tech release is unboxing it. The anticipation is real! 📦🔌",
    "gadgets",
    1,
    47.6097,
    -122.3331,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'hyuny777')
),
-- 30
(
    "Is it just me, or do tech failures sometimes teach you more than success? Learning the hard way, always. 😅💡",
    "failures",
    1,
    48.8566,
    2.3522,
    3,
    (SELECT id FROM app_user WHERE personal_id = 'hyuny777')
),
-- 31
(
    "The stars have spoken, and it’s a good time to trust your intuition today. Don’t overthink it. 🌟✨",
    "zodiac",
    1,
    29.7604,
    -95.3698,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'kafka.S')
),
-- 32
(
    "The universe is always guiding us. Pay attention to the signs, they’re never wrong. 🔮🌙",
    "universe",
    1,
    30.2672,
    -97.7431,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'kafka.S')
),
-- 33
(
    "A sudden shift in energy today. If you’re a Taurus, brace yourself for some unexpected but positive changes. 🦋♉",
    "energy",
    1,
    40.7128,
    -74.0060,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'kafka.S')
),
-- 34
(
    "Nothing beats a hot cup of coffee in the morning. It’s like the universe telling you, ‘You got this.’ ☕💫",
    "coffee",
    1,
    29.7604,
    -95.3698,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'kafka.S')
),
-- 35
(
    "I’m predicting a major life decision coming soon for a Leo. Trust the universe’s timing on this one. 🔮🦁",
    "predict",
    1,
    48.8566,
    2.3522,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'kafka.S')
),
-- 36
(
    "The perfect accessory can make any outfit stand out. Never underestimate the power of a great pair of shoes. 👠💫",
    "accessory",
    1,
    40.7128,
    -74.0060,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'Dear_mia')
),
-- 37
(
    "Curating the perfect playlist for a chill night in. Sometimes, the right song just hits different. 🎶💫",
    "vibes",
    1,
    40.7128,
    -74.0060,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'Dear_mia')
),
-- 38
(
    "I know every lyric to this song by heart. Music has a way of sticking with you, doesn’t it? 🎤❤️",
    "lyrics",
    1,
    34.0522,
    -118.2437,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'Dear_mia')
),
-- 39
(
    "Fashion is all about expressing yourself. Today, I’m feeling bold with this street style. 🖤👟",
    "style",
    1,
    36.1699,
    -115.1398,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Dear_mia')
),
-- 40
(
    "The perfect playlist can turn any moment into a memory. Here’s to the songs that stay with you. 🎶💖",
    "playlist",
    1,
    36.1699,
    -115.1398,
    3,
    (SELECT id FROM app_user WHERE personal_id = 'Dear_mia')
),
-- 41
(
    "Game night is here! Let’s see who’s ready to bring the heat and make some noise. 🔥🏀⛹️",
    "sports",
    1,
    32.7767,
    -96.7970,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Sean.sportsmode')
),
-- 42
(
    "The crowd is electric tonight! You can feel the energy building up. Let’s go team! 💥🎉",
    "energy",
    1,
    33.4484,
    -112.0740,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'Sean.sportsmode')
),
-- 43
(
    "Pushing through the pain today. The only bad workout is the one you didn’t do. Let’s go! 💪🔥",
    "strength",
    1,
    33.4484,
    -112.0740,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'Sean.sportsmode')
),
-- 44
(
    "Just finished a killer workout! Feeling stronger with every rep. It’s all about progress, not perfection. 💥🏋️‍♂️",
    "workout",
    1,
    32.7767,
    -96.7970,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Sean.sportsmode')
),
-- 45
(
    "There’s no such thing as a bad workout when you’re giving it your all. Keep grinding, stay focused. 🏋️‍♂️💯",
    "grind",
    1,
    36.1699,
    -115.1398,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'Sean.sportsmode')
),
-- 46
(
    "I can already see this trend taking off. Can't wait to see everyone rocking it this season. 🔥👗",
    "fashion",
    1,
    30.2672,
    -97.7431,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Hunter.Kill')
),
-- 47
(
    "Found the coolest TikTok challenge before it went viral. You’ll see it everywhere soon. Trust me. 🤳🎶",
    "viral",
    1,
    32.7767,
    -96.7970,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'Hunter.Kill')
),
-- 48
(
    "Effortless cool is the vibe. It’s all in the details, don’t overthink it. Just wear it with confidence. 😎✨",
    "style",
    1,
    33.4484,
    -112.0740,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'Hunter.Kill')
),
-- 49
(
    "Can’t stop watching this viral dance. TikTok is always ahead of the curve. 💃🔥",
    "dance",
    1,
    36.1699,
    -115.1398,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Hunter.Kill')
),
-- 50
(
    "Trends come and go, but personal style? That’s what sets you apart. 🖤👠",
    "trend",
    1,
    40.7128,
    -74.0060,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'Hunter.Kill')
),
-- 51
(
    "Skydiving today was insane! There’s no better feeling than jumping out of a plane. No risk, no fun! 🌤️✈️",
    "adrenaline",
    1,
    34.0489,
    -111.0937,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Goose.to')
),
-- 52
(
    "Just caught the perfect wave. Surfing gives me that adrenaline rush I live for! 🌊🏄‍♂️",
    "surfing",
    1,
    33.4484,
    -112.0740,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'Goose.to')
),
-- 53
(
    "Skateboarding down the streets, feeling the wind and the thrill. This is what freedom feels like. 🛹💨",
    "skate",
    1,
    32.7157,
    -117.1611,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'Goose.to')
),
-- 54
(
    "Nothing beats the adrenaline rush of pushing my limits. Skydiving this weekend? You know I’m in. 🪂💥",
    "rush",
    1,
    36.1699,
    -115.1398,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Goose.to')
),
-- 55
(
    "The higher the risk, the greater the thrill. Let’s keep pushing the limits. 🔥🎢",
    "thrill",
    1,
    31.9686,
    -99.9018,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'Goose.to')
),
-- 56
(
    "Spent the whole night working on a new animation. It’s crazy how a few frames can bring so much emotion! 🎞️✨",
    "animate",
    1,
    35.7796,
    -78.6382,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Do.doodles')
),
-- 57
(
    "Sketching random faces at a café. I swear, the best ideas come when you’re not even trying. ☕✏️",
    "sketch",
    1,
    36.0726,
    -79.7910,
    3,
    (SELECT id FROM app_user WHERE personal_id = 'Do.doodles')
),
-- 58
(
    "I saw my favorite animated movie at the cinema today. This movie really touched my heart. 🎥",
    "movie",
    1,
    34.2257,
    -77.9447,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'Do.doodles')
),
-- 59
(
    "Trying out pixel art for the first time. Who knew tiny squares could be so satisfying to work with? 🟦🟩🟧",
    "pixels",
    1,
    35.5951,
    -82.5515,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'Do.doodles')
),
-- 60
(
    "I met my favorite anime character today. It's the best!! 😊🎬",
    "anime",
    1,
    35.2271,
    -80.8431,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Do.doodles')
),
-- 61
(
    "Dropped a 30-bomb in ranked today. My reflexes were on another level! 🏆🔥",
    "victory",
    1,
    25.7617,
    -80.1918,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'nemo.nemo')
),
-- 62
(
    "Mastered the new meta already. If you’re not adapting, you’re losing. 🚀",
    "meta",
    1,
    25.7742,
    -80.1936,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'nemo.nemo')
),
-- 63
(
    "Clutched a 1v4 in overtime. My team was screaming. 😂🎮",
    "clutch",
    1,
    25.7907,
    -80.1300,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'nemo.nemo')
),
-- 64
(
    "Optimized my game’s input handling today. No more lag when spamming abilities! ⚡🔥",
    "coding",
    1,
    25.7617,
    -80.1918,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'nemo.nemo')
),
-- 65
(
    "Just built a bot that auto-analyzes enemy movement patterns. Time to climb the ranks! 🤖📈",
    "script",
    1,
    25.7742,
    -80.1936,
    8,
    (SELECT id FROM app_user WHERE personal_id = 'nemo.nemo')
),
-- 66
(
    "Spent the afternoon flipping through vinyls at a tiny record shop. Found a first press of Fleetwood Mac—pure magic. 🎵✨",
    "vinyl",
    1,
    46.8797,
    -110.3626,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'I_vintage')
),
-- 67
(
    "There’s just something about ‘90s fashion. Baggy jeans, cropped sweaters, and a whole lot of attitude. Timeless. 🖤",
    "fashion",
    1,
    46.8608,
    -110.2501,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'I_vintage')
),
-- 68
(
    "Developed a new obsession with typewriters. The sound of each keypress? ASMR for the soul. 🖋️",
    "vintage",
    1,
    46.9219,
    -110.4052,
    4,
    (SELECT id FROM app_user WHERE personal_id = 'I_vintage')
),
-- 69
(
    "Polaroid pictures just hit different. No filters, no edits—just raw, imperfect beauty. 📸✨",
    "analog",
    1,
    46.8352,
    -110.4573,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'I_vintage')
),
-- 70
(
    "Found the perfect thrifted leather jacket today. Worn-in, slightly oversized, and full of history. Some things just get better with time. 🖤",
    "thrift",
    1,
    46.9125,
    -110.3228,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'I_vintage')
),
-- 71
(
    "Found this tiny sushi spot, and their toro just melts in your mouth. 🍣 The rice, the balance, the freshness… pure perfection!",
    "sushi",
    1,
    42.3601,
    -71.0589,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'Ch_ris_aos')
),
-- 72
(
    "Made some cheesy, buttery corn at home, and wow… comfort food at its finest. 🌽🧀 Perfectly gooey and slightly crispy on top!",
    "corn",
    1,
    42.3487,
    -71.0823,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'Ch_ris_aos')
),
-- 73
(
    "BBQ night! Grilled some smoky, tender short ribs, and the marinade soaked in perfectly. 🍖🔥 Nothing beats home-cooked galbi!",
    "ribs",
    1,
    42.3721,
    -71.0516,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'Ch_ris_aos')
),
-- 74
(
    "Crispy, juicy fried chicken fresh out of the fryer. 🍗🔥 The crunch is unreal, and that first bite? Absolute heaven!",
    "chicken",
    1,
    42.3513,
    -71.0476,
    8,
    (SELECT id FROM app_user WHERE personal_id = 'Ch_ris_aos')
),
-- 75
(
    "Whipped up a quick donburi with perfectly seared beef, a soft egg, and sweet-salty sauce. 🍛 Simple, but insanely good!",
    "donburi",
    1,
    42.3634,
    -71.0912,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'Ch_ris_aos')
),
-- 76
(
    "Some words don’t need to be spoken. They linger in the pauses, in the spaces between breaths, in the way we look at each other and just know.",
    "silence",
    1,
    41.8781,
    -87.6298,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'js.000.23')
),
-- 77
(
    "The moon listens to all my secrets, holds them gently, and never asks for anything in return. Maybe that’s why I always find peace in its light.",
    "moon",
    1,
    41.8810,
    -87.6324,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'js.000.23')
),
-- 78
(
    "A well-written poem is like a whispered truth—soft enough to slip into your heart, but powerful enough to change it forever.",
    "poetry",
    1,
    41.8756,
    -87.6244,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'js.000.23')
),
-- 79
(
    "Late-night talks about dreams, fears, and everything in between… That’s where the real magic happens. That’s where souls connect.",
    "talks",
    1,
    41.8902,
    -87.6176,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'js.000.23')
),
-- 80
(
    "Some people read books to escape. I read them to feel—to live a thousand lives, to love, to ache, to understand what it means to be human.",
    "books",
    1,
    41.8827,
    -87.6233,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'js.000.23')
),
-- 81
(
    "Adopt, don’t shop! There are so many incredible animals in shelters just waiting for a second chance at love and a forever home. 🏡🐾",
    "rescue",
    1,
    44.3106,
    -69.7795,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'O_JasOn')
),
-- 82
(
    "I saw penguins and seals this time. They were truly the cutest thing in the universe. There are so many cute animals in the world 🐧",
    "animals",
    1,
    44.3058,
    -69.7688,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'O_JasOn')
),
-- 83
(
    "Training a dog isn’t about dominance—it’s about communication, trust, and lots of treats! 🍖🐕 Positive reinforcement is key! 🐾",
    "training",
    1,
    44.3122,
    -69.7810,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'O_JasOn')
),
-- 84
(
    "Nothing beats the excitement of coming home to a dog that missed you like crazy—even if you were only gone for five minutes! 🏠🐶",
    "dogs",
    1,
    44.3099,
    -69.7705,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'O_JasOn')
),
-- 85
(
    "Do you know how many cute friends there are in the world? I went to a place where someone I know works and met a really cute turtle. If only this friend was a little smaller, I would have brought him home.... 💕🐢",
    "turtle",
    1,
    44.3074,
    -69.7741,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'O_JasOn')
),
-- 86
(
    "A film’s soundtrack isn’t just background noise—it’s the soul of the story. A perfect score can make a scene unforgettable. 🎶✨",
    "soundtrack",
    1,
    34.0522,
    -118.2437,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'cienna.mov')
),
-- 87
(
    "Indie films prove that you don’t need a big budget to tell a powerful story. Some of the most emotional, thought-provoking films fly under the radar. 🎥💡",
    "indie",
    1,
    40.7128,
    -74.0060,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'cienna.mov')
),
-- 88
(
    "Rewatching a film and noticing new details is one of the best experiences. Great cinema keeps revealing itself over time. 🔄👀",
    "cinema",
    1,
    51.5074,
    -0.1278,
    7,
    (SELECT id FROM app_user WHERE personal_id = 'cienna.mov')
),
-- 89
(
    "There’s nothing like a perfectly written monologue—it gives you chills, makes you think, and stays with you long after the credits roll. 🎭💬",
    "script",
    1,
    48.8566,
    2.3522,
    5,
    (SELECT id FROM app_user WHERE personal_id = 'cienna.mov')
),
-- 90
(
    "Some films are pure eye candy. Stunning cinematography can turn every frame into a work of art. Every shot tells a story. 📽️🎨",
    "visuals",
    1,
    37.7749,
    -122.4194,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'cienna.mov')
),
-- 91
(
    "Have you ever thought about how dreams might be another form of reality? Maybe we’re all just experiencing different dimensions when we sleep. 🛌💭",
    "dreams",
    1,
    59.3293,
    18.0686,
    8,
    (SELECT id FROM app_user WHERE personal_id = 'mimimy.stery')
),
-- 92
(
    "What if the strange coincidences in life are just the universe’s way of speaking to us? Maybe everything happens for a reason, even the bizarre. 🔮✨",
    "coincide",
    1,
    58.9690,
    14.6425,
    6,
    (SELECT id FROM app_user WHERE personal_id = 'mimimy.stery')
),
-- 93
(
	"Planning my next trip and can't decide between hiking through the Swiss Alps or exploring the hidden beaches of Southeast Asia. Both have their own magic, but I’m leaning towards the adventure of the mountains. Do you guys prefer the mountains or the beach for a getaway?",
	"travel",
	1,
	55.6761,
	12.5683,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'mimimy.stery')
),
-- 94
(
	"Books can take you to amazing places, but there's something special about experiencing those places in real life. I just finished reading about the streets of Paris, and now I can't wait to see them for myself. Who else loves traveling to the places they've read about in books?",
	"journey",
	1,
	55.6761,
	12.5683,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'mimimy.stery')
),
-- 95
(
	"Just finished reading a mind-bending novel that plays with reality and perception. Can't stop thinking about how the protagonist's journey mirrored my own life in some ways. Have you guys ever experienced that? There's something so powerful about a book that sticks with you long after you've closed the cover.",
	"book",
	1,
	55.6761,
	12.5683,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'mimimy.stery')
),
-- 96
(
	"Just found this amazing oversized blazer trend that's going to be huge this season. Pair it with jeans and boots for the perfect mix of chic and casual. Who else is loving this look?",
	"fashion",
	1,
	44.0473,
	-72.5714,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'saw.ord')
),
-- 97
(
	"Stumbled upon a viral TikTok hack that makes your old clothes look brand new. I can't believe it took me this long to find it! Definitely going to try it out. Anyone else addicted to finding new TikTok gems?",
	"viral",
	1,
	44.0473,
	-72.5714,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'saw.ord')
),
-- 98
(
	"Obsessed with the new pastel color trend for spring. Pastels are making a huge comeback, and I’m here for it. They’re soft, fresh, and so versatile. Who's ready to rock this trend?",
	"trendy",
	1,
	44.0473,
	-72.5714,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'saw.ord')
),
-- 99
(
	"Some days, it's all about the effortlessly chic vibe. A white tee, high-waisted jeans, and a good pair of sneakers. Sometimes the simplest looks are the best. How do you guys keep it stylish without overthinking it?",
	"style",
	1,
	44.0473,
	-72.5714,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'saw.ord')
),
-- 100
(
	"Trying out the oversized trench coat look this week. It's perfect for layering, and it gives off those cool, Parisian vibes. Anyone else into this street-style trend?",
	"coat",
	1,
	44.0473,
	-72.5714,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'saw.ord')
),
-- 101
(
	"Just had the best time at the school dance! Everyone was dancing, laughing, and just having so much fun. Can't wait for the next one. Who's ready to do it all over again?",
	"dance",
	1,
	37.7749,
	-122.4194,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'itsbeki.m.')
),
-- 102
(
	"Spending the day with my besties at the mall. We can't stop laughing and trying on ridiculous outfits! This is what makes life so much fun! What’s your favorite weekend hangout spot?",
	"friends",
	1,
	37.7749,
	-122.4194,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'itsbeki.m.')
),
-- 103
(
	"Just made the most delicious chocolate chip cookies ever! Now I’m ready for a movie marathon. Who’s in the mood for a cozy movie night? I’m all about the popcorn!",
	"cookies",
	1,
	37.7749,
	-122.4194,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'itsbeki.m.')
),
-- 104
(
	"Okay, confession time: I totally have a crush on the guy in my chemistry class. I mean, how could I not? He’s always so sweet and funny. Anyone else feeling the same way about someone?",
	"crush",
	1,
	37.7749,
	-122.4194,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'itsbeki.m.')
),
-- 105
(
	"Today was such a good day! Had a blast at the amusement park with the crew. Rollercoasters, cotton candy, and endless laughs. I think I need to do this more often. Who’s up for the next adventure?",
	"amusement",
	1,
	37.7749,
	-122.4194,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'itsbeki.m.')
),
-- 106
(
	"Just finished an insane session on the latest RPG! The graphics and mechanics are mind-blowing. Can’t wait to dive back in tomorrow. Anyone else into this game?",
	"gaming",
	1,
	40.7128,
	-74.0060,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'codewithtom')
),
-- 107
(
	"Been experimenting with the latest AI tech. The potential is limitless, but the learning curve is real. Any fellow devs out there working on similar projects?",
	"AItech",
	1,
	40.7128,
	-74.0060,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'codewithtom')
),
-- 108
(
	"Spent the whole day coding a new feature for my app. It’s a small update, but I’m really proud of how it turned out. Coding is tough, but so rewarding!",
	"coding",
	1,
	40.7128,
	-74.0060,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'codewithtom')
),
-- 109
(
	"Exploring VR games this weekend. The experience is so immersive, it feels like stepping into a new world. I’m excited to see where VR tech will go next.",
	"VRtech",
	1,
	40.7128,
	-74.0060,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'codewithtom')
),
-- 110
(
	"Just read about the latest advancements in quantum computing. It’s incredible to think about where this could take us in the next few years. Anyone else following this field?",
	"quantum",
	1,
	40.7128,
	-74.0060,
	1,
	(SELECT id FROM app_user WHERE personal_id = 'codewithtom')
);

-- 게시글 생성 시간 랜덤 변경 
UPDATE board
SET created_at = DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY)
WHERE id > 0 AND id < 111;