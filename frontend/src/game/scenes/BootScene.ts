import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "BootScene" });
  }

  preload(): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    // Progress bar background
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(centerX - 160, centerY - 15, 320, 30);

    // Progress bar fill
    this.progressBar = this.add.graphics();

    // Loading text
    this.loadingText = this.add.text(centerX, centerY - 40, "Loading...", {
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#FFD700",
    });
    this.loadingText.setOrigin(0.5);

    // Progress events
    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffd700, 1);
      this.progressBar.fillRect(centerX - 155, centerY - 10, 310 * value, 20);
    });

    this.load.on("complete", () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
    });

    // Generate placeholder textures instead of loading external files
    this.createPlaceholderTextures();
  }

  private createPlaceholderTextures(): void {
    // Bag texture - small square with rounded appearance
    const bagGraphics = this.add.graphics();
    bagGraphics.fillStyle(0xdc143c, 1);
    bagGraphics.fillRoundedRect(0, 0, 40, 40, 8);
    bagGraphics.generateTexture("bag-red", 40, 40);
    bagGraphics.destroy();

    const bagBlueGraphics = this.add.graphics();
    bagBlueGraphics.fillStyle(0x4169e1, 1);
    bagBlueGraphics.fillRoundedRect(0, 0, 40, 40, 8);
    bagBlueGraphics.generateTexture("bag-blue", 40, 40);
    bagBlueGraphics.destroy();

    // Board texture - rectangle
    const boardGraphics = this.add.graphics();
    boardGraphics.fillStyle(0x8b4513, 1);
    boardGraphics.fillRect(0, 0, 160, 280);
    // Hole
    boardGraphics.fillStyle(0x000000, 1);
    boardGraphics.fillCircle(80, 70, 25);
    // Board border
    boardGraphics.lineStyle(3, 0xffd700, 1);
    boardGraphics.strokeRect(0, 0, 160, 280);
    boardGraphics.generateTexture("board", 160, 280);
    boardGraphics.destroy();

    // Particle texture
    const particleGraphics = this.add.graphics();
    particleGraphics.fillStyle(0xffffff, 1);
    particleGraphics.fillCircle(4, 4, 4);
    particleGraphics.generateTexture("particle", 8, 8);
    particleGraphics.destroy();
  }

  create(): void {
    this.scene.start("MatchScene");
  }
}
