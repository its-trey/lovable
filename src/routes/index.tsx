import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "motion/react";
import { useRef, useMemo, useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday Embess ❤️" },
      { name: "description", content: "Happy 18th birthday Embess" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="relative">
      <MusicPlayer />
      <Hero />
      <Memories />
      <Invitation />
      <Agenda />
    </main>
  );
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false); // Play unmuted by default
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    audio.loop = true;
    audio.muted = false;

    const playAudio = () => {
      audio.play()
        .then(() => {
          setStarted(true);
        })
        .catch(() => {
          // Autoplay blocked: wait for first interaction anywhere on page to play with sound
          const startPlay = () => {
            audio.play().then(() => {
              setStarted(true);
              document.removeEventListener("click", startPlay);
              document.removeEventListener("touchstart", startPlay);
            }).catch(() => {});
          };
          document.addEventListener("click", startPlay);
          document.addEventListener("touchstart", startPlay);
        });
    };

    playAudio();

    return () => {
      // Clean up event listeners on unmount
      document.removeEventListener("click", () => {});
      document.removeEventListener("touchstart", () => {});
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !muted;
    setMuted(next);
    audio.muted = next;
    
    // If unmuting and paused, attempt to play
    if (!next && audio.paused) {
      audio.play().then(() => setStarted(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music.mp3"
        preload="auto"
        playsInline
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Bật nhạc" : "Tắt nhạc"}
        className="fixed top-4 right-4 z-[100] w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg border border-[oklch(0.88_0.08_15)] flex items-center justify-center text-rose hover:scale-110 active:scale-95 transition-transform"
        style={{ boxShadow: "0 6px 18px rgba(200,40,80,0.25)" }}
      >
        {muted ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4z" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H2v6h4l5 4z" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </>
  );
}


/* ---------- HERO ---------- */

const CANDLE_COUNT = 7;

function Hero() {
  // intro phases:
  //  0 = pitch black
  //  1..CANDLE_COUNT = candles lighting one by one
  //  CANDLE_COUNT+1 = all lit, fade background in + confetti + everything else
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    // start lighting candles
    for (let i = 1; i <= CANDLE_COUNT; i++) {
      timers.push(window.setTimeout(() => setPhase(i), 600 + i * 450));
    }
    // reveal scene
    timers.push(window.setTimeout(() => setPhase(CANDLE_COUNT + 1), 600 + (CANDLE_COUNT + 1) * 450));
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const revealed = phase > CANDLE_COUNT;
  const litCount = Math.min(phase, CANDLE_COUNT);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* black backdrop (always present, fades out) */}
      <motion.div
        className="absolute inset-0 -z-20 bg-black"
        animate={{ opacity: 1 }}
      />
      {/* sky gradient fades in after all candles lit */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at top, oklch(0.97 0.05 15) 0%, oklch(0.92 0.08 10) 55%, oklch(0.85 0.13 5) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      {/* sparkles only after reveal */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Sparkles count={40} />
            <Balloons />
            <FloatingHearts />
            <ConfettiBurst side="left" />
            <ConfettiBurst side="right" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title between balloons and cake */}
      <motion.div
        className="absolute left-0 right-0 z-20 flex items-center justify-center px-6 text-center pointer-events-none"
        style={{ top: "38%" }}
        initial={{ opacity: 0, scale: 0.6, y: 30 }}
        animate={revealed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 110, damping: 14 }}
      >
        <h1
          className="font-display leading-[0.95] text-[clamp(2.5rem,8vw,5.5rem)] px-4 pb-2"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.55 0.24 10) 0%, oklch(0.4 0.22 5) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 4px 14px rgba(220,40,80,0.25)",
            filter: "drop-shadow(0 2px 0 rgba(255,255,255,0.5))",
          }}
        >
          Happy 18th birthday
          <br />
          Embess ❤️❤️❤️
        </h1>
      </motion.div>

      {/* cake pinned to bottom */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-10 z-10">
        <Cake litCount={litCount} revealed={revealed} />
      </div>
    </section>
  );
}

function Sparkles({ count }: { count: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 70,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 3,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none">
      {items.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: "0 0 8px rgba(255,255,255,0.9)",
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: s.delay }}
        />
      ))}
    </div>
  );
}

