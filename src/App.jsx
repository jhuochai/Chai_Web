import { useEffect, useRef, useState } from 'react';
import Nav from './components/Nav';
import StationControls from './components/StationControls';
import Hero from './components/Hero';
import Intro from './components/Intro';
import CareerTree from './components/CareerTree';
import Portfolio from './components/Portfolio';
import AiLab from './components/AiLab';
import ChapterTransition from './components/ChapterTransition';
import MakingOf from './components/MakingOf';
import Contact from './components/Contact';
import GrainOverlay from './components/GrainOverlay';
import ClickSpark from './components/ClickSpark';
import LoadingScreen from './components/LoadingScreen';
import SmoothScroll from './components/SmoothScroll';
import { LanguageProvider } from './i18n/LanguageContext';
import { getSiteRoute, navigateToRoute } from './lib/siteRoute';
import { playStationTransition } from './lib/chapterTransition';
import { acquireBodyScrollLock } from './lib/bodyScrollLock';
import { waitForSceneAssets } from './lib/sceneReady';

function StationScene({ route, onTravel }) {
  const controls = <StationControls currentRoute={route} onTravel={onTravel} />;
  const station = {
    cockpit: <Hero />,
    profile: <Intro />,
    'career-tree': <CareerTree controls={controls} />,
    portfolio: <Portfolio />,
    'ai-lab': <AiLab controls={controls} />,
  }[route] ?? <Hero />;

  return (
    <main className="scene-flow">
      {station}
      {!['career-tree', 'ai-lab'].includes(route) && controls}
    </main>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(getSiteRoute);
  const [contactOpen, setContactOpen] = useState(false);
  const [travelling, setTravelling] = useState(false);
  const focusTimerRef = useRef(null);

  useEffect(() => {
    if (!loading) return undefined;
    return acquireBodyScrollLock();
  }, [loading]);

  useEffect(() => {
    const syncRoute = () => {
      setContactOpen(false);
      setRoute(getSiteRoute());
    };
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  useEffect(() => () => window.clearTimeout(focusTimerRef.current), []);

  const completeStationTravel = async (pathname, { signal } = {}) => {
    navigateToRoute(pathname);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    // Let React commit the destination before inspecting its visible assets.
    await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
    if (signal?.aborted) return;
    await waitForSceneAssets(document.querySelector('.scene-flow'), { signal });
  };

  const focusDestination = () => {
    window.clearTimeout(focusTimerRef.current);
    focusTimerRef.current = window.setTimeout(() => {
      const stationRoot = document.querySelector('.scene-flow > section');
      const focusTarget = stationRoot?.querySelector('h1, h2, h3') ?? stationRoot;
      if (!focusTarget) return;
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    }, 0);
  };

  return (
    <LanguageProvider>
      <SmoothScroll paused={loading || travelling} />
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <div inert={travelling ? true : undefined}>
      <ClickSpark sparkColor="#e0bc6a" sparkSize={9} sparkRadius={17} sparkCount={5} duration={550}>
        <GrainOverlay />
        {route === 'making-of' ? (
          <MakingOf />
        ) : (
          <>
            <Nav
              currentRoute={route}
              onTravel={playStationTransition}
              onOpenContact={() => setContactOpen(true)}
            />
            <StationScene route={route} onTravel={playStationTransition} />
            <Contact
              open={contactOpen}
              onClose={() => setContactOpen(false)}
              returnFocusTo={() => document.querySelector('.nav__route-map')}
            />
          </>
        )}
      </ClickSpark>
      </div>
      {route !== 'making-of' && <ChapterTransition onTravel={completeStationTravel} onComplete={focusDestination} onActiveChange={setTravelling} />}
    </LanguageProvider>
  );
}

export default App;
