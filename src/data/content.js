const en = {
  nav: {
    home: 'Home',
    about: 'Experience',
    portfolio: 'Work',
    contact: 'Contact',
    cta: 'Contact Me',
    langToggleLabel: 'Switch to Chinese',
  },
  name: {
    display: 'Chai Yi Chen',
    sub: '柴怡辰',
  },
  title: 'Game Marketing Coordinator',
  positioning: {
    before: 'A game marketing coordinator who pitches ideas on ',
    emphasis: 'instinct and creativity',
    after:
      ", then executes them fast. I've built social growth, ad audience tests, and KOC partnerships from zero, and I keep stacking real-world cases.",
  },
  traits: [
    {
      key: 'efficiency',
      label: 'Efficiency',
      desc: 'Fast from idea to execution, with results to show in short cycles.',
    },
    {
      key: 'multitasking',
      label: 'Multitasking',
      desc: 'Ran two product communities, 貓咲造咖 and 暗棋, in parallel without dropping either.',
    },
    {
      key: 'creativity',
      label: 'Creativity & Intuition',
      desc: 'Right-brain thinker. I generate ideas and content fast, and trust instinct to set direction.',
    },
  ],
  personalityBlurb:
    "Right-brain by nature, creativity and instinct are what actually drive the work. Data analysis was never the core strength, it's the tool I use to check whether an instinct actually landed. I'm a deep-in player first, and an executor who moves fast and recalibrates as I go.",
  experience: [
    {
      org: '神來也',
      role: 'Marketing Intern',
      period: 'Mar 2026 - Present',
      products: ['貓咲造咖', '暗棋'],
      points: [
        'Grew IG followers from 18k to 30k (+67%), owning content planning, posting, and community replies solo across FB, IG, and Threads.',
        "Ran a NT$10,000 ad test for 暗棋 using Meta's CPI/CPM/CTR/CVR/IR data plus AI-assisted analysis to validate a new audience profile, and pulled the campaign the moment it underperformed to protect budget.",
        'Sourced and closed 3 KOC partnerships, owning deal terms and script outlines end to end.',
        'Produced 24 cross-format assets and 26 shot-and-shipped scripts solo, using Canva, GPT, and Gemini.',
        "Led the concept and rollout for 貓咲造咖's 30k-follower IG celebration campaign.",
      ],
    },
  ],
  highlights: [
    {
      value: '67%',
      label: 'IG follower growth',
      note: '18k to 30k, driven by content strategy, not ad spend.',
    },
    {
      value: 'GA',
      label: 'Google Analytics certified',
      note: "Data checks the instinct, it doesn't replace it.",
    },
    {
      value: '24',
      label: 'Cross-format assets shipped',
      note: 'Plus 26 scripts written and shot, solo.',
    },
  ],
  skills: {
    primary: { label: 'Content Production', items: ['Canva', 'ChatGPT', 'Gemini', 'PowerPoint'] },
    secondary: {
      label: 'Data & Ad Tools',
      items: ['Meta Ads Manager', 'Google Analytics', 'Python & Pandas'],
    },
  },
  credentials: [
    'Google Analytics Certified (Google)',
    'TOEIC 860 (ETS)',
    'MBA Candidate, National Taipei University',
    'BA English, Fu Jen Catholic University',
  ],
  contact: {
    email: 'chaijhuo@gmail.com',
    phone: '0989-521-186',
    location: 'New Taipei City, Taiwan',
    linkedin: null,
    resumeUrl: '/resume.pdf',
    resumeLabel: 'Download Resume',
    linkedinPlaceholder: 'LinkedIn link coming soon',
  },
  messageForm: {
    triggerLabel: 'Leave a Message',
    title: 'Send a Message',
    intro: "This opens your own email app with everything filled in, so it lands in my inbox like a normal email and I can just hit reply.",
    nameLabel: 'Your Name',
    namePlaceholder: 'Jane Doe',
    emailLabel: 'Your Email',
    emailPlaceholder: 'jane@example.com',
    messageLabel: 'Message',
    messagePlaceholder: "What's on your mind?",
    submitLabel: 'Open Email App',
    cancelLabel: 'Cancel',
    closeLabel: 'Close',
    successTitle: 'Almost there',
    successBody: 'Your email app should be open now with the message ready. If nothing happened, email me directly instead.',
    errorRequired: 'Please fill in your name and message.',
  },
  portfolio: {
    heading: 'Selected Work',
    intro:
      "Three real cases from creative pitch to shipped execution. Data is the evidence that the creative worked, not the headline.",
    cases: [
      {
        id: 'catcafe',
        title: '貓咲造咖',
        tag: 'Community Growth',
        scenario: 'A newly launched title needed its brand voice and community built from zero.',
        approach:
          "Owned content planning and scheduling solo across FB, IG, and Threads, then directed the 30k-follower IG celebration campaign end to end.",
        result: 'IG followers grew 18k to 30k (+67%).',
        imageSeed: 'catcafe-community-growth',
      },
      {
        id: 'darkchess',
        title: '暗棋',
        tag: 'Ad Audience Test',
        scenario:
          'Needed to find the highest-value audience profile and creative combination on a tight budget.',
        approach:
          "Ran a NT$10,000 test using Meta's CPI/CPM/CTR/CVR/IR data with AI-assisted analysis, and cut the campaign the moment performance dropped.",
        result: 'Validated a new target audience profile while protecting ad spend.',
        imageSeed: 'darkchess-ad-test',
      },
      {
        id: 'koc',
        title: 'KOC Partnerships',
        tag: 'Creator Collabs',
        scenario: "Needed creator voices outside the brand's own channels to extend reach.",
        approach:
          'Sourced and negotiated 3 KOC partnerships, owning deal terms and writing every script outline myself.',
        result: '3 partnerships shipped, from outreach to published content.',
        imageSeed: 'koc-collaboration',
      },
      {
        id: 'rog',
        title: 'ROG Phone 9 Pitch',
        tag: 'Self-Initiated',
        scenario: 'Wanted to test a marketing pitch for hardcore mobile gamers on my own initiative.',
        approach:
          'Designed a player reward concept and promo material direction, then ran exploratory data analysis on PC player behavior with Python and Pandas to find retention patterns.',
        result: 'A self-driven pitch that pairs creative concept with real behavioral data.',
        imageSeed: 'rog-phone9-pitch',
      },
    ],
    player: {
      heading: "Marketing Through a Player's Eyes",
      desc: "A long-time deep player who understands what players actually think and care about. That's the most direct source of ideas when pitching a campaign.",
      genresNote: 'Spanning MOBA, FPS, survival-social, and sim genres.',
      games: [
        { name: 'Mobile Legends: Bang Bang', note: 'Grandmaster rank' },
        { name: 'Identity V', note: 'Survivor Rank 5' },
        { name: 'Stardew Valley' },
        { name: 'League of Legends' },
        { name: 'Valorant' },
        { name: 'Rainbow Six Siege' },
        { name: 'GTA' },
        { name: 'Minecraft' },
      ],
    },
  },
  closingStatement:
    "Creative sets the direction. Efficiency gets it made. That's how I do game marketing, and what I want to keep doing next.",
  ui: {
    portraitNote: 'Placeholder photo, real portrait coming soon',
    imageNote: 'Placeholder visual, real screenshot coming soon',
    workLabel: 'Approach',
    resultLabel: 'Result',
    timelineHeading: 'Experience Timeline',
    credentialsLabel: 'Credentials',
    footerTag: 'Chai Yi Chen · Game Marketing Coordinator',
  },
};

