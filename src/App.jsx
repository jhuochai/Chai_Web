import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Intro from './components/Intro';
import CareerTree from './components/CareerTree';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import ChapterExit from './components/ChapterExit';
import MakingOf from './components/MakingOf';
import FloatingCompanion from './components/FloatingCompanion';
import GrainOverlay from './components/GrainOverlay';
import ClickSpark from './components/ClickSpark';
import LoadingScreen from './components/LoadingScreen';
import SmoothScroll from './components/SmoothScroll';
import { LanguageProvider } from './i18n/LanguageContext';
import { getSiteRoute } from './lib/siteRoute';

function Scenes() {
  return (
    <main className="scene-flow">
      <Hero />
      <Intro />
      <ChapterExit chapterId="intro" />
      <CareerTree />
      <ChapterExit chapterId="career" />
      <Portfolio />
      <ChapterExit chapterId="portfolio" />
      <Contact />
      <ChapterExit chapterId="contact" />
    </main>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(getSiteRoute);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  useEffect(() => {
    const syncRoute = () => setRoute(getSiteRoute());
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  return (
    <LanguageProvider>
      <SmoothScroll paused={loading} />
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <ClickSpark sparkColor="#e0bc6a" sparkSize={9} sparkRadius={17} sparkCount={5} duration={550}>
        <GrainOverlay />
        {route === 'making-of' ? (
          <MakingOf />
        ) : (
          <>
            <Nav />
            <Scenes />
            <FloatingCompanion />
          </>
        )}
      </ClickSpark>
    </LanguageProvider>
  );
}

export default App;
