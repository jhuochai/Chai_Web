import thirtyK from '../assets/cases/cat-cafe/thirty-k.webp';
import watermelonCat from '../assets/cases/cat-cafe/watermelon-cat.webp';
import outfitGuide from '../assets/cases/cat-cafe/outfit-guide.webp';
import mealSpinner from '../assets/cases/cat-cafe/meal-spinner.webp';
import ufoDay from '../assets/cases/cat-cafe/ufo-day.webp';
import motherDay from '../assets/cases/cat-cafe/mother-day.webp';
import oceanDay from '../assets/cases/cat-cafe/ocean-day.webp';
import donation from '../assets/cases/cat-cafe/donation.webp';
import version120 from '../assets/cases/cat-cafe/version-120.webp';

const assets = {
  thirtyK,
  watermelonCat,
  outfitGuide,
  mealSpinner,
  ufoDay,
  motherDay,
  oceanDay,
  donation,
  version120,
};

const zh = {
  pageTitle: '影像分析艙',
  pageIntro: '不是把貼文排成一面牆，而是回頭看每一種內容，究竟讓玩家做了什麼。',
  title: '貓咪造咖',
  subtitle: '從內容節奏到社群成長的實戰紀錄',
  growth: 'IG 追蹤從 18k → 30k（+67%）',
  summary: '我獨立負責 FB、IG、Threads 的內容企劃、發佈與社群回覆，並把角色、節慶、互動機制與遊戲資訊拆成可持續測試的內容支柱。',
  hero: {
    src: assets.thirtyK,
    title: '三萬粉系列里程碑',
    alt: '貓咪造咖三萬粉系列第一篇影片主視覺，貓咪角色站在明亮宮殿中央。',
    note: '畫面為本機保存的三萬粉系列第一篇；下列成效來自成效表中的「三萬粉－2」。待第二篇成品補入後，這張主圖會一併替換。',
  },
  metrics: [
    { id: 'impressions', value: '51,173', label: '曝光' },
    { id: 'interactions', value: '3,898', label: '互動' },
    { id: 'comments', value: '1,476', label: '留言' },
    { id: 'shares', value: '383', label: '分享' },
    { id: 'follows', value: '50', label: '新增追蹤' },
  ],
  evidenceHeading: '八張素材，四種內容任務',
  evidenceIntro: '每張圖都回答一個不同問題：為什麼玩家會停下來、留下、分享，或回來再看一次。',
  pillars: [
    {
      id: 'character-needs',
      title: '角色與玩家需求',
      description: '讓角色不只可愛，也能回應玩家正在找的資訊。',
      items: [
        {
          id: 'watermelon-cat',
          src: assets.watermelonCat,
          title: '7 月水果貓',
          alt: '以西瓜為主題的貓咪造咖角色社群素材。',
          format: 'static',
          formatLabel: '角色貼文',
          proof: '80 次收藏，為整理表中收藏最高的內容；角色題材同時具有娛樂與保存價值。',
        },
        {
          id: 'outfit-guide',
          src: assets.outfitGuide,
          title: '服裝升級攻略',
          alt: '貓咪造咖服裝升級攻略的第一張說明圖。',
          format: 'static',
          formatLabel: '攻略圖文',
          proof: '以玩家會實際查找的問題切入，帶來 22 則留言，讓實用資訊成為交流入口。',
        },
      ],
    },
    {
      id: 'resonance',
      title: '玩家共鳴與互動機制',
      description: '設計值得傳給朋友、也值得留著再玩的內容。',
      items: [
        {
          id: 'meal-spinner',
          src: assets.mealSpinner,
          title: '吃啥咪轉盤',
          alt: '貓咪造咖吃啥咪互動轉盤短影音封面。',
          format: 'video-poster',
          formatLabel: '互動短影音封面',
          proof: '121 次分享、42 次收藏；把「不知道吃什麼」變成可重複使用的玩家小工具。',
        },
        {
          id: 'ufo-day',
          src: assets.ufoDay,
          title: '世界幽浮日',
          alt: '貓咪造咖世界幽浮日靜態社群素材。',
          format: 'static',
          formatLabel: '節慶靜態貼文',
          proof: '198 次分享、684 次互動；用節慶梗接住角色調性，讓玩家自然把內容往外傳。',
        },
      ],
    },
    {
      id: 'festivals',
      title: '活動與節慶節奏',
      description: '在節日裡找到品牌能說、玩家也願意接的那一句話。',
      items: [
        {
          id: 'mother-day',
          src: assets.motherDay,
          title: '母親節',
          alt: '貓咪造咖母親節主題社群素材。',
          format: 'static',
          formatLabel: '節慶貼文',
          proof: '12,523 觸及、993 次互動、337 次分享，並帶來 14 個追蹤。',
        },
        {
          id: 'ocean-day',
          src: assets.oceanDay,
          title: '世界海洋日',
          alt: '貓咪造咖世界海洋日主題社群素材。',
          format: 'static',
          formatLabel: '節慶貼文',
          proof: '358 次分享；把公共節日轉成符合遊戲世界觀、玩家願意擴散的題目。',
        },
      ],
    },
    {
      id: 'brand-info',
      title: '品牌與遊戲資訊',
      description: '公告不必只是交代事情，也可以維持品牌語氣與閱讀動機。',
      items: [
        {
          id: 'donation',
          src: assets.donation,
          title: '捐款收據',
          alt: '貓咪造咖公益捐款收據資訊素材。',
          format: 'static',
          formatLabel: '品牌資訊',
          proof: '1,342 次互動；用清楚的視覺與語氣處理信任資訊，仍然得到玩家強烈回應。',
        },
        {
          id: 'version-120',
          src: assets.version120,
          title: 'v1.20 版更預告',
          alt: '貓咪造咖 v1.20 版本更新預告的第一張資訊圖。',
          format: 'static',
          formatLabel: '版本資訊',
          proof: '76 則留言、96 次分享；把功能公告寫成玩家願意討論的更新預告。',
        },
      ],
    },
  ],
  lightbox: {
    openPrefix: '放大檢視：',
    close: '關閉作品檢視',
  },
  darkChess: {
    title: '暗棋廣告受眾測試',
    intro: '一個沒有被包裝成成功案例的真實測試。',
    hypothesisLabel: '假設',
    hypothesis: '以 1 萬元預算，測試新的受眾輪廓與素材組合是否值得繼續放大。',
    signalLabel: '實際訊號',
    signal: '從 Meta 後台讀取 CPI、CPM、CTR、CVR、IR；實際成效未達預期。',
    decisionLabel: '決定',
    decision: '即時停止投放，把預算留給下一個更有證據的方向。',
  },
};

