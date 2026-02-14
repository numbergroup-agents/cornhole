export type LandingResult = "miss" | "board" | "hole";

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CircleHitbox {
  x: number;
  y: number;
}

/**
 * Determines where a bag landed relative to the board and hole.
 *
 * Scoring:
 * - miss  = 0 points (bag missed the board entirely)
 * - board = 1 point  (bag landed on the board surface)
 * - hole  = 3 points (bag went through the hole)
 *
 * @param x - Landing x position
 * @param y - Landing y position
 * @param boardBounds - Rectangle bounds of the board {x, y, width, height}
 * @param holeCenter - Center position of the hole {x, y}
 * @param holeRadius - Radius of the hole
 * @returns LandingResult indicating where the bag landed
 */
export function determineLanding(
  x: number,
  y: number,
  boardBounds: Bounds,
  holeCenter: CircleHitbox,
  holeRadius: number
): LandingResult {
  // Check hole first (circle collision)
  const dx = x - holeCenter.x;
  const dy = y - holeCenter.y;
  const distanceSquared = dx * dx + dy * dy;

  if (distanceSquared <= holeRadius * holeRadius) {
    return "hole";
  }

  // Check board bounds (rectangle collision)
  const onBoard =
    x >= boardBounds.x &&
    x <= boardBounds.x + boardBounds.width &&
    y >= boardBounds.y &&
    y <= boardBounds.y + boardBounds.height;

  if (onBoard) {
    return "board";
  }

  return "miss";
}

/**
 * Returns the point value for a landing result.
 */
export function getPoints(result: LandingResult): number {
  switch (result) {
    case "hole":
      return 3;
    case "board":
      return 1;
    case "miss":
      return 0;
  }
}
