import { describe, expect, it } from 'vitest';
import { content } from './content';
import { STATIONS } from './stations';

describe('chaptered portfolio content', () => {
  it('defines four hero entries and twelve distinct games in both languages', () => {
    for (const lang of ['zh', 'en']) {
      expect(content[lang].hero.entries).toHaveLength(4);
      expect(content[lang].careerTree.flowers).toHaveLength(12);
      expect(new Set(content[lang].careerTree.flowers.map((game) => game.id)).size).toBe(12);
    }
  });

  it('keeps the chapter order stable', () => {
    expect(STATIONS.filter((station) => station.next).map((station) => station.id)).toEqual([
      'cockpit', 'profile', 'career-tree', 'portfolio', 'ai-lab',
    ]);
  });

  it('provides a plain-language purpose for every public station', () => {
    expect(STATIONS.map(({ id, purpose }) => [id, purpose])).toEqual([
      ['cockpit', { zh: '航行首頁', en: 'Home' }],
      ['profile', { zh: '關於我', en: 'About me' }],
      ['career-tree', { zh: '經歷與遊戲', en: 'Experience & games' }],
      ['portfolio', { zh: '行銷案例', en: 'Marketing cases' }],
      ['ai-lab', { zh: 'AI 協作與史達普', en: 'AI collaboration & Stapu' }],
      ['making-of', { zh: '網站製作過程', en: 'Website process' }],
    ]);
  });

  it('publishes the real LinkedIn profile', () => {
    for (const lang of ['zh', 'en']) {
      expect(content[lang].contact.linkedin).toBe(
        'https://www.linkedin.com/in/yichen-chai-3019492b4/'
      );
    }
  });

  it('keeps the bilingual hero entry contract aligned', () => {
    const expectedIds = ['intro', 'career', 'portfolio', 'ai-lab'];
    expect(content.en.hero.entries.map((entry) => entry.id)).toEqual(expectedIds);
    expect(content.zh.hero.entries.map((entry) => entry.id)).toEqual(expectedIds);
    expect(content.zh.hero.entries.map((entry) => entry.label)).toEqual([
      '艦長辦公室', '航跡樹站', '影像分析艙', 'AI 實驗艙',
    ]);
    expect(content.en.hero.entries.slice(0, 3).map((entry) => entry.target)).toEqual([
      '/profile', '/career-tree', '/portfolio',
    ]);
    expect(content.en.hero.entries.at(-1)).toMatchObject({ id: 'ai-lab', target: '/ai-lab' });
    expect(content.zh.hero.entries.at(-1)).toMatchObject({ id: 'ai-lab', target: '/ai-lab' });
    expect(content.en.hero.entries.every((entry) => !entry.target?.startsWith('#'))).toBe(true);
  });

  it('defines aligned AI lab copy in both languages', () => {
    const keys = [
      'title', 'petTitle', 'petBody', 'skillsTitle', 'openPet', 'openSkills',
      'returnCockpit', 'disclaimer',
    ];
    expect(Object.keys(content.en.aiLab).sort()).toEqual(keys.sort());
    expect(Object.keys(content.zh.aiLab).sort()).toEqual(keys.sort());
    expect(content.zh.aiLab.disclaimer).toBe('AI 用於初稿探索與資料整理；內容選擇、查證與最終判斷由本人完成。');
  });

  it('does not keep retired hash-route scenes or public proposal placeholders in active hero data', () => {
    for (const lang of ['en', 'zh']) {
      expect(content[lang].hero.scenes).toBeUndefined();
      expect(content[lang].hero.tagline).toBeUndefined();
      expect(content[lang].intro.claim).toBeUndefined();
      expect(content[lang].intro.results).toHaveLength(3);
      expect(content[lang].intro.caseCta).toEqual(expect.any(String));
      expect(content[lang].contact.linkedinPlaceholder).toBeUndefined();
      expect(content[lang].portfolio.cases.some((entry) => entry.id === 'rog')).toBe(false);
      expect(content[lang].closingStatement).toBeUndefined();
    }
  });

  it('defines natural bilingual labels for the intro landmarks', () => {
    expect(content.en.intro).toEqual(expect.objectContaining({
      strengthsLabel: 'Core strengths',
      playerViewTitle: "A player’s eye is where my marketing starts",
    }));
    expect(content.zh.intro).toEqual(expect.objectContaining({
      strengthsLabel: '核心能力',
      playerViewTitle: '玩家視角，是我做行銷的起點',
    }));
    expect(Object.keys(content.en.intro).sort()).toEqual(Object.keys(content.zh.intro).sort());
  });

  it('keeps the bilingual game IDs aligned', () => {
    const expectedIds = [
      'wild-rift', 'identity-v', 'stardew', 'lol', 'valorant', 'r6', 'gta5',
      'minecraft', 'palworld', 'dont-starve', 'raft', 'ready-or-not',
    ];
    for (const lang of ['zh', 'en']) {
      expect(content[lang].careerTree.flowers.map((game) => game.id)).toEqual(expectedIds);
    }
  });

  it('uses the approved twelve game display names exactly', () => {
    expect(content.zh.careerTree.flowers.map(({ id, name }) => [id, name])).toEqual([
      ['wild-rift', '激鬥峽谷'],
      ['identity-v', '第五人格'],
      ['stardew', '星露谷物語'],
      ['lol', '英雄聯盟'],
      ['valorant', 'Valorant'],
      ['r6', '虹彩六號'],
      ['gta5', 'GTA 5'],
      ['minecraft', 'Minecraft'],
      ['palworld', 'Palworld'],
      ['dont-starve', '飢荒'],
      ['raft', 'Raft'],
      ['ready-or-not', 'Ready or Not'],
    ]);
    expect(content.en.careerTree.flowers.map(({ id, name }) => [id, name])).toEqual([
      ['wild-rift', 'Wild Rift'],
      ['identity-v', 'Identity V'],
      ['stardew', 'Stardew Valley'],
      ['lol', 'League of Legends'],
      ['valorant', 'Valorant'],
      ['r6', 'Rainbow Six Siege'],
      ['gta5', 'GTA 5'],
      ['minecraft', 'Minecraft'],
      ['palworld', 'Palworld'],
      ['dont-starve', "Don't Starve Together"],
      ['raft', 'Raft'],
      ['ready-or-not', 'Ready or Not'],
    ]);
  });

  it('keeps the legacy player list aligned until that section is retired', () => {
    for (const lang of ['zh', 'en']) {
      expect(content[lang].portfolio.player.games.map((game) => game.name)).toEqual(
        content[lang].careerTree.flowers.map((game) => game.name)
      );
    }
  });

  it('defines five aligned making-of timeline records in both languages', () => {
    const expectedShape = ['desc', 'id', 'images', 'label'];
    for (const lang of ['zh', 'en']) {
      const timeline = content[lang].makingOf.timeline;
      expect(timeline).toHaveLength(5);
      for (const record of timeline) {
        expect(Object.keys(record).sort()).toEqual(expectedShape);
        expect(record.images).toEqual([]);
      }
    }
    expect(content.zh.makingOf.timeline.map((record) => record.id)).toEqual(
      content.en.makingOf.timeline.map((record) => record.id)
    );
  });

  it('keeps the KOC source case private', () => {
    for (const lang of ['zh', 'en']) {
      const koc = content[lang].portfolio.cases.find((caseStudy) => caseStudy.id === 'koc');
      expect(koc).toEqual(expect.objectContaining({ visibility: 'private' }));
    }
  });

  it('keeps recruiter-facing copy neutral and evidence-bounded outside the unchanged hero', () => {
    for (const lang of ['zh', 'en']) {
      const { hero: _hero, ...recruiterFacingContent } = content[lang];
      const serialized = JSON.stringify(recruiterFacingContent);

      expect(serialized).not.toMatch(/\bsolo\b|\bowning\b|end to end|from zero|from 0 to 1|從0到1|獨立負責|帶動 IG|靠直覺瞄準|多線並行不掉球/i);
      expect(serialized).not.toMatch(/篩選成功率|錄取率|零失誤|創意內容策略驅動/i);
    }
  });
});

