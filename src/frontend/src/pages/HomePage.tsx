import {
  ChevronRight,
  Cpu,
  Gauge,
  Globe,
  Shield,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useHighScores } from "../hooks/useQueries";

function formatTime(ms: bigint | number): string {
  const total = typeof ms === "bigint" ? Number(ms) : ms;
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const c = Math.floor((total % 1000) / 10);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
}

const GAME_MODES = [
  {
    label: "CAREER",
    img: "/assets/generated/mode-career.dim_400x240.jpg",
    desc: "Rise through the ranks across 30 circuits",
  },
  {
    label: "MULTIPLAYER",
    img: "/assets/generated/mode-multiplayer.dim_400x240.jpg",
    desc: "Race against players worldwide in real-time",
  },
  {
    label: "EVENTS",
    img: "/assets/generated/mode-events.dim_400x240.jpg",
    desc: "Daily challenges with exclusive rewards",
  },
];

const FEATURES = [
  {
    icon: Gauge,
    title: "ULTRA PHYSICS",
    desc: "Precision handling with real momentum simulation and drift mechanics",
  },
  {
    icon: Globe,
    title: "LIVE CIRCUITS",
    desc: "15 photorealistic tracks across futuristic cityscapes",
  },
  {
    icon: Zap,
    title: "NEON BOOST",
    desc: "Charge your boost meter and unleash blazing acceleration",
  },
  {
    icon: Shield,
    title: "FULL CUSTOMIZATION",
    desc: "Tune your car's engine, suspension, tires, and aesthetics",
  },
];

const CARS = [
  {
    name: "PHANTOM-X",
    img: "/assets/generated/car-1.dim_300x180.jpg",
    stats: { spd: 95, acl: 82, hdl: 78 },
  },
  {
    name: "VORTEX-9",
    img: "/assets/generated/car-2.dim_300x180.jpg",
    stats: { spd: 88, acl: 90, hdl: 85 },
  },
  {
    name: "BLAZE-GT",
    img: "/assets/generated/car-3.dim_300x180.jpg",
    stats: { spd: 92, acl: 76, hdl: 92 },
  },
];

interface HomePageProps {
  onPlayGame: () => void;
}