function Balloons() {
  const balloons = [
    { left: "6%", color: "oklch(0.75 0.2 10)", delay: 0, size: 110 },
    { left: "14%", color: "oklch(0.85 0.13 350)", delay: 1.2, size: 95 },
    { left: "82%", color: "oklch(0.78 0.18 25)", delay: 0.6, size: 120 },
    { left: "92%", color: "oklch(0.88 0.1 340)", delay: 1.8, size: 90 },
    { left: "26%", color: "oklch(0.82 0.15 5)", delay: 2.3, size: 85 },
    { left: "72%", color: "oklch(0.9 0.08 20)", delay: 0.3, size: 100 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none">
      {balloons.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: b.left, top: "8%" }}
          animate={{ y: [0, -25, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
        >
          <Balloon color={b.color} size={b.size} />
        </motion.div>
      ))}
    </div>
  );
}

function Balloon({ color, size }: { color: string; size: number }) {
  return (
    <div style={{ width: size, height: size * 1.25 }} className="relative">
      <div
        className="absolute inset-0 rounded-[50%]"
        style={{
          background: `radial-gradient(circle at 30% 25%, white 0%, ${color} 35%, oklch(from ${color} calc(l - 0.18) c h) 100%)`,
          boxShadow: `inset -8px -12px 20px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.12)`,
        }}
      />
      <div
        className="absolute rounded-full bg-white/70 blur-[1px]"
        style={{ width: size * 0.18, height: size * 0.28, left: "22%", top: "16%" }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: `${size * 1.18}px`,
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `10px solid ${color}`,
        }}
      />
      <svg
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: size * 1.28, width: 30, height: 140 }}
      >
        <path d="M15 0 Q 5 50 15 100 Q 25 130 15 140" stroke="rgba(120,40,60,0.45)" strokeWidth="1.2" fill="none" />
      </svg>
    </div>
  );
}

function FloatingHearts() {
  const [vh, setVh] = useState(900);
  useEffect(() => {
    setVh(window.innerHeight);
  }, []);
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 95,
        size: 28 + Math.random() * 30,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 4,
      })),
    []
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: `${h.left}%`, bottom: -60 }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -(vh + 100), opacity: [0, 1, 1, 0] }}
          transition={{ duration: h.duration, repeat: Infinity, delay: h.delay, ease: "easeOut" }}
        >
          <HeartSVG size={h.size} />
        </motion.div>
      ))}
    </div>
  );
}

function HeartSVG({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="animate-heartbeat drop-shadow-[0_4px_8px_rgba(220,40,80,0.35)]">
      <defs>
        <radialGradient id={`hg${size}`} cx="35%" cy="30%">
          <stop offset="0%" stopColor="#ffd6e0" />
          <stop offset="60%" stopColor="#ff5577" />
          <stop offset="100%" stopColor="#c91744" />
        </radialGradient>
      </defs>
      <path
        d="M16 28 C 4 20, 2 10, 9 6 C 13 4, 16 7, 16 10 C 16 7, 19 4, 23 6 C 30 10, 28 20, 16 28 Z"
        fill={`url(#hg${size})`}
      />
    </svg>
  );
}

function ConfettiBurst({ side }: { side: "left" | "right" }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => {
        const colors = ["#ff5b8a", "#ffb3c6", "#ffd166", "#ef476f", "#f78fb3", "#fff1c1", "#ff85a2"];
        const dir = side === "left" ? 1 : -1;
        const angle = -45 + (Math.random() - 0.5) * 60;
        const dist = 80 + Math.random() * 90;
        const rad = (angle * Math.PI) / 180;
        const dx = Math.cos(rad) * dist * dir;
        const dy = Math.sin(rad) * dist;
        return {
          id: i,
          color: colors[i % colors.length],
          size: 6 + Math.random() * 8,
          delay: Math.random() * 3,
          duration: 2.2 + Math.random() * 2,
          dx,
          dy,
          rot: Math.random() * 720,
          shape: Math.random() > 0.5 ? "rect" : "circle",
        };
      }),
    [side]
  );
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: 0,
        [side]: 0,
        width: "60vw",
        height: "100vh",
      }}
    >
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: side === "left" ? 0 : "auto",
            right: side === "right" ? 0 : "auto",
            bottom: 0,
            width: p.size,
            height: p.shape === "rect" ? p.size * 1.6 : p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
          }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={{
            x: [`0vw`, `${p.dx}vw`],
            y: [`0vh`, `${p.dy}vh`],
            opacity: [0, 1, 1, 0],
            rotate: p.rot,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeOut",
            times: [0, 0.1, 0.85, 1],
          }}
        />
      ))}
    </div>
  );
}

