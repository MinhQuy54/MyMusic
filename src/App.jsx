import { useEffect, useRef, useState } from 'react'
import LYRICS from './lyrics.js'

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function App() {
  const audioRef = useRef(null)
  const lyricsBoxRef = useRef(null)
  const lineRefs = useRef([])
  const rafRef = useRef(0)
  const audioCtxRef = useRef(null)
  const gainRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isLoading, setIsLoading] = useState(false)
  const [prevVolume, setPrevVolume] = useState(0.8)

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume)
      setVolume(0)
    } else {
      setVolume(prevVolume)
    }
  }


  // dòng lyric đang hát: dòng cuối cùng có time <= currentTime
  let activeIndex = -1
  for (let i = 0; i < LYRICS.length; i++) {
    if (LYRICS[i].time <= currentTime) activeIndex = i
    else break
  }

  // độ "hát tới đâu" của dòng đang hát (0 → 1), tính theo thời điểm dòng kế tiếp
  let lineFill = 0
  if (activeIndex >= 0) {
    const start = LYRICS[activeIndex].time
    const end =
      activeIndex + 1 < LYRICS.length
        ? LYRICS[activeIndex + 1].time
        : start + 5
    lineFill = Math.min(Math.max((currentTime - start) / (end - start), 0), 1)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onLoaded = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const onEnded = () => {
      setIsPlaying(false)
      setIsLoading(false)
    }
    const onWaiting = () => setIsLoading(true)
    const onPlaying = () => setIsLoading(false)
    const onCanPlay = () => setIsLoading(false)
    const onSeeking = () => setIsLoading(true)
    const onSeeked = () => setIsLoading(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('seeking', onSeeking)
    audio.addEventListener('seeked', onSeeked)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('seeking', onSeeking)
      audio.removeEventListener('seeked', onSeeked)
    }
  }, [])

  // khi đang phát: cập nhật mượt bằng requestAnimationFrame để chữ karaoke chảy đều
  useEffect(() => {
    if (!isPlaying) return
    const tick = () => {
      const audio = audioRef.current
      if (audio) setCurrentTime(audio.currentTime)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying])

  // iOS không cho JS chỉnh audio.volume (thuộc tính bị khoá), nên khi bắt đầu
  // phát ta route audio qua GainNode của Web Audio API và chỉnh gain thay thế
  const ensureAudioGraph = () => {
    const audio = audioRef.current
    if (!audio || gainRef.current) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const source = ctx.createMediaElementSource(audio)
    const gain = ctx.createGain()
    gain.gain.value = volume
    source.connect(gain)
    gain.connect(ctx.destination)
    audio.volume = 1
    audioCtxRef.current = ctx
    gainRef.current = gain
  }

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = volume
    } else if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])



  // tự cuộn để dòng mới nhất luôn nằm trong khung
  // (nhảy xa — tua nhạc/mở trang giữa bài — thì cuộn thẳng, không smooth)
  const prevIndexRef = useRef(-1)
  useEffect(() => {
    const box = lyricsBoxRef.current
    const line = lineRefs.current[activeIndex]
    const jump = Math.abs(activeIndex - prevIndexRef.current) > 2
    prevIndexRef.current = activeIndex
    if (!box || !line) return
    const target = line.offsetTop - box.clientHeight / 2 + line.clientHeight / 2
    box.scrollTo({ top: Math.max(target, 0), behavior: jump ? 'auto' : 'smooth' })
  }, [activeIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      ensureAudioGraph()
      audioCtxRef.current?.resume()
      audio.play()
      setIsPlaying(true)
    }
  }

  const seekTo = (value) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const skip = (delta) => {
    const audio = audioRef.current
    if (!audio) return
    seekTo(Math.min(Math.max(audio.currentTime + delta, 0), duration || 0))
  }

  const playFromLine = (index) => {
    seekTo(Math.max(LYRICS[index].time, 0))
    const audio = audioRef.current
    if (audio && !isPlaying) {
      ensureAudioGraph()
      audioCtxRef.current?.resume()
      audio.play()
      setIsPlaying(true)
    }
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="page">
      <div className="floaties" aria-hidden="true">
        <span>⭐</span><span>💌</span><span>🐈‍⬛</span><span>♪</span>
        <span>✨</span><span>🎶</span><span>💫</span><span>♬</span>
      </div>

      <div className="player-box">
        <div className="box-ears" aria-hidden="true">
          <span className="ear" /><span className="ear" />
        </div>

        {/* ── lời bài hát ── */}
        <section className="lyrics-pane">
          <div className="lyrics-header">
            <span>💌 Lời bài hát</span>
          </div>
          <div className="lyrics-scroll" ref={lyricsBoxRef}>
            {activeIndex < 0 && (
              <p className="lyrics-waiting">
                {isPlaying ? '🎶 nhạc dạo... lời sắp lên rồi 🎶' : '✨ nhấn ▶ để bắt đầu nghe nè ✨'}
              </p>
            )}
            {LYRICS.map((line, i) => {
              const isActive = i === activeIndex
              const isPassed = i < activeIndex
              return (
                <p
                  key={i}
                  ref={(el) => (lineRefs.current[i] = el)}
                  className={`lyric-line ${isActive ? 'active' : isPassed ? 'passed' : 'upcoming'}`}
                  style={isActive ? { '--fill': `${lineFill * 100}%` } : undefined}
                  onClick={() => playFromLine(i)}
                >
                  {line.text}
                </p>
              )
            })}
            <div className="lyrics-pad" />
          </div>
        </section>

        {/* ── player ── */}
        <section className="player-pane">
          <div className={`cover-wrap ${isPlaying ? 'playing' : ''}`}>
            <img src="/cover.png" alt="Cô bé và chú mèo đen dưới cơn mưa sao" className="cover" />
            <div className="cover-badge">{isPlaying ? '♪ đang phát ♪' : 'tạm dừng zzz'}</div>
          </div>

          <div className="song-info">
            <h1 className="title">🌙</h1>
          </div>

          <div className="seek-row">
            <span className="time current">{formatTime(currentTime)}</span>
            <input
              className="seek"
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ '--progress': `${progress}%` }}
              aria-label="Tua nhạc"
            />
            <span className="time total">{formatTime(duration)}</span>
          </div>

          <div className="controls">
            <button className="btn small" onClick={() => skip(-10)} title="Lùi 10 giây">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <text x="12" y="15.5" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">10</text>
              </svg>
            </button>
            <button className={`btn play ${isPlaying ? 'is-playing' : ''}`} onClick={togglePlay} title={isPlaying ? 'Tạm dừng' : 'Phát'}>
              {isLoading ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="spinner">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" />
                </svg>
              ) : isPlaying ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(2px)' }}>
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>
            <button className="btn small" onClick={() => skip(10)} title="Tới 10 giây">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <text x="12" y="15.5" fontSize="8" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">10</text>
              </svg>
            </button>
          </div>

          <div className="volume-row">
            <button className="vol-btn" onClick={toggleMute} aria-label={volume === 0 ? "Bật âm thanh" : "Tắt âm thanh"}>
              {volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="22" x2="16" y1="9" y2="15" />
                  <line x1="16" x2="22" y1="9" y2="15" />
                </svg>
              ) : volume < 0.5 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
            <input
              className="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              onInput={(e) => setVolume(Number(e.target.value))}
              onTouchStart={(e) => e.stopPropagation()}
              style={{ '--progress': `${volume * 100}%` }}
              aria-label="Âm lượng"
            />
          </div>
        </section>

        <audio ref={audioRef} src="/song.mp3" preload="metadata" playsInline />
      </div>

      <p className="footer">made with 💛 · MusicYum</p>
    </div>
  )
}
