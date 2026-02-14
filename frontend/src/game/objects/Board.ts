import Phaser from "phaser";
import { LandingResult } from "../physics/landing";

export class Board extends Phaser.GameObjects.Container {
  private boardGraphics: Phaser.GameObjects.Graphics;
  private holeGraphics: Phaser.GameObjects.Graphics;

  // Board dimensions (with perspective - wider at bottom)
  private readonly BOARD_TOP_WIDTH = 120;
  private readonly BOARD_BOTTOM_WIDTH = 160;
  private readonly BOARD_HEIGHT = 240;
  private readonly HOLE_RADIUS = 22;
  private readonly HOLE_OFFSET_Y = -60; // Hole is in upper portion of board

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.boardGraphics = scene.add.graphics();
    this.holeGraphics = scene.add.graphics();
    this.add(this.boardGraphics);
    this.add(this.holeGraphics);

    this.drawBoard();
  }

  private drawBoard(): void {
    const halfTopW = this.BOARD_TOP_WIDTH / 2;
    const halfBotW = this.BOARD_BOTTOM_WIDTH / 2;
    const halfH = this.BOARD_HEIGHT / 2;

    // Board surface (perspective trapezoid)
    this.boardGraphics.fillStyle(0x8b4513, 1);
    this.boardGraphics.beginPath();
    this.boardGraphics.moveTo(-halfTopW, -halfH);     // Top left
    this.boardGraphics.lineTo(halfTopW, -halfH);      // Top right
    this.boardGraphics.lineTo(halfBotW, halfH);       // Bottom right
    this.boardGraphics.lineTo(-halfBotW, halfH);      // Bottom left
    this.boardGraphics.closePath();
    this.boardGraphics.fillPath();

    // Board border
    this.boardGraphics.lineStyle(3, 0xffd700, 0.8);
    this.boardGraphics.beginPath();
    this.boardGraphics.moveTo(-halfTopW, -halfH);
    this.boardGraphics.lineTo(halfTopW, -halfH);
    this.boardGraphics.lineTo(halfBotW, halfH);
    this.boardGraphics.lineTo(-halfBotW, halfH);
    this.boardGraphics.closePath();
    this.boardGraphics.strokePath();

    // Wood grain lines
    this.boardGraphics.lineStyle(1, 0x7a3b10, 0.3);
    for (let i = -halfH + 20; i < halfH; i += 30) {
      const progress = (i + halfH) / this.BOARD_HEIGHT;
      const currentHalfW =
        halfTopW + (halfBotW - halfTopW) * progress;
      this.boardGraphics.lineBetween(
        -currentHalfW + 10,
        i,
        currentHalfW - 10,
        i
      );
    }

    // Hole (dark circle with rim)
    this.holeGraphics.fillStyle(0x000000, 1);
    this.holeGraphics.fillCircle(0, this.HOLE_OFFSET_Y, this.HOLE_RADIUS);
    this.holeGraphics.lineStyle(2, 0x333333, 1);
    this.holeGraphics.strokeCircle(0, this.HOLE_OFFSET_Y, this.HOLE_RADIUS);

    // Inner hole shadow
    this.holeGraphics.fillStyle(0x111111, 0.5);
    this.holeGraphics.fillCircle(0, this.HOLE_OFFSET_Y, this.HOLE_RADIUS - 4);
  }

  /**
   * Returns the bounding box of the board in world coordinates.
   */
  getBoardBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.x - this.BOARD_BOTTOM_WIDTH / 2,
      y: this.y - this.BOARD_HEIGHT / 2,
      width: this.BOARD_BOTTOM_WIDTH,
      height: this.BOARD_HEIGHT,
    };
  }

  /**
   * Returns the center of the hole in world coordinates.
   */
  getHoleCenter(): { x: number; y: number } {
    return {
      x: this.x,
      y: this.y + this.HOLE_OFFSET_Y,
    };
  }

  /**
   * Returns the hole radius.
   */
  getHoleRadius(): number {
    return this.HOLE_RADIUS;
  }

  /**
   * Shows a visual effect at the landing point.
   */
  showLandingEffect(x: number, y: number, result: LandingResult): void {
    const scene = this.scene;

    if (result === "hole") {
      // Swirl/disappear effect for hole-in
      const circle = scene.add.graphics();
      circle.fillStyle(0xffd700, 0.8);
      circle.fillCircle(x, y, 5);

      scene.tweens.add({
        targets: circle,
        alpha: 0,
        scaleX: 3,
        scaleY: 3,
        duration: 500,
        onComplete: () => circle.destroy(),
      });

      // Score text popup
      const scoreText = scene.add.text(x, y - 20, "+3", {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#FFD700",
        fontStyle: "bold",
      });
      scoreText.setOrigin(0.5);

      scene.tweens.add({
        targets: scoreText,
        y: y - 60,
        alpha: 0,
        duration: 800,
        onComplete: () => scoreText.destroy(),
      });
    } else if (result === "board") {
      // Dust puff on board
      const puff = scene.add.graphics();
      puff.fillStyle(0x8b4513, 0.4);
      puff.fillCircle(x, y, 8);

      scene.tweens.add({
        targets: puff,
        alpha: 0,
        scaleX: 2,
        scaleY: 2,
        duration: 400,
        onComplete: () => puff.destroy(),
      });

      // Score text popup
      const scoreText = scene.add.text(x, y - 20, "+1", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#8B4513",
        fontStyle: "bold",
      });
      scoreText.setOrigin(0.5);

      scene.tweens.add({
        targets: scoreText,
        y: y - 50,
        alpha: 0,
        duration: 600,
        onComplete: () => scoreText.destroy(),
      });
    } else {
      // Miss: small dust cloud on ground
      const dust = scene.add.graphics();
      dust.fillStyle(0x555555, 0.3);
      dust.fillCircle(x, y, 6);

      scene.tweens.add({
        targets: dust,
        alpha: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 300,
        onComplete: () => dust.destroy(),
      });

      const missText = scene.add.text(x, y - 15, "Miss", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#666666",
      });
      missText.setOrigin(0.5);

      scene.tweens.add({
        targets: missText,
        y: y - 40,
        alpha: 0,
        duration: 500,
        onComplete: () => missText.destroy(),
      });
    }
  }
}