/* 3D-ish cake with 7 evenly spaced candles */
function Cake({ litCount, revealed }: { litCount: number; revealed: boolean }) {
  const topRX = 150;
  const topRY = 35;

  // 7 candles, evenly placed on top ellipse, spaced linearly in X to prevent overlapping at edges
  const candlePositions = useMemo(() => {
    return Array.from({ length: CANDLE_COUNT }, (_, i) => {
      const t = i / (CANDLE_COUNT - 1);
      // Spacing cx linearly from left to right (24px inset from outer edges)
      const leftInset = 24;
      const rightInset = 24;
      const minX = leftInset;
      const maxX = topRX * 2 - rightInset;
      const cx = minX + t * (maxX - minX);

      // Calculate the normalized distance from center
      const dx = (cx - topRX) / (topRX - 18);
      const clampedDx = Math.max(-1, Math.min(1, dx));
      // Calculate cy using the ellipse equation (back half of the ellipse)
      const cy = topRY - (topRY - 4) * Math.sqrt(1 - clampedDx * clampedDx);
      return { cx, cy };
    });
  }, []);

  return (
    <div className="relative" style={{ width: 380, height: 460 }}>
      {/* plate — hidden until revealed */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 0,
          width: 460,
          height: 50,
          background: "radial-gradient(ellipse at center, #fff 0%, #f3d8e0 60%, #c98a9c 100%)",
          borderRadius: "50%",
          boxShadow: "0 18px 30px rgba(120,30,60,0.25)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1 }}
      />

      {/* bottom tier */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 30, width: 360, height: 160 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #c2185b 0%, #ff84a8 25%, #ffd0dd 50%, #ff84a8 75%, #a01448 100%)",
            borderRadius: "50% / 18%",
          }}
        />
        {Array.from({ length: 30 }).map((_, i) => {
          const colors = ["#fff", "#ffd166", "#06d6a0", "#ef476f", "#7b61ff"];
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: `${20 + Math.random() * 60}%`,
                width: 4,
                height: 10,
                background: colors[i % colors.length],
                transform: `rotate(${Math.random() * 180}deg)`,
              }}
            />
          );
        })}
        <div
          className="absolute left-0 right-0"
          style={{
            top: -16,
            height: 36,
            background: "radial-gradient(ellipse at center, #fff5f8 0%, #ffc4d4 70%, #e88aa6 100%)",
            borderRadius: "50%",
          }}
        />
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${5 + i * 9.5}%`,
              top: -4,
              width: 18,
              height: 22 + ((i * 7) % 14),
              background: "linear-gradient(180deg, #fff5f8 0%, #ffc4d4 70%, #e88aa6 100%)",
              borderRadius: "0 0 50% 50%",
            }}
          />
        ))}
      </motion.div>

      {/* top tier */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 165, width: topRX * 2, height: 120 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #b71c4a 0%, #ff6f95 25%, #ffe2ec 50%, #ff6f95 75%, #951339 100%)",
            borderRadius: "50% / 22%",
          }}
        />
        <div
          className="absolute left-0 right-0"
          style={{
            top: -14,
            height: topRY * 2,
            background:
              "radial-gradient(ellipse at 50% 40%, #fff 0%, #ffe2ec 55%, #ffb8cd 100%)",
            borderRadius: "50%",
            boxShadow: "inset 0 -8px 14px rgba(200,40,80,0.15)",
          }}
        />
      </motion.div>

      {/* candles — placed in their own layer always visible (so flames show in the dark) */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 165, width: topRX * 2, height: 120 }}
      >
        {candlePositions.map((p, i) => (
          <Candle key={i} x={p.cx} y={p.cy} lit={i < litCount} dim={!revealed} />
        ))}
      </div>
    </div>
  );
}

function Candle({ x, y, lit, dim }: { x: number; y: number; lit: boolean; dim: boolean }) {
  // Before reveal: only show candles that are lit. After reveal: show all.
  const hidden = dim && !lit;
  return (
    <div
      className="absolute"
      style={{
        left: x - 12.5,
        top: y - 70,
        width: 25,
        height: 70,
        opacity: hidden ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* candle body */}
      <div
        className="absolute bottom-0 left-0 right-0 rounded-sm"
        style={{
          height: 60,
          background:
            "repeating-linear-gradient(180deg, #ffe1ec 0px, #ffb6cf 6px, #ffe1ec 12px)",
          boxShadow:
            "inset -3px 0 0 rgba(160,40,80,0.25), 0 2px 4px rgba(120,30,60,0.3)",
          filter: lit && dim ? "brightness(1.15)" : undefined,
        }}
      />
      {/* wick */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: 4, width: 2, height: 6, background: "#3b2a1a" }}
      />
      {/* flame */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="absolute left-1/2 -translate-x-1/2 animate-flame"
            style={{
              top: -10,
              width: 14,
              height: 22,
              background:
                "radial-gradient(circle at 50% 70%, #fff8b0 0%, #ffb547 45%, #ff5b1f 80%, transparent 100%)",
              borderRadius: "50% 50% 45% 45% / 65% 65% 35% 35%",
              filter: "blur(0.4px)",
              boxShadow:
                "0 0 22px rgba(255,170,60,0.95), 0 0 60px rgba(255,90,30,0.7), 0 0 120px rgba(255,140,40,0.4)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


/* ---------- SECTION 2: MEMORIES ---------- */

type Memory = { date: string; title: string; text: string; side: "left" | "right"; image: string };
const memories: Memory[] = [
  {
    date: "Nơi tình yêu bắt đầu",
    title: "Địa điểm tình cảm bắt đầu",
    text: "Nơi ghi dấu bước ngoặt kỳ diệu khi hai trái tim chính thức rung động và nảy sinh tình cảm dành cho nhau 💖",
    side: "left",
    image: "/img/5.jpg"
  },
  {
    date: "Cột mốc ý nghĩa",
    title: "Ảnh công khai đầu tiên",
    text: "Ngày mà tụi mình chính thức chia sẻ niềm hạnh phúc này với mọi người, đánh dấu một bước đi định mệnh.",
    side: "right",
    image: "/img/1.jpg"
  },
  {
    date: "Kỉ niệm đi chơi",
    title: "Chuyến đi chơi đầu tiên",
    text: "Chuyến đi xa đầu tiên cùng nhau, tay trong tay đi qua những góc phố, gom nhặt từng tiếng cười ngọt ngào.",
    side: "left",
    image: "/img/2.jpg"
  },
  {
    date: "Ngày đặc biệt",
    title: "Lễ kỉ niệm đầu tiên",
    text: "Cột mốc đánh dấu chặng đường tụi mình cùng nhau vượt qua sóng gió, để càng thêm trân trọng đối phương 🌹",
    side: "right",
    image: "/img/3.png"
  },
  {
    date: "Khoảnh khắc đáng nhớ",
    title: "Sinh nhật đầu tiên em bé'ss tổ chức cho anh bé'ss",
    text: "Ngày sinh nhật ngập tràn hạnh phúc khi anh bé'ss được em bé'ss tự tay chuẩn bị bánh kem, nến và gửi gắm những lời chúc ngọt ngào nhất 🎂❤️",
    side: "left",
    image: "/img/4.jpg"
  },
];

function Memories() {
  return (
    <section className="relative w-full py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.95_0.05_10)] to-[oklch(0.97_0.04_20)]" />
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-5xl md:text-7xl font-display text-rose mb-20"
      >
        Cuộn nhẹ thôi nha~ <br className="md:hidden" />
        <span className="text-[oklch(0.55_0.22_5)]">đây là chuyện của tụi mình</span>
      </motion.h2>

      <div className="relative max-w-5xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-rose via-[oklch(0.78_0.18_10)] to-transparent rounded-full z-0" />
        <div className="space-y-28">
          {memories.map((m, i) => (
            <MemoryItem key={i} memory={m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MemoryItem({ memory, index }: { memory: Memory; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const isLeft = memory.side === "left";
  return (
    <div ref={ref} className="relative grid md:grid-cols-2 gap-6 items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-rose ring-4 ring-white shadow-[0_0_0_4px_oklch(0.85_0.12_10)]"
      />
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`${isLeft ? "md:col-start-1 md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"} bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl border border-[oklch(0.9_0.05_15)]`}
      >
        <p className="text-sm uppercase tracking-widest text-rose font-semibold">{memory.date}</p>
        <h3 className="text-3xl font-display text-[oklch(0.4_0.18_5)] mt-1">{memory.title}</h3>
        <p className="mt-3 text-[oklch(0.4_0.06_15)] leading-relaxed">{memory.text}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 80 : -80, rotate: isLeft ? 4 : -4 }}
        animate={inView ? { opacity: 1, x: 0, rotate: isLeft ? 2 : -2 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className={`relative z-10 ${isLeft ? "md:col-start-2 md:pl-12" : "md:col-start-1 md:pr-12 md:row-start-1"}`}
      >
        <div className="relative mx-auto w-full max-w-sm aspect-[4/5] rounded-2xl bg-white shadow-2xl border-[10px] border-white overflow-hidden flex flex-col justify-between pb-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[oklch(0.78_0.08_60)]/70 rounded-sm rotate-[-3deg] z-20" />
          <div className="w-full aspect-[4/4.2] overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={memory.image} 
              alt={memory.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center font-display text-[oklch(0.4_0.15_5)] text-xl mt-3 select-none">
            {memory.title}
          </div>
        </div>
      </motion.div>

    </div>
  );
}

/* ---------- SECTION 3: INVITATION (click-to-open) ---------- */

function Invitation() {
  const [opened, setOpened] = useState(false);

  const letterLines = [
    "Gửi em bé'ss nhỏ bé của anh,",
    "Dù chưa đến ngày sinh nhật chính thức của em,",
    "nhưng anh luôn mong muốn được ở bên em sớm hơn.",
    "Anh đã chuẩn bị một buổi sinh nhật sớm nho nhỏ",
    "để dành riêng cho em bé'ss đáng yêu của anh 🎂",
    "Hãy cùng anh đón tuổi 18 thật bình yên và ấm áp,",
    "để anh được chở che và làm em cười mỗi ngày nhé ❤️",
  ];

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-[oklch(0.97_0.04_20)] to-[oklch(0.93_0.08_10)]">
      <Sparkles count={24} />

      <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-20">
        {/* ENVELOPE & LETTER TRANSITION (using mode="wait" to prevent layout shifting) */}
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.button
              key="envelope"
              type="button"
              onClick={() => setOpened(true)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, y: -40, transition: { duration: 0.4 } }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative cursor-pointer outline-none"
              style={{ width: 340, height: 230, perspective: 1000 }}
              aria-label="Open invitation"
            >
              {/* envelope back */}
              <div className="absolute inset-0 rounded-md bg-gradient-to-b from-[oklch(0.78_0.18_10)] to-[oklch(0.6_0.22_5)] shadow-2xl" />
              {/* envelope front body */}
              <div className="absolute inset-0 top-[40%] rounded-b-md bg-gradient-to-b from-[oklch(0.72_0.2_8)] to-[oklch(0.55_0.22_5)] shadow-inner" />
              {/* wax seal — pulses to invite click */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-[34%] w-16 h-16 rounded-full bg-[oklch(0.5_0.22_15)] shadow-lg flex items-center justify-center text-white font-display text-3xl border-4 border-[oklch(0.4_0.2_15)] z-10"
                animate={{ scale: [1, 1.08, 1], boxShadow: ["0 0 0 0 rgba(255,90,120,0.6)", "0 0 0 18px rgba(255,90,120,0)", "0 0 0 0 rgba(255,90,120,0)"] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                ♥
              </motion.div>
              {/* envelope flap (closed) */}
              <div className="absolute inset-x-0 top-0 h-[55%]">
                <div
                  className="w-full h-full"
                  style={{
                    background: "linear-gradient(180deg, oklch(0.82 0.16 10) 0%, oklch(0.68 0.22 5) 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    boxShadow: "0 6px 12px rgba(120,20,40,0.3)",
                  }}
                />
              </div>

              {/* hint text above the seal, sitting on the flap fold */}
              <div
                className="absolute left-1/2 -translate-x-1/2 z-20 text-white font-display text-base md:text-lg whitespace-nowrap pointer-events-none"
                style={{
                  top: "8%",
                  textShadow: "0 2px 6px rgba(80,10,30,0.7)",
                }}
              >
                Nhấn vào lá thư để mở nha 💗
              </div>

              {/* pixel hand cursor pointing at the seal */}
              <motion.div
                className="absolute left-1/2 top-[34%] pointer-events-none z-20"
                initial={{ x: 24, y: 24 }}
                animate={{ x: [28, 6, 28], y: [28, 6, 28] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <HandCursor />
              </motion.div>
            </motion.button>
          ) : (
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="relative w-full max-w-[560px]"
            >
              <div className="aspect-[4/5] bg-[oklch(0.98_0.02_80)] rounded-lg shadow-2xl p-8 md:p-12 border border-[oklch(0.88_0.06_20)] relative">
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <HeartSVG size={42} />
                </div>
                <div className="mt-14 space-y-4 font-display text-[oklch(0.35_0.15_5)]">
                  {letterLines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.25, duration: 0.5 }}
                      className="text-xl md:text-2xl leading-snug text-center"
                    >
                      {line}
                    </motion.p>
                  ))}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + letterLines.length * 0.25 }}
                    className="text-right text-base md:text-lg pt-3 text-rose"
                  >
                    — Người luôn yêu em 💌
                  </motion.p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpened(false)}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white shadow-lg border border-[oklch(0.88_0.06_20)] text-rose text-xl hover:scale-110 active:scale-95 transition-transform"
                aria-label="Close letter"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!opened && (
          <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-rose/80 font-display text-xl text-center px-4">
            Nhấn vào lá thư để mở nha 💗
          </p>
        )}
      </div>
    </section>
  );
}

function HandCursor() {
  // Pixel-style pointing hand (mimics the classic OS hand cursor in the reference).
  // 1 = dark outline, 2 = light fill, 0 = transparent
  const px = 4;
  const map: number[][] = [
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ];
  const cols = map[0].length;
  const rows = map.length;
  const colors = {
    1: "#3a0e1c",
    2: "#fff1f5",
  } as const;
  return (
    <svg
      width={cols * px + 2}
      height={rows * px + 2}
      viewBox={`0 0 ${cols * px + 2} ${rows * px + 2}`}
      shapeRendering="crispEdges"
      className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]"
      style={{ transform: "rotate(-18deg)" }}
    >
      {map.flatMap((row, y) =>
        row.map((c, x) =>
          c === 0 ? null : (
            <rect
              key={`${x}-${y}`}
              x={1 + x * px}
              y={1 + y * px}
              width={px}
              height={px}
              fill={colors[c as 1 | 2]}
            />
          )
        )
      )}
    </svg>
  );
}



/* ---------- SECTION 4: AGENDA ---------- */

const agenda = [
  {
    time: "17:30",
    title: "Bắt đầu đi đón em bé",
    desc: "Anh qua đón em bé'ss của anh nhé, hôm nay em chỉ cần xúng xính váy hoa thật xinh thôi 💐",
  },
  {
    time: "18:15",
    title: "Đến quán ăn ngon lành",
    desc: "Tụi mình cùng lấp đầy chiếc bụng đói với những món em thích và tận hưởng không gian ấm cúng nha 🍽️❤️",
    mapUrl: "https://maps.app.goo.gl/5hQgRy7UwZF2uWY5A",
  },
  {
    time: "19:30",
    title: "Di chuyển đến quán rooftop",
    desc: "Ngắm thành phố lung linh lấp lánh về đêm từ trên cao, cùng uống chút gì đó ngọt ngào và trò chuyện nha bé iu 🍸✨",
    mapUrl: "https://maps.app.goo.gl/gZjCEK7vkd8wRkwq8",
  },
  {
    time: "22:00",
    title: "Di chuyển về nhà của anh",
    desc: "Khép lại một ngày sinh nhật sớm thật tuyệt vời, cùng xem một bộ phim hay rồi ôm nhau ngủ thật ngoan nhé em bé'ss 🏡💞",
  },
];

function Agenda() {
  return (
    <section className="relative w-full py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.93_0.08_10)] to-[oklch(0.88_0.13_5)]" />
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-5xl md:text-7xl font-display text-[oklch(0.35_0.2_5)] mb-4"
      >
        Lịch trình buổi tiệc
      </motion.h2>
      <p className="text-center text-rose font-display text-2xl mb-16">— của riêng embess —</p>

      <div className="max-w-3xl mx-auto space-y-6">
        {agenda.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center gap-5 bg-white/85 backdrop-blur rounded-2xl p-5 shadow-lg border border-white hover:scale-[1.02] transition-transform"
          >
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-rose to-[oklch(0.55_0.22_5)] text-white flex items-center justify-center font-display text-2xl shadow-md">
              {item.time}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-display text-2xl text-[oklch(0.35_0.18_5)]">{item.title}</h3>
                {item.mapUrl && (
                  <a
                    href={item.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-semibold hover:bg-rose hover:text-white transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Xem địa chỉ 📍
                  </a>
                )}
              </div>
              <p className="text-[oklch(0.4_0.05_15)] mt-1">{item.desc}</p>
            </div>
            <HeartSVG size={28} />
          </motion.div>
        ))}
      </div>

      <p className="text-center mt-20 font-display text-3xl text-rose">
        Yêu embess nhiều lắm ❤️
      </p>
    </section>
  );
}
