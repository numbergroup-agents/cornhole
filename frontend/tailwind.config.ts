import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "corn-gold": "#FFD700",
        "corn-green": "#228B22",
        "corn-brown": "#8B4513",
        "corn-red": "#DC143C",
      },
      fontFamily: {
        game: ["'Press Start 2P'", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
