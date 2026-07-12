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

describe('content.scenes', () => {
  it('has placeholder title+note for every skeleton scene, in both languages', () => {
    for (const lang of ['en', 'zh']) {
      for (const key of ['scene0', 'scene2', 'scene3', 'scene4', 'scene6']) {
        expect(content[lang].scenes[key]).toEqual(
          expect.objectContaining({ title: expect.any(String), note: expect.any(String) })
        );
      }
    }
  });
});