export function HomePage({ onPlayGame }: HomePageProps) {
  const { data: scores, isLoading: scoresLoading } = useHighScores();

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-ocid="home.page"
    >
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
        style={{
          background: "rgba(8,12,20,0.92)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center font-orbitron text-sm font-black text-background"
              style={{
                background: "linear-gradient(135deg, #19E6FF, #8B5CFF)",
              }}
            >
              NV
            </div>
            <div>
              <div className="font-orbitron text-xs font-black tracking-widest text-white leading-none">
                NEON
              </div>
              <div className="font-orbitron text-xs font-black tracking-widest glow-cyan leading-none">
                VELOCITY
              </div>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {["HOME", "GAME", "FEATURES", "CARS", "LEADERBOARD"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-rajdhani text-sm font-semibold tracking-widest text-gray-400 hover:text-white transition-colors"
                data-ocid={`home.nav_${link.toLowerCase()}_link`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Play now CTA */}
          <button
            type="button"
            className="px-6 py-2.5 font-orbitron text-xs font-bold tracking-widest text-background bg-neon-cyan hover:bg-neon-cyan/80 transition-all glow-box-cyan rounded-full"
            onClick={onPlayGame}
            data-ocid="home.nav_play_button"
          >
            PLAY NOW
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        id="home"
        className="relative h-screen flex items-center overflow-hidden"
        data-ocid="home.hero_section"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/generated/hero-race.dim_1920x900.jpg')`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,12,20,0.95) 0%, rgba(8,12,20,0.6) 50%, rgba(8,12,20,0.75) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,12,20,1) 0%, transparent 40%)",
          }}
        />

        {/* HUD chips (top-left) */}
        <div className="absolute top-24 left-8 flex gap-2 z-10">
          {[
            { label: "LAP", value: "1/3" },
            { label: "TIME", value: "01:24.78" },
            { label: "POS", value: "4/12" },
          ].map((chip) => (
            <div
              key={chip.label}
              className="px-3 py-1.5 rounded flex flex-col items-center"
              style={{
                background: "rgba(8,12,20,0.75)",
                border: "1px solid rgba(25,230,255,0.25)",
              }}
            >
              <span className="font-orbitron text-[8px] tracking-widest text-gray-400">
                {chip.label}
              </span>
              <span className="font-orbitron text-sm font-bold text-white">
                {chip.value}
              </span>
            </div>
          ))}
        </div>

        {/* Speedometer (bottom-left) */}
        <div className="absolute bottom-24 left-8 z-10">
          <div
            className="w-32 h-32 rounded-full flex flex-col items-center justify-center"
            style={{
              background: "rgba(8,12,20,0.8)",
              border: "2px solid rgba(25,230,255,0.3)",
              boxShadow: "0 0 20px rgba(25,230,255,0.2)",
            }}
          >
            <span className="font-orbitron text-4xl font-black text-white">
              185
            </span>
            <span className="font-rajdhani text-xs tracking-widest text-gray-400">
              MPH
            </span>
            <span className="font-orbitron text-xs text-neon-cyan mt-1">
              GEAR 5
            </span>
          </div>
        </div>

        {/* Hero content (right) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 ml-auto">
          <div className="max-w-lg ml-auto">
            <motion.div
              className="font-rajdhani text-sm font-semibold tracking-[0.4em] text-neon-cyan mb-4 uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              CURRENT RACE: CITY NIGHTS
            </motion.div>

            <motion.h1
              className="font-orbitron text-6xl md:text-7xl font-black uppercase leading-tight mb-6 glow-cyan animate-neon-flicker"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              NEON
              <br />
              <span className="text-white">VELOCITY</span>
            </motion.h1>

            <motion.p
              className="font-rajdhani text-lg text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Tear through neon-lit circuits at the edge of physics. Master
              every corner. Dominate every race.
            </motion.p>

            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <button
                type="button"
                className="px-10 py-5 font-orbitron text-xl font-black tracking-widest border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/15 transition-all glow-box-cyan flex items-center justify-center gap-3"
                onClick={onPlayGame}
                data-ocid="home.hero_play_button"
              >
                <Zap className="w-5 h-5" />
                PLAY NOW
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-3 font-orbitron text-sm tracking-widest border border-white/20 text-white/70 hover:border-neon-purple/50 hover:text-white transition-all"
                  data-ocid="home.daily_challenge_button"
                >
                  DAILY CHALLENGE
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 font-orbitron text-sm tracking-widest border border-white/20 text-white/70 hover:border-neon-purple/50 hover:text-white transition-all"
                  data-ocid="home.modes_button"
                  onClick={() =>
                    document
                      .getElementById("game")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  MULTIPLE MODES
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Game Modes */}
      <section
        id="game"
        className="py-24 grid-bg"
        data-ocid="home.modes_section"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="font-orbitron text-4xl font-black text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            GAME <span className="glow-cyan">MODES</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAME_MODES.map((mode, i) => (
              <motion.div
                key={mode.label}
                className="relative overflow-hidden rounded-xl cursor-pointer group"
                style={{ aspectRatio: "16/10" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`home.mode_${mode.label.toLowerCase()}_card`}
              >
                <img
                  src={mode.img}
                  alt={mode.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(8,12,20,0.95) 0%, rgba(8,12,20,0.1) 60%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="font-rajdhani text-xs text-gray-400 tracking-widest mb-1">
                    {mode.desc}
                  </p>
                  <h3 className="font-orbitron text-xl font-black text-white">
                    {mode.label}
                  </h3>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-neon-cyan" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section
        id="features"
        className="py-24 bg-card/50"
        data-ocid="home.features_section"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            className="font-orbitron text-4xl font-black text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            KEY <span className="glow-purple">FEATURES</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="p-6 rounded-xl border border-white/8 hover:border-neon-cyan/30 transition-all group"
                style={{ background: "rgba(20,26,34,0.8)" }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-neon-cyan transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(25,230,255,0.15), rgba(139,92,255,0.15))",
                    border: "1px solid rgba(25,230,255,0.25)",
                  }}
                >
                  <feat.icon className="w-5 h-5 text-neon-cyan" />
                </div>
                <h3 className="font-orbitron text-sm font-bold text-white mb-2">
                  {feat.title}
                </h3>
                <p className="font-rajdhani text-gray-400 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Cars */}
      <section
        id="cars"
        className="py-24 grid-bg"
        data-ocid="home.cars_section"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-orbitron text-4xl font-black text-white">
                THE <span className="glow-cyan">CARS</span>
              </h2>
              <p className="font-rajdhani text-gray-400 text-lg mt-1 tracking-widest">
                GALLERY
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARS.map((car, i) => (
              <motion.div
                key={car.name}
                className="rounded-xl overflow-hidden border border-white/8 hover:border-neon-cyan/40 transition-all group"
                style={{ background: "rgba(14,20,28,0.9)" }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-ocid={`home.car_card.${i + 1}`}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={car.img}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(8,12,20,0.8) 0%, transparent 60%)",
                    }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-orbitron text-lg font-black text-white mb-4">
                    {car.name}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(car.stats).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="font-orbitron text-[10px] tracking-widest text-gray-500 w-8 uppercase">
                          {key}
                        </span>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${val}%`,
                              background:
                                "linear-gradient(to right, #19E6FF, #8B5CFF)",
                            }}
                          />
                        </div>
                        <span className="font-orbitron text-xs text-white w-6 text-right">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section
        id="leaderboard"
        className="py-24 bg-card/50"
        data-ocid="home.leaderboard_section"
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-orbitron text-4xl font-black text-white">
              <span className="glow-cyan">LEADER</span>BOARD
            </h2>
            <p className="font-rajdhani text-gray-400 text-lg mt-2">
              Top racers across all circuits
            </p>
          </motion.div>

          <motion.div
            className="rounded-xl overflow-hidden border border-white/8"
            style={{ background: "rgba(14,20,28,0.9)" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/8">
              <span className="col-span-1 font-orbitron text-[10px] tracking-widest text-gray-500">
                #
              </span>
              <span className="col-span-7 font-orbitron text-[10px] tracking-widest text-gray-500">
                PLAYER
              </span>
              <span className="col-span-4 font-orbitron text-[10px] tracking-widest text-gray-500 text-right">
                BEST TIME
              </span>
            </div>

            {scoresLoading && (
              <div
                className="py-12 text-center"
                data-ocid="home.leaderboard_loading_state"
              >
                <div className="inline-block w-6 h-6 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
                <p className="font-rajdhani text-gray-500 mt-3">
                  Loading scores...
                </p>
              </div>
            )}

            {!scoresLoading && (!scores || scores.length === 0) && (
              <div
                className="py-12 text-center"
                data-ocid="home.leaderboard_empty_state"
              >
                <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="font-orbitron text-sm text-gray-500">
                  No scores yet. Be the first!
                </p>
              </div>
            )}

            {scores?.slice(0, 10).map((score, i) => (
              <motion.div
                key={`score-${score.playerName}-${String(score.timestamp)}`}
                className={`grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors ${
                  i < 3 ? "bg-white/2" : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                data-ocid={`home.leaderboard.item.${i + 1}`}
              >
                <div className="col-span-1 flex items-center">
                  {i < 3 ? (
                    <span
                      className={`font-orbitron text-sm font-black ${
                        i === 0
                          ? "text-yellow-400"
                          : i === 1
                            ? "text-gray-300"
                            : "text-amber-600"
                      }`}
                    >
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                    </span>
                  ) : (
                    <span className="font-orbitron text-sm text-gray-500">
                      {i + 1}
                    </span>
                  )}
                </div>
                <div className="col-span-7 flex items-center">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-orbitron text-xs font-bold mr-3 text-background"
                    style={{ background: `hsl(${(i * 47) % 360}, 70%, 60%)` }}
                  >
                    {score.playerName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-rajdhani text-base font-semibold text-white">
                    {score.playerName}
                  </span>
                </div>
                <div className="col-span-4 flex items-center justify-end">
                  <span className="font-orbitron text-sm font-bold text-neon-cyan">
                    {formatTime(score.scoreValue)}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Play CTA */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(25,230,255,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            className="font-orbitron text-5xl font-black text-white mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            READY TO <span className="glow-cyan">RACE?</span>
          </motion.h2>
          <motion.p
            className="font-rajdhani text-xl text-gray-400 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Jump in and compete for the top spot on the leaderboard
          </motion.p>
          <motion.button
            className="px-16 py-6 font-orbitron text-2xl font-black tracking-widest border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/15 transition-all glow-box-cyan"
            onClick={onPlayGame}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            data-ocid="home.cta_play_button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            START RACE
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t border-white/8 py-12"
        style={{ background: "rgba(8,12,20,0.95)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center font-orbitron text-xs font-black text-background"
                style={{
                  background: "linear-gradient(135deg, #19E6FF, #8B5CFF)",
                }}
              >
                NV
              </div>
              <div>
                <div className="font-orbitron text-xs font-black tracking-widest text-white leading-none">
                  NEON VELOCITY
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 font-rajdhani text-xs tracking-widest text-gray-500">
              {["Support", "FAQ", "Privacy", "Terms"].map((link) => (
                <button
                  type="button"
                  key={link}
                  className="hover:text-gray-300 transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="font-rajdhani text-xs text-gray-600 tracking-wider">
              © {new Date().getFullYear()}. Built with ♥ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-neon-cyan transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
