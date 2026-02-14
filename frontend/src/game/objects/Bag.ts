import Phaser from "phaser";
import { Point } from "../physics/throw";

export class Bag extends Phaser.GameObjects.Sprite {
  private animating = false;
  private tweenTimeline: Phaser.Tweens.Tween | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string = "bag-red"
  ) {
    super(scene, x, y, texture);

    scene.add.existing(this);

    this.setOrigin(0.5);
    this.setScale(0.8);
    this.setDepth(10);

    // Subtle idle animation
    scene.tweens.add({
      targets: this,
      y: y - 3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  /**
   * Whether the bag is currently in a throw animation.
   */
  isAnimating(): boolean {
    return this.animating;
  }

  /**
   * Animates the bag along a trajectory path, then calls onComplete.
   *
   * @param trajectory - Array of {x, y} points to follow
   * @param onComplete - Callback when animation finishes
   */
  throwBag(trajectory: Point[], onComplete?: () => void): void {
    if (this.animating) return;
    this.animating = true;

    // Stop idle animation
    this.scene.tweens.killTweensOf(this);

    // Create timeline following trajectory points
    const duration = trajectory.length * 10; // ~10ms per point
    let currentIndex = 0;

    this.scene.time.addEvent({
      delay: 10,
      repeat: trajectory.length - 1,
      callback: () => {
        if (currentIndex < trajectory.length) {
          const point = trajectory[currentIndex];
          this.setPosition(point.x, point.y);

          // Rotate the bag slightly during flight
          this.setRotation(this.rotation + 0.05);

          // Scale slightly smaller as it moves away (perspective)
          const progress = currentIndex / trajectory.length;
          const scale = 0.8 - progress * 0.2;
          this.setScale(Math.max(scale, 0.4));

          currentIndex++;
        }

        // On last frame, complete
        if (currentIndex >= trajectory.length) {
          this.animating = false;

          // Landing squish effect
          this.scene.tweens.add({
            targets: this,
            scaleX: 0.7,
            scaleY: 0.5,
            duration: 100,
            yoyo: true,
            onComplete: () => {
              // Fade out after landing
              this.scene.tweens.add({
                targets: this,
                alpha: 0.5,
                duration: 300,
                onComplete: () => {
                  if (onComplete) onComplete();
                },
              });
            },
          });
        }
      },
    });
  }

  /**
   * Resets the bag to its starting position.
   */
  resetPosition(x: number, y: number): void {
    this.animating = false;
    this.scene.tweens.killTweensOf(this);
    this.setPosition(x, y);
    this.setAlpha(1);
    this.setScale(0.8);
    this.setRotation(0);

    // Restart idle animation
    this.scene.tweens.add({
      targets: this,
      y: y - 3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  /**
   * Updates the bag texture (for cosmetic changes).
   */
  setCosmetic(textureKey: string): void {
    this.setTexture(textureKey);
  }
}
