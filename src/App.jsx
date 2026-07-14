import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Intro from './components/Intro';
import CareerTree from './components/CareerTree';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import SceneSkeleton from './components/SceneSkeleton';
import GrainOverlay from './components/GrainOverlay';
import ClickSpark from './components/ClickSpark';
import LoadingScreen from './components/LoadingScreen';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

function Scenes() {
  const { t } = useLanguage();
  const { scenes } = t;

  return (
    <main>
      <Hero />
      <Intro />
      <CareerTree />
      <SceneSkeleton id="scene-4" title={scenes.scene4.title} note={scenes.scene4.note} />
      <Portfolio />
      <SceneSkeleton id="scene-6" title={scenes.scene6.title} note={scenes.scene6.note} />
      <Contact />
    </main>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <LanguageProvider>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <ClickSpark sparkColor="#e0bc6a" sparkSize={9} sparkRadius={17} sparkCount={5} duration={550}>
        <GrainOverlay />
        <Nav />
        <Scenes />
      </ClickSpark>
    </LanguageProvider>
  );
}

export default App;
