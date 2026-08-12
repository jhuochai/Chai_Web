import { describe, expect, it } from 'vitest';
import { content } from './content';
import { chapterMap } from './chapterMap';

describe('chaptered portfolio content', () => {
  it('defines four hero entries and eleven distinct games in both languages', () => {
    for (const lang of ['zh', 'en']) {
      expect(content[lang].hero.entries).toHaveLength(4);
      expect(content[lang].careerTree.flowers).toHaveLength(11);
      expect(new Set(content[lang].careerTree.flowers.map((game) => game.id)).size).toBe(11);
    }
  });

  it('keeps the chapter order stable', () => {
    expect(chapterMap.map((chapter) => chapter.id)).toEqual([
      'intro', 'career', 'portfolio', 'contact',
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
      '自我介紹', '生涯大樹', '精選作品', 'AI 實驗室',
    ]);
  });

  it('keeps the bilingual game IDs aligned', () => {
    const expectedIds = [
      'mlbb', 'identity-v', 'stardew', 'lol', 'valorant', 'r6', 'gta5',
      'minecraft', 'palworld', 'dont-starve', 'raft',
    ];
    for (const lang of ['zh', 'en']) {
      expect(content[lang].careerTree.flowers.map((game) => game.id)).toEqual(expectedIds);
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
  it('has four day ribbons and eleven night flowers with matching shapes, in both languages', () => {
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
      expect(tree.flowers).toHaveLength(11);
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
});