const zh = {
  nav: {
    home: '首頁',
    about: '個人經歷',
    portfolio: '精選項目',
    contact: '聯繫',
    cta: '聯繫我',
    langToggleLabel: '切換成英文',
  },
  name: {
    display: '柴怡辰',
    sub: 'Chai Yi Chen',
  },
  title: '遊戲行銷企劃',
  positioning: {
    before: '一個靠',
    emphasis: '創意與直覺',
    after: '提出想法、並用高效率把想法落地執行的遊戲行銷企劃新秀，從0到1做過社群成長、廣告受眾測試、KOC合作，並持續累積實戰案例。',
  },
  traits: [
    {
      key: 'efficiency',
      label: '效率',
      desc: '想法到執行的速度快，能在短時間內產出成果。',
    },
    {
      key: 'multitasking',
      label: '多工',
      desc: '同時經營貓咲造咖與暗棋兩款產品的社群，多線並行不掉球。',
    },
    {
      key: 'creativity',
      label: '創意 / 直覺',
      desc: '右腦型人才，擅長提出點子、發想內容，靠直覺判斷方向。',
    },
  ],
  personalityBlurb:
    '自認是右腦型人才，創意與直覺是驅動一切的引擎，數據分析從來不是強項，而是拿來驗證直覺有沒有打中的工具。身分是深度玩家，也是先動手再回頭校準方向的執行者。',
  experience: [
    {
      org: '神來也',
      role: '行銷企劃實習生',
      period: '2026/03 - 至今',
      products: ['貓咲造咖', '暗棋'],
      points: [
        '獨立負責 FB／IG／Threads 三平台內容規劃、發文與留言互動，帶動 IG 粉絲數自 1.8 萬成長至 3 萬，成長幅度達 67%。',
        '獲配 1 萬元預算執行暗棋廣告測試，運用 Meta 後台數據（CPI、CPM、CTR、CVR、IR）搭配 AI 輔助分析驗證新受眾輪廓，成效未達預期時即時終止投放，控管預算風險。',
        '接洽並促成 3 組 KOC 合作，獨立負責條件溝通與腳本大綱撰寫。',
        '運用 Canva、GPT、Gemini 獨立產出 24 件跨形式行銷素材，撰寫 26 份腳本，皆實際拍攝上線。',
        '主導貓咲造咖 IG 三萬粉絲慶祝活動的企劃與執行，統籌視覺方向與社群宣傳排程。',
      ],
    },
  ],
  highlights: [
    {
      value: '67%',
      label: 'IG 粉絲成長',
      note: '1.8萬到3萬，創意內容策略驅動，非投放堆量。',
    },
    {
      value: 'GA',
      label: 'Google Analytics 個人認證',
      note: '用數據驗證直覺，不是靠數據做決策。',
    },
    {
      value: '24',
      label: '跨形式行銷素材產出',
      note: '另撰寫 26 份腳本，皆實際拍攝上線。',
    },
  ],
  skills: {
    primary: { label: '內容產製', items: ['Canva', 'ChatGPT', 'Gemini', 'PowerPoint'] },
    secondary: {
      label: '數據與廣告工具',
      items: ['Meta Ads Manager', 'Google Analytics', 'Python & Pandas'],
    },
  },
  credentials: [
    'Google Analytics 個人認證（Google）',
    'TOEIC 多益 860 分（ETS）',
    '國立臺北大學企業管理研究所 MBA 就讀中',
    '輔仁大學英國語文學系 學士',
  ],
  contact: {
    email: 'chaijhuo@gmail.com',
    phone: '0989-521-186',
    location: '新北市板橋區',
    linkedin: null,
    resumeUrl: '/resume.pdf',
    resumeLabel: '下載履歷',
    linkedinPlaceholder: 'LinkedIn 連結待補',
  },
  messageForm: {
    triggerLabel: '留言給我',
    title: '傳送留言',
    intro: '按下送出後會開啟你自己的郵件軟體，內容已經幫你填好，訊息會像一般email一樣進到我的信箱，我直接回覆即可。',
    nameLabel: '你的名字',
    namePlaceholder: '王小明',
    emailLabel: '你的Email',
    emailPlaceholder: 'name@example.com',
    messageLabel: '留言內容',
    messagePlaceholder: '想跟我說什麼呢？',
    submitLabel: '開啟郵件軟體',
    cancelLabel: '取消',
    closeLabel: '關閉',
    successTitle: '就快好了',
    successBody: '你的郵件軟體應該已經開啟，內容也準備好了。如果沒有反應，也可以直接寄信到我的信箱。',
    errorRequired: '請填寫姓名與留言內容。',
  },
  portfolio: {
    heading: '精選項目',
    intro: '從創意發想到落地執行的三個實戰案例，數據是拿來證明創意有效的證據，不是主角。',
    cases: [
      {
        id: 'catcafe',
        title: '貓咲造咖',
        tag: '社群成長',
        scenario: '新品上線初期，社群聲量與品牌調性都要從零建立。',
        approach: '獨立主導三平台內容企劃與排程，並主導 IG 三萬粉絲慶祝活動的企劃與執行。',
        result: 'IG 粉絲數 1.8萬 → 3萬，成長 67%。',
        imageSeed: 'catcafe-community-growth',
      },
      {
        id: 'darkchess',
        title: '暗棋',
        tag: '廣告受眾測試',
        scenario: '需要在有限預算內找出最有效的受眾輪廓與素材組合。',
        approach: '以1萬元預算執行測試，運用 Meta 後台數據並輔以 AI 分析，成效不如預期時即時終止投放。',
        result: '成功驗證新受眾輪廓，同時控管預算風險。',
        imageSeed: 'darkchess-ad-test',
      },
      {
        id: 'koc',
        title: 'KOC 異業合作',
        tag: '創作者合作',
        scenario: '需要借助品牌外的創作者聲量擴大觸及。',
        approach: '接洽並促成 3 組 KOC 合作，獨立負責條件溝通與腳本大綱撰寫。',
        result: '3 組合作從接洽到上線曝光全數完成。',
        imageSeed: 'koc-collaboration',
      },
      {
        id: 'rog',
        title: 'ROG Phone 9 提案',
        tag: '自主專案',
        scenario: '想為硬核手遊玩家族群自主測試一份行銷提案。',
        approach:
          '設計玩家獎勵機制與宣傳素材概念，並以 Python、Pandas 對 PC 玩家行為數據進行探索性分析，找出留存模式。',
        result: '一份結合創意概念與真實行為數據的自主提案。',
        imageSeed: 'rog-phone9-pitch',
      },
    ],
    player: {
      heading: '玩家視角做行銷',
      desc: '長期是深度玩家，理解玩家在想什麼、在意什麼，是提出行銷點子時最直接的靈感來源。',
      genresNote: '橫跨 MOBA、FPS、生存社交、模擬經營等多元類型。',
      games: [
        { name: '激鬥峽谷', note: '宗師段位' },
        { name: '第五人格', note: '求生五階' },
        { name: '星露谷物語' },
        { name: '英雄聯盟' },
        { name: 'Valorant' },
        { name: '虹彩六號：圍攻行動' },
        { name: 'GTA' },
        { name: 'Minecraft' },
      ],
    },
  },
  closingStatement: '創意提出方向，效率把它做出來。這是我做遊戲行銷企劃的方式，也是接下來想繼續做下去的事。',
  ui: {
    portraitNote: '暫用素材，正式人像待補',
    imageNote: '暫用素材，正式截圖待補',
    workLabel: '做法',
    resultLabel: '成效',
    timelineHeading: '經歷時間軸',
    credentialsLabel: '學歷與資格認證',
    footerTag: '柴怡辰 · 遊戲行銷企劃',
  },
};

export const content = { en, zh };
