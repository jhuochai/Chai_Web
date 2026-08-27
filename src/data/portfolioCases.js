import { catCafeCase } from './catCafeCase';
import outfitGuide01 from '../assets/cases/cat-cafe/2026/outfit-guide-01.jpg';
import outfitGuide02 from '../assets/cases/cat-cafe/2026/outfit-guide-02.jpg';
import outfitGuide03 from '../assets/cases/cat-cafe/2026/outfit-guide-03.jpg';
import outfitGuide04 from '../assets/cases/cat-cafe/2026/outfit-guide-04.jpg';
import mealSpinnerVideo from '../assets/cases/cat-cafe/2026/meal-spinner-final-1000x1000.mp4';
import catCafeCard from '../assets/portfolio/cat-cafe-case-card-v1.webp';
import darkChessCard from '../assets/portfolio/dark-chess-case-card-v1.webp';

function dataCover(title, subtitle) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1100">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#122833"/><stop offset="1" stop-color="#111014"/>
        </linearGradient>
        <pattern id="p" width="52" height="52" patternUnits="userSpaceOnUse">
          <path d="M52 0H0V52" fill="none" stroke="#5ec4d5" stroke-opacity=".12"/>
        </pattern>
      </defs>
      <rect width="900" height="1100" fill="url(#g)"/>
      <rect x="42" y="42" width="816" height="1016" rx="22" fill="url(#p)" stroke="#d4ac55" stroke-width="4"/>
      <path d="M120 210H780M120 890H780" stroke="#5ec4d5" stroke-opacity=".45" stroke-width="3"/>
      <circle cx="450" cy="550" r="220" fill="none" stroke="#d4ac55" stroke-opacity=".5" stroke-width="3" stroke-dasharray="12 20"/>
      <text x="450" y="510" fill="#f1e8d8" font-size="60" font-family="serif" text-anchor="middle">${title}</text>
      <text x="450" y="590" fill="#79d0dc" font-size="30" font-family="sans-serif" text-anchor="middle">${subtitle}</text>
      <text x="450" y="970" fill="#d4ac55" font-size="22" font-family="monospace" text-anchor="middle" letter-spacing="8">DATA RECORD</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const purposeById = {
  zh: {
    'watermelon-cat': '用角色主題創造可收藏、可回看的社群內容。',
    'outfit-guide': '把玩家常見的服裝升級問題整理成容易理解的攻略。',
    'meal-spinner': '把日常選擇變成玩家願意分享、保存並重複使用的互動。',
    'ufo-day': '把節慶梗轉成符合角色語氣的擴散題材。',
    'mother-day': '在母親節檔期同時爭取觸及、分享與新追蹤。',
    'ocean-day': '把公共節日改寫成遊戲社群願意轉傳的角色內容。',
    donation: '清楚交代公益行動，讓信任資訊仍保有閱讀動機。',
    'version-120': '讓版本公告不只傳遞資訊，也能引發玩家討論。',
  },
  en: {
    'watermelon-cat': 'Make character content worth saving and revisiting.',
    'outfit-guide': 'Turn a common outfit-upgrade question into an easy-to-follow guide.',
    'meal-spinner': 'Turn an everyday choice into an interaction players would share, save, and reuse.',
    'ufo-day': 'Translate a seasonal joke into the game characters’ voice.',
    'mother-day': 'Earn reach, shares, and new follows during the Mother’s Day moment.',
    'ocean-day': 'Turn a public observance into character content players would pass along.',
    donation: 'Communicate a charity action clearly without losing reading interest.',
    'version-120': 'Make an update announcement invite discussion as well as inform.',
  },
};

