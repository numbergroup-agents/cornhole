import Phaser from "phaser";
import { Bag } from "../objects/Bag";
import { Board } from "../objects/Board";
import { calculateTrajectory, Point } from "../physics/throw";
import { determineLanding, LandingResult } from "../physics/landing";
import { generateWind, applyWind, WindState } from "../physics/wind";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

interface MatchData {
  matchId?: string;
  onThrow?: (angle: number, power: number, result: LandingResult) => void;
  onScoreUpdate?: (p1Score: number, p2Score: number) => void;
}

export class MatchScene extends Phaser.Scene {
  private board!: Board;
  private currentBag!: Bag;
  private trajectoryGraphics!: Phaser.GameObjects.Graphics;
  private windArrow!: Phaser.GameObjects.Graphics;
  private windText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private scoreP1Text!: Phaser.GameObjects.Text;
  private scoreP2Text!: Phaser.GameObjects.Text;

  private wind: WindState = { speed: 0, direction: 0 };
  private isDragging = false;
  private dragStart: Point = { x: 0, y: 0 };
  private dragEnd: Point = { x: 0, y: 0 };
  private isMyTurn = true;
  private p1Score = 0;
  private p2Score = 0;
  private matchData: MatchData = {};

  // Bag starting position
  private readonly BAG_START_X = GAME_WIDTH / 2;
  private readonly BAG_START_Y = GAME_HEIGHT - 80;

  constructor() {
    super({ key: "MatchScene" });
  }

  init(data: MatchData): void {
    this.matchData = data || {};
    this.p1Score = 0;
    this.p2Score = 0;
    this.isMyTurn = true;
  }

  create(): void {
    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0a0a0f, 0x0a0a0f, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Ground line
    const ground = this.add.graphics();
    ground.lineStyle(2, 0x333333, 0.5);
    ground.lineBetween(0, GAME_HEIGHT - 40, GAME_WIDTH, GAME_HEIGHT - 40);

    // Create board
    this.board = new Board(this, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);

    // Create trajectory preview graphics
    this.trajectoryGraphics = this.add.graphics();

    // Wind indicator
    this.wind = generateWind();
    this.windArrow = this.add.graphics();
    this.windText = this.add.text(GAME_WIDTH - 120, 20, "", {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#aaaaaa",
    });
    this.updateWindDisplay();

    // Score display
    this.scoreP1Text = this.add.text(20, 20, "P1: 0", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#DC143C",
    });

