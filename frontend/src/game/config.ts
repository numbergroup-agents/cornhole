import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { MatchScene } from "./scenes/MatchScene";
import { ResultScene } from "./scenes/ResultScene";

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    transparent: true,
    physics: {
      default: "matter",
      matter: {
        gravity: { x: 0, y: 1 },
        debug: false,
      },
    },
    scene: [BootScene, MatchScene, ResultScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
  };
}