function makeCatItems(lang) {
  const source = catCafeCase[lang];
  const role = lang === 'zh'
    ? '社群內容企劃、發佈與社群回覆。'
    : 'Social content planning, publishing, and community replies.';
  const hero = {
    id: 'thirty-k-hero',
    type: 'image',
    src: source.hero.src,
    alt: source.hero.alt,
    title: source.hero.title,
    purpose: lang === 'zh'
      ? '把三萬粉里程碑從單向公告，轉成玩家共同參與與擴散的社群事件。'
      : 'Turn the 30k milestone from a one-way announcement into a shared community event.',
    role,
    proof: [source.hero.note, ...source.metrics.map((metric) => `${metric.label} ${metric.value}`)],
  };

  const evidence = source.pillars.flatMap((pillar) => pillar.items).map((item) => ({
    id: item.id,
    type: 'image',
    src: item.src,
    alt: item.alt,
    title: item.title,
    purpose: purposeById[lang][item.id],
    role,
    proof: [item.proof],
  }));

  const processRole = lang === 'zh'
    ? '規劃內容順序與資訊節奏，整理成四張可連續閱讀的社群素材。'
    : 'Planned the information order and pacing across a four-card social carousel.';
  const outfitSources = [outfitGuide01, outfitGuide02, outfitGuide03, outfitGuide04];
  const processItems = outfitSources.map((src, index) => ({
    id: `outfit-guide-2026-${index + 1}`,
    type: 'image',
    src,
    alt: lang === 'zh'
      ? `貓咪造咖服裝攻略四張輪播的第 ${index + 1} 張。`
      : `Card ${index + 1} of the four-card Cat Café outfit guide.`,
    title: lang === 'zh' ? `服裝攻略完整輪播 · ${index + 1}/4` : `Complete outfit guide · ${index + 1}/4`,
    purpose: lang === 'zh'
      ? '完整呈現一則攻略如何從問題、步驟一路收束到行動。'
      : 'Show how one guide moves from the question through the steps to an action.',
    role: processRole,
    proof: [lang === 'zh'
      ? `4 張正式對稿素材中的第 ${index + 1} 張；此處作為創作流程證據，不沿用舊貼文成效。`
      : `Final review card ${index + 1} of 4; shown as process evidence without reusing older post metrics.`],
  }));

  const videoItem = {
    id: 'meal-spinner-video-2026',
    type: 'video',
    src: mealSpinnerVideo,
    poster: source.pillars.flatMap((pillar) => pillar.items).find((item) => item.id === 'meal-spinner').src,
    alt: lang === 'zh' ? '貓咪造咖吃啥咪互動短影音成品。' : 'Final Cat Café meal-spinner short video.',
    title: lang === 'zh' ? '吃啥咪互動短影音成品' : 'Meal-spinner final video',
    purpose: purposeById[lang]['meal-spinner'],
    role: lang === 'zh'
      ? '規劃互動概念與社群呈現，將成品整理為可直接播放的案例證據。'
      : 'Planned the interaction concept and social presentation, then preserved the playable final output.',
    proof: [lang === 'zh'
      ? '實際 1000×1000 MP4 成品；此處只證明互動形式與完成度，不套用其他年份素材的成效數字。'
      : 'Actual 1000×1000 MP4 final; presented as format and completion evidence without borrowing metrics from another asset.'],
  };

  return [hero, ...evidence, ...processItems, videoItem];
}

function makePortfolio(lang) {
  const cat = catCafeCase[lang];
  const isZh = lang === 'zh';
  return {
    pageTitle: isZh ? '影像分析艙' : 'Analysis Bay',
    pageIntro: isZh
      ? '選一份案例，進入分析桌查看目的、我的角色、成效證據與學到的事。'
      : 'Choose a case, then inspect its purpose, my role, evidence, and learning at the analysis desk.',
    viewportLabel: isZh ? '作品案例環形觀景窗' : 'Circular case viewport',
    selectPrefix: isZh ? '開啟案例：' : 'Open case: ',
    selected: isZh ? '目前選取' : 'Selected',
    controls: {
      close: isZh ? '關閉案例分析桌' : 'Close case analysis desk',
      dialogSuffix: isZh ? '案例分析桌' : 'case analysis desk',
      purpose: isZh ? '素材目的' : 'Purpose',
      role: isZh ? '我的工作' : 'My role',
      evidence: isZh ? '成效證據' : 'Evidence',
      learning: isZh ? '學習' : 'Learning',
      previous: isZh ? '上一張' : 'Previous',
      next: isZh ? '下一張' : 'Next',
      play: isZh ? '播放影片' : 'Play video',
      unavailable: isZh ? '媒體暫時無法顯示' : 'Media unavailable',
    },
    caveat: isZh
      ? '資料註記：部分 7 月貼文的互動率使用曝光數、其他貼文使用觸及數作為分母，因此不直接橫向比較互動率；案例以可核實的互動、留言、分享與追蹤數呈現。'
      : 'Data note: some July engagement rates use impressions while earlier posts use reach as the denominator, so rates are not compared directly. The case uses verified interactions, comments, shares, and follows.',
    cases: [
      {
        id: 'cat-cafe',
        title: cat.title,
        card: catCafeCard,
        cover: cat.hero.src,
        coverKind: 'image',
        summary: cat.summary,
        items: makeCatItems(lang),
      },
      {
        id: 'dark-chess',
        title: cat.darkChess.title,
        card: darkChessCard,
        cover: dataCover(isZh ? '暗棋' : 'DARK CHESS', isZh ? '受眾測試紀錄' : 'AUDIENCE TEST'),
        coverKind: 'data',
        summary: cat.darkChess.intro,
        items: [
          {
            id: 'dark-chess-test',
            type: 'data',
            alt: isZh ? '暗棋廣告受眾測試資料卡。' : 'Dark Chess audience test data card.',
            title: cat.darkChess.title,
            purpose: cat.darkChess.hypothesis,
            role: isZh
              ? '在 Meta Ads Manager 讀取 CPI、CPM、CTR、CVR 與 IR，依訊號判斷是否繼續投放。'
              : 'Read CPI, CPM, CTR, CVR, and IR in Meta Ads Manager to decide whether to continue.',
            proof: [cat.darkChess.signal, cat.darkChess.decision],
          },
        ],
      },
    ],
  };
}

export const portfolioCases = {
  zh: makePortfolio('zh'),
  en: makePortfolio('en'),
};