    this.scoreP2Text = this.add.text(GAME_WIDTH - 100, 20, "P2: 0", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#4169E1",
    });

    // Turn indicator
    this.turnText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 20,
      "Your Turn",
      {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#FFD700",
      }
    );
    this.turnText.setOrigin(0.5);

    // Create first bag
    this.spawnBag();

    // Input handling
    this.input.on("pointerdown", this.onPointerDown, this);
    this.input.on("pointermove", this.onPointerMove, this);
    this.input.on("pointerup", this.onPointerUp, this);
  }

  private spawnBag(): void {
    const textureKey = this.isMyTurn ? "bag-red" : "bag-blue";
    this.currentBag = new Bag(this, this.BAG_START_X, this.BAG_START_Y, textureKey);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.isMyTurn) return;
    if (this.currentBag.isAnimating()) return;

    this.isDragging = true;
    this.dragStart = { x: pointer.x, y: pointer.y };
    this.dragEnd = { x: pointer.x, y: pointer.y };
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isDragging) return;

    this.dragEnd = { x: pointer.x, y: pointer.y };

    // Calculate angle and power from drag
    const dx = this.dragStart.x - this.dragEnd.x;
    const dy = this.dragStart.y - this.dragEnd.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const power = Math.min(distance / 3, 100);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Only show trajectory for upward throws (angle between 0-180 degrees)
    if (angle > 0 && angle < 180) {
      this.drawTrajectoryPreview(angle, power);
    } else {
      this.trajectoryGraphics.clear();
    }
  }

  private onPointerUp(_pointer: Phaser.Input.Pointer): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.trajectoryGraphics.clear();

    const dx = this.dragStart.x - this.dragEnd.x;
    const dy = this.dragStart.y - this.dragEnd.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const power = Math.min(distance / 3, 100);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Only throw if power threshold met and angle is upward
    if (power < 5 || angle <= 0 || angle >= 180) return;

    this.executeThrow(angle, power);
  }

  private drawTrajectoryPreview(angle: number, power: number): void {
    this.trajectoryGraphics.clear();

    const startPoint = { x: this.BAG_START_X, y: this.BAG_START_Y };
    let trajectory = calculateTrajectory(angle, power, this.wind, startPoint);
    trajectory = applyWind(trajectory, this.wind);

    this.trajectoryGraphics.lineStyle(2, 0xffd700, 0.6);
    this.trajectoryGraphics.beginPath();

    for (let i = 0; i < trajectory.length; i++) {
      const point = trajectory[i];
      if (i === 0) {
        this.trajectoryGraphics.moveTo(point.x, point.y);
      } else {
        this.trajectoryGraphics.lineTo(point.x, point.y);
      }
    }

    this.trajectoryGraphics.strokePath();

    // Draw dots along trajectory
    this.trajectoryGraphics.fillStyle(0xffd700, 0.8);
    for (let i = 0; i < trajectory.length; i += 5) {
      const point = trajectory[i];
      this.trajectoryGraphics.fillCircle(point.x, point.y, 2);
    }
  }

  private executeThrow(angle: number, power: number): void {
    const startPoint = { x: this.BAG_START_X, y: this.BAG_START_Y };
    let trajectory = calculateTrajectory(angle, power, this.wind, startPoint);
    trajectory = applyWind(trajectory, this.wind);

    // Determine landing point (last point of trajectory)
    const landingPoint = trajectory[trajectory.length - 1] || startPoint;

    // Check landing result
    const boardBounds = this.board.getBoardBounds();
    const holeCenter = this.board.getHoleCenter();
    const holeRadius = this.board.getHoleRadius();
    const result = determineLanding(
      landingPoint.x,
      landingPoint.y,
      boardBounds,
      holeCenter,
      holeRadius
    );

    // Animate bag along trajectory
    this.currentBag.throwBag(trajectory, () => {
      this.onThrowComplete(result);
    });

    // Show landing effect
    this.time.delayedCall(trajectory.length * 10, () => {
      this.board.showLandingEffect(landingPoint.x, landingPoint.y, result);
    });

    // Notify external handler
    if (this.matchData.onThrow) {
      this.matchData.onThrow(angle, power, result);
    }
  }

  private onThrowComplete(result: LandingResult): void {
    // Update score
    const points = result === "hole" ? 3 : result === "board" ? 1 : 0;
    if (this.isMyTurn) {
      this.p1Score += points;
    } else {
      this.p2Score += points;
    }

    this.scoreP1Text.setText(`P1: ${this.p1Score}`);
    this.scoreP2Text.setText(`P2: ${this.p2Score}`);

    if (this.matchData.onScoreUpdate) {
      this.matchData.onScoreUpdate(this.p1Score, this.p2Score);
    }

    // Check for match end (first to 21)
    if (this.p1Score >= 21 || this.p2Score >= 21) {
      this.time.delayedCall(1000, () => {
        this.scene.start("ResultScene", {
          p1Score: this.p1Score,
          p2Score: this.p2Score,
          matchId: this.matchData.matchId,
        });
      });
      return;
    }

    // Switch turns
    this.isMyTurn = !this.isMyTurn;
    this.turnText.setText(this.isMyTurn ? "Your Turn" : "Opponent's Turn");
    this.turnText.setColor(this.isMyTurn ? "#FFD700" : "#888888");

    // Update wind slightly
    this.wind = generateWind(this.wind);
    this.updateWindDisplay();

    // Spawn next bag
    this.time.delayedCall(500, () => {
      this.spawnBag();
    });
  }

  private updateWindDisplay(): void {
    this.windArrow.clear();

    const arrowX = GAME_WIDTH - 60;
    const arrowY = 55;
    const arrowLength = this.wind.speed * 2;
    const rad = (this.wind.direction * Math.PI) / 180;

    this.windArrow.lineStyle(2, 0x88aaff, 0.8);
    this.windArrow.beginPath();
    this.windArrow.moveTo(arrowX, arrowY);
    this.windArrow.lineTo(
      arrowX + Math.cos(rad) * arrowLength,
      arrowY + Math.sin(rad) * arrowLength
    );
    this.windArrow.strokePath();

    this.windText.setText(`Wind: ${this.wind.speed.toFixed(1)} mph`);
  }

  /** Called externally to simulate an opponent's throw */
  public simulateOpponentThrow(angle: number, power: number): void {
    this.isMyTurn = false;
    this.spawnBag();
    this.executeThrow(angle, power);
  }
}