const en = {
  pageTitle: 'Selected Work',
  pageIntro: 'Not a wall of posts, but a closer look at what each kind of content prompted players to do.',
  title: 'Cat Café',
  subtitle: 'A working record of content rhythm and community growth',
  growth: 'Instagram grew from 18k → 30k followers (+67%)',
  summary: 'I independently planned, published, and managed replies across Facebook, Instagram, and Threads, turning character stories, seasonal moments, interaction mechanics, and game information into repeatable content pillars.',
  hero: {
    src: assets.thirtyK,
    title: 'The 30k milestone series',
    alt: 'Key visual from part one of the Cat Café 30k-follower series, with the cat character centered in a bright palace.',
    note: 'The visual is the locally preserved part-one asset; the metrics below belong to “30k followers — 2” in the performance sheet. This image will be replaced when that exact final asset is added.',
  },
  metrics: [
    { id: 'impressions', value: '51,173', label: 'Impressions' },
    { id: 'interactions', value: '3,898', label: 'Interactions' },
    { id: 'comments', value: '1,476', label: 'Comments' },
    { id: 'shares', value: '383', label: 'Shares' },
    { id: 'follows', value: '50', label: 'New follows' },
  ],
  evidenceHeading: 'Eight pieces, four content jobs',
  evidenceIntro: 'Each piece answers a different question: why would a player stop, stay, share, or return to it?',
  pillars: [
    {
      id: 'character-needs',
      title: 'Characters and player needs',
      description: 'Character content can entertain while answering what players are actively looking for.',
      items: [
        { id: 'watermelon-cat', src: assets.watermelonCat, title: 'July Watermelon Cat', alt: 'A Cat Café character post themed around a watermelon cat.', format: 'static', formatLabel: 'Character post', proof: '80 saves—the highest save count in the performance sheet—showing both entertainment and keep-for-later value.' },
        { id: 'outfit-guide', src: assets.outfitGuide, title: 'Outfit upgrade guide', alt: 'The first panel of a Cat Café outfit upgrade guide.', format: 'static', formatLabel: 'How-to carousel', proof: 'A practical answer to a real player question generated 22 comments and opened a useful conversation.' },
      ],
    },
    {
      id: 'resonance',
      title: 'Player resonance and interaction',
      description: 'Content designed to be sent to a friend—or kept to use again.',
      items: [
        { id: 'meal-spinner', src: assets.mealSpinner, title: 'What should I eat? spinner', alt: 'Poster for the Cat Café interactive meal-spinner short video.', format: 'video-poster', formatLabel: 'Interactive video poster', proof: '121 shares and 42 saves turned an everyday choice into a small, reusable player tool.' },
        { id: 'ufo-day', src: assets.ufoDay, title: 'World UFO Day', alt: 'Static Cat Café post for World UFO Day.', format: 'static', formatLabel: 'Static seasonal post', proof: '198 shares and 684 interactions connected a seasonal joke with the game’s character voice.' },
      ],
    },
    {
      id: 'festivals',
      title: 'Campaign and seasonal rhythm',
      description: 'Finding the seasonal idea the brand can own and players will answer.',
      items: [
        { id: 'mother-day', src: assets.motherDay, title: 'Mother’s Day', alt: 'Cat Café Mother’s Day social creative.', format: 'static', formatLabel: 'Seasonal post', proof: '12,523 reach, 993 interactions, 337 shares, and 14 new follows.' },
        { id: 'ocean-day', src: assets.oceanDay, title: 'World Oceans Day', alt: 'Cat Café World Oceans Day social creative.', format: 'static', formatLabel: 'Seasonal post', proof: '358 shares turned a public observance into a topic that felt native to the game world.' },
      ],
    },
    {
      id: 'brand-info',
      title: 'Brand and game information',
      description: 'Updates can stay useful without dropping the brand voice or the reason to keep reading.',
      items: [
        { id: 'donation', src: assets.donation, title: 'Donation receipt', alt: 'Cat Café donation receipt and charity update creative.', format: 'static', formatLabel: 'Brand information', proof: '1,342 interactions showed that clear trust-building information can still earn a strong response.' },
        { id: 'version-120', src: assets.version120, title: 'v1.20 update teaser', alt: 'The first information panel for the Cat Café v1.20 update teaser.', format: 'static', formatLabel: 'Game update', proof: '76 comments and 96 shares turned a feature announcement into a player discussion.' },
      ],
    },
  ],
  lightbox: {
    openPrefix: 'Open detail: ',
    close: 'Close work detail',
  },
  darkChess: {
    title: 'Dark Chess audience test',
    intro: 'A real test, kept honest instead of rewritten as a win.',
    hypothesisLabel: 'Hypothesis',
    hypothesis: 'Use a NT$10,000 budget to test whether a new audience profile and creative mix deserved more spend.',
    signalLabel: 'Observed signal',
    signal: 'I read CPI, CPM, CTR, CVR, and IR in Meta Ads Manager; actual performance fell short of expectations.',
    decisionLabel: 'Decision',
    decision: 'I stopped the campaign in time and kept the remaining budget for a direction with stronger evidence.',
  },
};

export const catCafeCase = { zh, en };
