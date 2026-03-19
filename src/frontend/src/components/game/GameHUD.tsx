import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Controls, HudData } from "./GameScene";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
}

interface SpeedometerProps {
  speed: number;
  maxSpeed?: number;
}

function Speedometer({ speed, maxSpeed = 180 }: SpeedometerProps) {
  const pct = Math.min(speed / maxSpeed, 1);
  const angle = -140 + pct * 280; // -140deg to +140deg
  const r = 55;
  const cx = 65;
  const cy = 65;

  // Arc path
  const startAngle = -140 * (Math.PI / 180);
  const endAngle = startAngle + pct * 280 * (Math.PI / 180);
  const sx = cx + r * Math.cos(startAngle);
  const sy = cy + r * Math.sin(startAngle);
  const ex = cx + r * Math.cos(endAngle);
  const ey = cy + r * Math.sin(endAngle);
  const largeArc = pct * 280 > 180 ? 1 : 0;

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width="130"
        height="130"
        viewBox="0 0 130 130"
        role="img"
        aria-label="Speedometer"
      >
        {/* Background arc */}
        <path
          d={`M ${cx + r * Math.cos((-140 * Math.PI) / 180)} ${cy + r * Math.sin((-140 * Math.PI) / 180)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos((140 * Math.PI) / 180)} ${cy + r * Math.sin((140 * Math.PI) / 180)}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        {pct > 0 && (
          <path
            d={`M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`}
            fill="none"
            stroke="#19E6FF"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 6px #19E6FF)" }}
          />
        )}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + (r - 18) * Math.cos((angle * Math.PI) / 180)}
          y2={cy + (r - 18) * Math.sin((angle * Math.PI) / 180)}
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="4" fill="#19E6FF" />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingTop: "14px" }}
      >
        <span className="font-orbitron text-2xl font-bold text-white leading-none">
          {speed}
        </span>
        <span className="font-rajdhani text-[10px] text-gray-400 tracking-widest">
          MPH
        </span>
      </div>
    </div>
  );
}

interface OnScreenControlProps {
  controlsRef: React.MutableRefObject<Controls>;
}

function OnScreenControls({ controlsRef }: OnScreenControlProps) {
  const press = (key: keyof Controls, val: boolean) => {
    controlsRef.current[key] = val;
  };

  const btnCls =
    "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg select-none cursor-pointer active:scale-95 transition-transform";
  const activeCls = "bg-white/20 border border-white/30 backdrop-blur-sm";

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        className={`${btnCls} ${activeCls}`}
        onPointerDown={() => press("up", true)}
        onPointerUp={() => press("up", false)}
        onPointerLeave={() => press("up", false)}
        data-ocid="game.up_button"
        aria-label="Accelerate"
      >
        ▲
      </button>
      <div className="flex gap-1">
        <button
          type="button"
          className={`${btnCls} ${activeCls}`}
          onPointerDown={() => press("left", true)}
          onPointerUp={() => press("left", false)}
          onPointerLeave={() => press("left", false)}
          data-ocid="game.left_button"
          aria-label="Turn left"
        >
          ◀
        </button>
        <button
          type="button"
          className={`${btnCls} ${activeCls}`}
          onPointerDown={() => press("down", true)}
          onPointerUp={() => press("down", false)}
          onPointerLeave={() => press("down", false)}
          data-ocid="game.down_button"
          aria-label="Brake"
        >
          ▼
        </button>
        <button
          type="button"
          className={`${btnCls} ${activeCls}`}
          onPointerDown={() => press("right", true)}
          onPointerUp={() => press("right", false)}
          onPointerLeave={() => press("right", false)}
          data-ocid="game.right_button"
          aria-label="Turn right"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

interface GameHUDProps {
  hud: HudData;
  totalLaps: number;
  totalCars: number;
  paused: boolean;
  onPause: () => void;
  onResume: () => void;
  controlsRef: React.MutableRefObject<Controls>;
  countdown: number | null;
}

export function GameHUD({
  hud,
  totalLaps,
  totalCars,
  paused,
  onPause,
  onResume,
  controlsRef,
  countdown,
}: GameHUDProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      data-ocid="game.panel"
    >
      {/* Countdown overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            key={countdown}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="font-orbitron text-[8rem] font-black glow-cyan"
              style={{ textShadow: "0 0 40px #19E6FF, 0 0 80px #19E6FF66" }}
            >
              {countdown === 0 ? "GO!" : countdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 bg-black/60 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <h2 className="font-orbitron text-5xl font-black glow-cyan mb-8">
                PAUSED
              </h2>
              <button
                type="button"
                className="px-10 py-4 font-orbitron text-lg font-bold tracking-widest border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 transition-all glow-box-cyan pointer-events-auto"
                onClick={onResume}
                data-ocid="game.resume_button"
              >
                RESUME
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD bar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-3">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded px-4 py-1.5 flex flex-col items-center">
          <span className="font-orbitron text-[10px] text-gray-400 tracking-widest">
            LAP
          </span>
          <span className="font-orbitron text-xl font-bold text-white">
            {hud.lap}/{totalLaps}
          </span>
        </div>
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded px-4 py-1.5 flex flex-col items-center">
          <span className="font-orbitron text-[10px] text-gray-400 tracking-widest">
            TIME
          </span>
          <span className="font-orbitron text-xl font-bold text-white">
            {formatTime(hud.time)}
          </span>
        </div>
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded px-4 py-1.5 flex flex-col items-center">
          <span className="font-orbitron text-[10px] text-gray-400 tracking-widest">
            POS
          </span>
          <span className="font-orbitron text-xl font-bold text-white">
            {hud.position}/{totalCars}
          </span>
        </div>
      </div>

      {/* Speedometer – bottom left */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2">
        <Speedometer speed={hud.speed} />
      </div>

      {/* On-screen controls – bottom right */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <OnScreenControls controlsRef={controlsRef} />
      </div>

      {/* Pause button – top right */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <button
          type="button"
          className="bg-black/60 backdrop-blur-md border border-white/20 rounded px-4 py-2 font-orbitron text-xs text-white tracking-widest hover:border-neon-cyan/60 transition-all"
          onClick={onPause}
          data-ocid="game.pause_button"
        >
          ⏸ PAUSE
        </button>
      </div>
    </div>
  );
}
