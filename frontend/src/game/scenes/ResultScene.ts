import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

interface ResultData {
  p1Score: number;
  p2Score: number;
  matchId?: string;
}

export class ResultScene extends Phaser.Scene {
  private data!: ResultData;

  constructor() {
    super({ key: "ResultScene" });
  }

  init(data: ResultData): void {
    this.data = data;
  }

  create(): void {
    const { p1Score, p2Score } = this.data;
    const isWinner = p1Score > p2Score;
    const isDraw = p1Score === p2Score;
    const centerX = GAME_WIDTH / 2;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0a0a0f, 0x0a0a0f, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Result icon
    const iconText = isDraw ? "🤝" : isWinner ? "🏆" : "😔";
    this.add
      .text(centerX, 80, iconText, { fontSize: "64px" })
      .setOrigin(0.5);

    // Title
    const titleColor = isDraw ? "#FFD700" : isWinner ? "#228B22" : "#DC143C";
    const titleStr = isDraw ? "DRAW" : isWinner ? "VICTORY!" : "DEFEAT";
    this.add
      .text(centerX, 160, titleStr, {
        fontFamily: "monospace",
        fontSize: "48px",
        color: titleColor,
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Final score
    this.add
      .text(centerX, 220, `${p1Score} - ${p2Score}`, {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // CORN earned/lost
    const cornAmount = isDraw ? 0 : isWinner ? 50 : -50;
    const cornColor = cornAmount >= 0 ? "#FFD700" : "#DC143C";
    const cornSign = cornAmount >= 0 ? "+" : "";
    this.add
      .text(centerX, 270, `${cornSign}${cornAmount} $CORN`, {
        fontFamily: "monospace",
        fontSize: "24px",
        color: cornColor,
      })
      .setOrigin(0.5);

    // Throw summary header
    this.add
      .text(centerX, 330, "Match Summary", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#888888",
      })
      .setOrigin(0.5);

    // Summary stats
    const summaryY = 370;
    const stats = [
      `Total Throws: ${Math.ceil((p1Score + p2Score) / 2)}`,
      `Holes (3pts): ${Math.floor(Math.max(p1Score, p2Score) / 3)}`,
      `Boards (1pt): ${(p1Score + p2Score) % 3}`,
    ];

    stats.forEach((stat, i) => {
      this.add
        .text(centerX, summaryY + i * 28, stat, {
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#aaaaaa",
        })
        .setOrigin(0.5);
    });

    // Buttons
    const buttonY = 490;

    // Play Again button
    const playAgainBg = this.add.graphics();
    playAgainBg.fillStyle(0xffd700, 1);
    playAgainBg.fillRoundedRect(centerX - 200, buttonY, 180, 50, 10);
    const playAgainText = this.add
      .text(centerX - 110, buttonY + 25, "Play Again", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#000000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const playAgainZone = this.add
      .zone(centerX - 110, buttonY + 25, 180, 50)
      .setInteractive({ useHandCursor: true });

    playAgainZone.on("pointerdown", () => {
      this.scene.start("MatchScene");
    });

    playAgainZone.on("pointerover", () => {
      playAgainBg.clear();
      playAgainBg.fillStyle(0xffea00, 1);
      playAgainBg.fillRoundedRect(centerX - 200, buttonY, 180, 50, 10);
    });

    playAgainZone.on("pointerout", () => {
      playAgainBg.clear();
      playAgainBg.fillStyle(0xffd700, 1);
      playAgainBg.fillRoundedRect(centerX - 200, buttonY, 180, 50, 10);
    });

    // Return to Lobby button
    const lobbyBg = this.add.graphics();
    lobbyBg.lineStyle(2, 0xffd700, 1);
    lobbyBg.strokeRoundedRect(centerX + 20, buttonY, 180, 50, 10);
    const lobbyText = this.add
      .text(centerX + 110, buttonY + 25, "Return to Lobby", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#FFD700",
      })
      .setOrigin(0.5);

    const lobbyZone = this.add
      .zone(centerX + 110, buttonY + 25, 180, 50)
      .setInteractive({ useHandCursor: true });

    lobbyZone.on("pointerdown", () => {
      // Navigate away from game - handled by parent component
      if (typeof window !== "undefined") {
        window.location.href = "/play";
      }
    });

    lobbyZone.on("pointerover", () => {
      lobbyBg.clear();
      lobbyBg.fillStyle(0xffd700, 0.1);
      lobbyBg.fillRoundedRect(centerX + 20, buttonY, 180, 50, 10);
      lobbyBg.lineStyle(2, 0xffd700, 1);
      lobbyBg.strokeRoundedRect(centerX + 20, buttonY, 180, 50, 10);
    });

    lobbyZone.on("pointerout", () => {
      lobbyBg.clear();
      lobbyBg.lineStyle(2, 0xffd700, 1);
      lobbyBg.strokeRoundedRect(centerX + 20, buttonY, 180, 50, 10);
    });
  }
}
