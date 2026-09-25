import { useEffect, useRef, useState } from 'react';
import { LockSimple, LockSimpleOpen, Pause, Play } from '@phosphor-icons/react';

const lines = [
  ['Let the evening find a little light.', '讓晚風找到一點光。'],
  ['Leave a window open to the sky.', '留一扇窗，望向夜空。'],
  ['Every quiet moment has a song.', '每個安靜片刻，都有一首歌。'],
  ['Take this small adventure as we go.', '帶著這場小冒險，繼續前行。'],
  ['We will meet the morning in our time.', '用自己的步調，迎接天亮。'],
];

export default function LyricsDemo({ lang, active = true }) {
  const zh = lang === 'zh';
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [opacity, setOpacity] = useState(35);
  const [translation, setTranslation] = useState(true);
  const [locked, setLocked] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef(null);
  const overlayRef = useRef(null);
  const dragRef = useRef(null);
  useEffect(() => {
    if (!playing || !active) return undefined;
    const timer = window.setInterval(() => setTime(value => Math.min(40, value + 1)), 1000);
    return () => window.clearInterval(timer);
  }, [playing, active]);
  useEffect(() => { if (time === 40) setPlaying(false); }, [time]);
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const stage = stageRef.current?.getBoundingClientRect();
      const overlay = overlayRef.current?.getBoundingClientRect();
      if (!stage?.width || !overlay?.width) return;
      const maxX = Math.max(0, (stage.width - overlay.width) / 2 - 8);
      const maxY = Math.max(0, (stage.height - overlay.height) / 2 - 8);
      setPosition(previous => {
        const next = { x: Math.max(-maxX, Math.min(maxX, previous.x)), y: Math.max(-maxY, Math.min(maxY, previous.y)) };
        return next.x === previous.x && next.y === previous.y ? previous : next;
      });
    });
    if (stageRef.current) observer.observe(stageRef.current);
    if (overlayRef.current) observer.observe(overlayRef.current);
    return () => observer.disconnect();
  }, []);
  function move(x, y) {
    const stage = stageRef.current?.getBoundingClientRect();
    const overlay = overlayRef.current?.getBoundingClientRect();
    if (!stage || !overlay) return;
    const maxX = Math.max(0, (stage.width - overlay.width) / 2 - 8);
    const maxY = Math.max(0, (stage.height - overlay.height) / 2 - 8);
    setPosition({ x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) });
  }
  const index = Math.min(4, Math.floor(time / 8));
  return <div className="lyrics-demo">
    <section className="lyrics-player" aria-label={zh ? '示範播放器' : 'Sample player'}><div className="lyrics-player__display"><span>REFRAIN</span><div className="lyrics-cover" aria-hidden="true"><i /></div><h3>{zh ? '晚風來信' : 'Letters on the breeze'}</h3><p>{zh ? '原創文字 · 無音訊示範' : 'Original text · Silent demonstration'}</p><label className="visually-hidden" htmlFor="lyric-progress">{zh ? '播放進度' : 'Playback progress'}</label><input id="lyric-progress" type="range" min="0" max="40" value={time} onChange={event => setTime(Number(event.target.value))} /><div className="lyrics-time"><span>0:{String(time).padStart(2, '0')}</span><span>0:40</span></div></div>
      <button className="lyrics-play" aria-label={playing ? (zh ? '暫停示範' : 'Pause demo') : (zh ? '播放示範' : 'Play demo')} onClick={() => { if (time === 40) setTime(0); setPlaying(value => !value); }}>{playing ? <Pause weight="fill" size={32} /> : <Play weight="fill" size={32} />}</button><p>{zh ? '按播放，看歌詞隨進度切換。' : 'Press play to follow the sample lyrics.'}</p>
    </section>
    <section className="lyrics-workspace" aria-label={zh ? '歌詞浮窗示範' : 'Lyrics overlay demo'}><div className="lyrics-stage" ref={stageRef}><span className="lyrics-stage__caption">{zh ? '你的桌面 · 示意' : 'Your desktop · Preview'}</span><div className="lyrics-overlay" ref={overlayRef} style={{ transform: `translate(${position.x}px, ${position.y}px)`, backgroundColor: `rgb(14 27 24 / ${opacity / 100})` }}>
      <div className="lyrics-overlay__toolbar"><button className="lyrics-drag" disabled={locked} aria-label={zh ? '移動歌詞（方向鍵或拖曳）' : 'Move lyrics (arrow keys or drag)'} onPointerDown={event => { if (locked || event.button !== 0) return; dragRef.current = { x: event.clientX, y: event.clientY, position }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={event => { const drag = dragRef.current; if (!drag || locked) return; move(drag.position.x + event.clientX - drag.x, drag.position.y + event.clientY - drag.y); }} onPointerUp={event => { dragRef.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerCancel={() => { dragRef.current = null; }} onLostPointerCapture={() => { dragRef.current = null; }} onKeyDown={event => { const directions = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }; if (!locked && directions[event.key]) { event.preventDefault(); const [x, y] = directions[event.key]; move(position.x + x, position.y + y); } }}>{locked ? (zh ? '位置已鎖定' : 'Position locked') : (zh ? '拖曳移動' : 'Drag to move')}</button>
      <button className="lyrics-lock" aria-label={locked ? (zh ? '解鎖歌詞位置' : 'Unlock lyric position') : (zh ? '鎖定歌詞位置' : 'Lock lyric position')} aria-pressed={locked} onClick={() => { dragRef.current = null; setLocked(value => !value); }}>{locked ? <LockSimple size={22} /> : <LockSimpleOpen size={22} />}</button></div>
      <div className="lyrics-lines"><p>{lines[index][0]}</p>{translation && <p className="lyrics-translation">{lines[index][1]}</p>}<p className="lyrics-next">{lines[(index + 1) % lines.length][0]}</p></div></div></div>
      <div className="lyrics-settings"><label htmlFor="lyric-opacity">{zh ? '背景透明度' : 'Background opacity'}<output aria-hidden="true">{opacity}%</output></label><input id="lyric-opacity" type="range" min="0" max="95" value={opacity} onChange={event => setOpacity(Number(event.target.value))} /><label className="lyrics-toggle"><span>{zh ? '顯示翻譯' : 'Show translation'}</span><input type="checkbox" checked={translation} onChange={event => setTranslation(event.target.checked)} /></label><p>{zh ? '拖曳歌詞上方把手，或聚焦把手後按方向鍵移動。這裡示範位置鎖定；桌面置頂與滑鼠穿透請使用 Windows 版。' : 'Drag the handle or focus it and use arrow keys. This preview locks position; desktop pinning and click-through are available in the Windows app.'}</p></div>
    </section>
  </div>;
}