describe('content.nav', () => {
  it('has the curated 3-link nav plus cta/lang toggle, in both languages', () => {
    for (const lang of ['en', 'zh']) {
      expect(content[lang].nav).toEqual(
        expect.objectContaining({
          home: expect.any(String),
          story: expect.any(String),
          work: expect.any(String),
          cta: expect.any(String),
          langToggleLabel: expect.any(String),
        })
      );
      expect(content[lang].nav.about).toBeUndefined();
      expect(content[lang].nav.portfolio).toBeUndefined();
      expect(content[lang].nav.contact).toBeUndefined();
    }
  });
});

describe('content.interests', () => {
  it('has the create-immerse-share loop, two hobbies, and two strengths, in both languages', () => {
    for (const lang of ['en', 'zh']) {
      const interests = content[lang].interests;
      expect(interests.loop).toHaveLength(3);
      expect(interests.hobbies).toHaveLength(2);
      expect(interests.strengths).toHaveLength(2);
      for (const strength of interests.strengths) {
        expect(strength).toEqual(
          expect.objectContaining({ id: expect.any(String), title: expect.any(String), desc: expect.any(String) })
        );
      }
    }
  });
});

describe('content.buildStory', () => {
  it('has the five build-process steps in both languages', () => {
    for (const lang of ['en', 'zh']) {
      const story = content[lang].buildStory;
      expect(story.steps).toHaveLength(5);
      expect(story.steps.map((s) => s.key)).toEqual([
        'concept',
        'design',
        'content',
        'build',
        'iterate',
      ]);
    }
  });
});

describe('content.careerTree', () => {
  it('has four day ribbons and twelve night flowers with matching shapes, in both languages', () => {
    for (const lang of ['en', 'zh']) {
      const tree = content[lang].careerTree;
      expect(tree.ribbons).toHaveLength(4);
      for (const ribbon of tree.ribbons) {
        expect(ribbon).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            org: expect.any(String),
            role: expect.any(String),
            period: expect.any(String),
            points: expect.any(Array),
          })
        );
        expect(ribbon.points.length).toBeGreaterThan(0);
      }
      expect(tree.flowers).toHaveLength(12);
      for (const flower of tree.flowers) {
        expect(flower).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            desc: expect.any(String),
          })
        );
      }
      expect(tree.dayLabel).toEqual(expect.any(String));
      expect(tree.nightLabel).toEqual(expect.any(String));
    }
  });

  it('keeps ribbon/flower ids aligned across languages', () => {
    const enIds = content.en.careerTree.ribbons.map((r) => r.id);
    const zhIds = content.zh.careerTree.ribbons.map((r) => r.id);
    expect(enIds).toEqual(zhIds);
    const enFlowers = content.en.careerTree.flowers.map((f) => f.id);
    const zhFlowers = content.zh.careerTree.flowers.map((f) => f.id);
    expect(enFlowers).toEqual(zhFlowers);
  });

  it('provides aligned instructions for opening a career ribbon', () => {
    expect(content.en.careerTree).toEqual(expect.objectContaining({
      dayHint: 'Select a ribbon to open a work chapter',
    }));
    expect(content.zh.careerTree).toEqual(expect.objectContaining({
      dayHint: '點擊絲帶，展開一段工作經歷',
    }));
  });
});
