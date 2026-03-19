import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { GameHUD } from "../components/game/GameHUD";
import {
  type Controls,
  GameScene,
  type HudData,
} from "../components/game/GameScene";
import { useSubmitScore } from "../hooks/useQueries";

type GameState = "difficulty" | "countdown" | "racing" | "paused" | "finished";
type Difficulty = "easy" | "medium" | "hard";

const TOTAL_LAPS = 3;
const TOTAL_CARS = 4;

function formatTime(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const centis = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
}

interface GamePageProps {
  onExit: () => void;
}

export function GamePage({ onExit }: GamePageProps) {
  const [gameState, setGameState] = useState<GameState>("difficulty");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [hud, setHud] = useState<HudData>({
    speed: 0,
    lap: 1,
    position: 1,
    time: 0,
  });
  const [finishTimeMs, setFinishTimeMs] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  const controlsRef = useRef<Controls>({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const submitScore = useSubmitScore();

  // Keyboard controls
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) controlsRef.current.up = true;
      if (["ArrowDown", "s", "S"].includes(e.key))
        controlsRef.current.down = true;
      if (["ArrowLeft", "a", "A"].includes(e.key))
        controlsRef.current.left = true;
      if (["ArrowRight", "d", "D"].includes(e.key))
        controlsRef.current.right = true;
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        setGameState((prev) => {
          if (prev === "racing") return "paused";
          if (prev === "paused") return "racing";
          return prev;
        });
      }
      e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) controlsRef.current.up = false;
      if (["ArrowDown", "s", "S"].includes(e.key))
        controlsRef.current.down = false;
      if (["ArrowLeft", "a", "A"].includes(e.key))
        controlsRef.current.left = false;
      if (["ArrowRight", "d", "D"].includes(e.key))
        controlsRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const startCountdown = useCallback(() => {
    setGameState("countdown");
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else if (count === 0) {
        setCountdown(0);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setGameState("racing");
      }
    }, 1000);
  }, []);

  const handleRaceFinish = useCallback((timeMs: number) => {
    setFinishTimeMs(timeMs);
    setGameState("finished");
  }, []);

  const handleSubmitScore = async () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await submitScore.mutateAsync({
        playerName: playerName.trim(),
        scoreValue: BigInt(finishTimeMs),
      });
      toast.success("Score submitted!");
    } catch {
      toast.error("Failed to submit score");
    }
  };

  const isPaused = gameState === "paused";
  const showCanvas = gameState !== "difficulty" && gameState !== "finished";
  const showFinishedCanvas = gameState === "finished";

  return (
    <div
      className="fixed inset-0 bg-background overflow-hidden"
      data-ocid="game.page"
    >
      {/* 3D Canvas (always mounted once racing starts) */}
      <AnimatePresence>
        {(showCanvas || showFinishedCanvas) && (
          <div className="absolute inset-0">
            <Canvas
              gl={{ antialias: true, alpha: false }}
              camera={{ fov: 60, near: 0.1, far: 500, position: [0, 8, -60] }}
              style={{ width: "100%", height: "100%" }}
              shadows
            >
              <GameScene
                difficulty={difficulty}
                onUpdate={setHud}
                onRaceFinish={handleRaceFinish}
                controlsRef={controlsRef}
                paused={isPaused || gameState === "countdown"}
                totalLaps={TOTAL_LAPS}
              />
            </Canvas>

            {gameState !== "finished" && (
              <GameHUD
                hud={hud}
                totalLaps={TOTAL_LAPS}
                totalCars={TOTAL_CARS}
                paused={isPaused}
                onPause={() => setGameState("paused")}
                onResume={() => setGameState("racing")}
                controlsRef={controlsRef}
                countdown={countdown}
              />
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Difficulty selector */}
      <AnimatePresence>
        {gameState === "difficulty" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, #0d1424 0%, #080c14 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="text-center max-w-lg w-full px-6"
              data-ocid="game.difficulty_panel"
            >
              <button
                type="button"
                onClick={onExit}
                className="absolute top-6 left-6 font-rajdhani text-gray-400 hover:text-neon-cyan transition-colors flex items-center gap-2 text-sm"
                data-ocid="game.back_button"
              >
                ← BACK
              </button>

              <motion.h1
                className="font-orbitron text-4xl font-black glow-cyan mb-2"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                SELECT DIFFICULTY
              </motion.h1>
              <p className="font-rajdhani text-muted-foreground text-lg mb-10">
                {TOTAL_LAPS} laps · 3 AI opponents
              </p>

              <div className="flex flex-col gap-4 mb-10">
                {(["easy", "medium", "hard"] as Difficulty[]).map((d, i) => (
                  <motion.button
                    key={d}
                    className={`px-8 py-5 font-orbitron text-lg font-bold tracking-widest border transition-all ${
                      difficulty === d
                        ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10 glow-box-cyan"
                        : "border-white/20 text-white/60 hover:border-white/40 hover:text-white/80"
                    }`}
                    onClick={() => setDifficulty(d)}
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    data-ocid={`game.difficulty_${d}_button`}
                  >
                    <span className="block">{d.toUpperCase()}</span>
                    <span className="block font-rajdhani text-sm font-normal mt-1 opacity-70">
                      {d === "easy"
                        ? "Slow AI · Perfect for beginners"
                        : d === "medium"
                          ? "Balanced challenge"
                          : "Fast AI · Test your skills"}
                    </span>
                  </motion.button>
                ))}
              </div>

              <motion.button
                className="w-full py-5 font-orbitron text-xl font-black tracking-widest bg-neon-cyan/10 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20 transition-all glow-box-cyan"
                onClick={startCountdown}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                data-ocid="game.start_button"
              >
                START RACE
              </motion.button>

              <p className="font-rajdhani text-gray-500 text-sm mt-6">
                WASD / Arrow Keys to drive · P or Esc to pause
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finished screen */}
      <AnimatePresence>
        {gameState === "finished" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            data-ocid="game.results_panel"
          >
            <div className="text-center max-w-md w-full px-6">
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-6xl mb-4">🏁</div>
                <h1 className="font-orbitron text-4xl font-black glow-cyan mb-2">
                  RACE COMPLETE!
                </h1>
                <p className="font-rajdhani text-gray-400 text-lg mb-6">
                  Final time
                </p>
                <div
                  className="font-orbitron text-5xl font-black text-white mb-8 py-4 border border-neon-cyan/30 bg-neon-cyan/5"
                  data-ocid="game.finish_time"
                >
                  {formatTime(finishTimeMs)}
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col gap-3 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <input
                  type="text"
                  placeholder="Enter your name to save score"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/20 text-white font-rajdhani text-lg placeholder-gray-500 focus:border-neon-cyan/60 focus:outline-none transition-colors"
                  data-ocid="game.name_input"
                />
                <button
                  type="button"
                  className="py-3 font-orbitron text-sm font-bold tracking-widest border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 transition-all disabled:opacity-50"
                  onClick={handleSubmitScore}
                  disabled={submitScore.isPending}
                  data-ocid="game.submit_score_button"
                >
                  {submitScore.isPending ? "SUBMITTING..." : "SUBMIT SCORE"}
                </button>
              </motion.div>

              <motion.div
                className="flex gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="button"
                  className="flex-1 py-3 font-orbitron text-sm tracking-widest border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all"
                  onClick={() => {
                    setGameState("difficulty");
                    setHud({ speed: 0, lap: 1, position: 1, time: 0 });
                  }}
                  data-ocid="game.play_again_button"
                >
                  PLAY AGAIN
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 font-orbitron text-sm tracking-widest border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-all"
                  onClick={onExit}
                  data-ocid="game.exit_button"
                >
                  MAIN MENU
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
