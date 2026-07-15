import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Intro from './components/Intro';
import CareerTree from './components/CareerTree';
import Interests from './components/Interests';
import Portfolio from './components/Portfolio';
import BuildStory from './components/BuildStory';
import Contact from './components/Contact';
import FloatingCompanion from './components/FloatingCompanion';
import GrainOverlay from './components/GrainOverlay';
import ClickSpark from './components/ClickSpark';
import LoadingScreen from './components/LoadingScreen';
import { LanguageProvider } from './i18n/LanguageContext';

function Scenes() {
  return (
    <main>
      <Hero />
      <Intro />
      <CareerTree />
      <Interests />
      <Portfolio />
      <BuildStory />
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
        <FloatingCompanion />
      </ClickSpark>
    </LanguageProvider>
  );
}

export default App;
