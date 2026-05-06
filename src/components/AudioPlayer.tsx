import { useEffect, useRef, useState } from "react"
import styles from "./AudioPlayer.module.css"

interface Props {
  src: string
  lang: "zh-CN" | "en"
  onClose?: () => void
}

const COPY = {
  "zh-CN": { close: "关闭播放器", play: "播放", pause: "暂停", download: "下载" },
  en: { close: "Close player", play: "Play", pause: "Pause", download: "Download" },
}

function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00"
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}

/** Plan B expanded audio player. Custom UI driven by an HTML5 <audio> ref.
 *  Renders a 720-wide bar; the article meta-line link controls show/hide via
 *  the parent's `expanded` state and passes `onClose`. */
export function AudioPlayer({ src, lang, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [speed, setSpeed] = useState(1)
  const copy = COPY[lang]

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setCurrent(a.currentTime)
    const onMeta = () => setDuration(a.duration || 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    a.addEventListener("timeupdate", onTime)
    a.addEventListener("loadedmetadata", onMeta)
    a.addEventListener("play", onPlay)
    a.addEventListener("pause", onPause)
    return () => {
      a.removeEventListener("timeupdate", onTime)
      a.removeEventListener("loadedmetadata", onMeta)
      a.removeEventListener("play", onPlay)
      a.removeEventListener("pause", onPause)
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (a) a.playbackRate = speed
  }, [speed])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) void a.play()
    else a.pause()
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = Number(e.target.value)
    setCurrent(a.currentTime)
  }

  const cycleSpeed = () => {
    const next = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2 : 1
    setSpeed(next)
  }

  const dur = duration > 0 ? duration : 0

  return (
    <div className={styles.bar} role="region" aria-label="audio player">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        className={styles.play}
        onClick={toggle}
        aria-label={playing ? copy.pause : copy.play}
      >
        {playing ? "⏸" : "▶"}
      </button>
      <input
        type="range"
        className={styles.scrub}
        min={0}
        max={dur}
        step={0.1}
        value={current}
        onChange={seek}
        aria-label="seek"
      />
      <span className={styles.time}>
        {formatTime(current)} / {formatTime(dur)}
      </span>
      <button
        type="button"
        className={styles.speed}
        onClick={cycleSpeed}
        aria-label={`speed ${speed}x`}
      >
        {speed}×
      </button>
      <a
        href={src}
        download
        className={styles.download}
        aria-label={copy.download}
        title={copy.download}
      >
        ⤓
      </a>
      {onClose && (
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={copy.close}
        >
          ✕
        </button>
      )}
    </div>
  )
}
