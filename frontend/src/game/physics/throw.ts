import { WindState } from "./wind";

export interface Point {
  x: number;
  y: number;
}

/**
 * Calculates a parabolic trajectory for a cornhole bag throw.
 *
 * @param angle - Throw angle in degrees (0-180, where 90 is straight up)
 * @param power - Throw power as percentage (0-100)
 * @param wind - Current wind state
 * @param startPoint - Starting position of the throw
 * @returns Array of {x,y} points representing the trajectory arc
 */
export function calculateTrajectory(
  angle: number,
  power: number,
  wind: WindState,
  startPoint: Point = { x: 400, y: 520 }
): Point[] {
  const points: Point[] = [];

  // Convert angle to radians
  const rad = (angle * Math.PI) / 180;

  // Scale power to velocity (power 0-100 maps to velocity range)
  const velocity = (power / 100) * 12;

  // Horizontal and vertical velocity components
  const vx = velocity * Math.cos(rad);
  const vy = -velocity * Math.sin(rad); // negative because y-axis is inverted in screen coords

  // Gravity constant (pixels per step^2)
  const gravity = 0.15;

  // Number of simulation steps
  const maxSteps = 120;

  let x = startPoint.x;
  let y = startPoint.y;
  let currentVx = vx;
  let currentVy = vy;

  for (let step = 0; step < maxSteps; step++) {
    points.push({ x, y });

    // Update velocities
    currentVy += gravity;

    // Apply wind as a gentle horizontal force
    const windRad = (wind.direction * Math.PI) / 180;
    const windForce = wind.speed * 0.005;
    currentVx += Math.cos(windRad) * windForce;

    // Update position
    x += currentVx;
    y += currentVy;

    // Stop if bag goes below ground level or off screen
    if (y > 580 || x < -50 || x > 850) {
      points.push({ x, y: Math.min(y, 580) });
      break;
    }
  }

  return points;
}
