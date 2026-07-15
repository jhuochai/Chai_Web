import { useEffect, useRef, useState } from 'react';
import { SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { useLanguage } from '../i18n/LanguageContext';
import './MusicToggle.css';

const BGM_SRC = '/bgm.mp3';
const BGM_VOLUME = 0.35;

/**
 * Site-wide music control. Browsers block audible autoplay, so playback
 * starts on the first user gesture (the Scene 0 shot counts) — unless
 * the visitor has toggled it off first. If /bgm.mp3 doesn't exist (the
 * track is still pending), the control removes itself entirely.
 */
export default function MusicToggle() {
  const { t } = useLanguage();
  const [available, setAvailable] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const audioRef = useRef(null);
  const enabledRef = useRef(true);
  enabledRef.current = enabled;

  useEffect(() => {
    const audio = new Audio(BGM_SRC);
    audio.loop = true;
    audio.volume = BGM_VOLUME;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onError = () => setAvailable(false);
    audio.addEventListener('error', onError);

    const tryPlay = () => {
      if (!enabledRef.current) return;
      try {
        audio.play()?.catch(() => {});
      } catch {
        // jsdom and some browsers throw instead of rejecting; stay paused.
      }
    };
    // First user gesture anywhere (the loading-screen shot qualifies).
    document.addEventListener('pointerdown', tryPlay, { once: true });

    return () => {
      audio.removeEventListener('error', onError);
      document.removeEventListener('pointerdown', tryPlay);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  if (!available) return null;

  const toggle = (event) => {
    // Don't let the document-level first-gesture listener see this as
    // "any gesture" and restart what the user just paused.
    event.stopPropagation();
    const audio = audioRef.current;
    setEnabled((prev) => {
      const next = !prev;
      if (audio) {
        if (next) {
          try {
            audio.play()?.catch(() => {});
          } catch {
            // ignore: playback stays paused
          }
        } else {
          audio.pause();
        }
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      className="music-toggle btn-glass btn-glass--ghost"
      onClick={toggle}
      onPointerDown={(event) => event.stopPropagation()}
      aria-label={enabled ? t.ui.musicOffLabel : t.ui.musicOnLabel}
      aria-pressed={enabled}
    >
      {enabled ? <SpeakerHigh size={15} weight="light" /> : <SpeakerSlash size={15} weight="light" />}
    </button>
  );
}
