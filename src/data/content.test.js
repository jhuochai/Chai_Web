import { content } from './content';

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
  it('has four day ribbons and four night flowers with matching shapes, in both languages', () => {
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
      expect(tree.flowers).toHaveLength(4);
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
