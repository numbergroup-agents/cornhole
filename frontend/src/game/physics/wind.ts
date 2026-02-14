import { Point } from "./throw";

export interface WindState {
  speed: number;    // 0-15 mph
  direction: number; // 0-360 degrees
}

/**
 * Generates a new wind state. If a previous state is provided,
 * the new wind drifts slightly from it rather than being fully random.
 *
 * @param previous - Optional previous wind state for drift-based generation
 * @returns New WindState
 */
export function generateWind(previous?: WindState): WindState {
  if (!previous) {
    // Initial wind: random within range
    return {
      speed: Math.random() * 10,
      direction: Math.random() * 360,
    };
  }

  // Drift from previous: small random changes
  const speedDrift = (Math.random() - 0.5) * 4; // -2 to +2
  const directionDrift = (Math.random() - 0.5) * 40; // -20 to +20 degrees

  let newSpeed = previous.speed + speedDrift;
  let newDirection = previous.direction + directionDrift;

  // Clamp speed to 0-15
  newSpeed = Math.max(0, Math.min(15, newSpeed));

  // Normalize direction to 0-360
  newDirection = ((newDirection % 360) + 360) % 360;

  return {
    speed: newSpeed,
    direction: newDirection,
  };
}

/**
 * Applies wind displacement to a trajectory.
 * Wind pushes bags laterally based on wind speed and direction.
 *
 * @param trajectory - Array of trajectory points to modify
 * @param wind - Current wind state
 * @returns Modified trajectory points with wind applied
 */
export function applyWind(trajectory: Point[], wind: WindState): Point[] {
  if (wind.speed === 0) return trajectory;

  const windRad = (wind.direction * Math.PI) / 180;
  const windForceX = Math.cos(windRad) * wind.speed * 0.08;
  const windForceY = Math.sin(windRad) * wind.speed * 0.04;

  return trajectory.map((point, index) => {
    // Wind effect increases over time (cumulative displacement)
    const timeFactor = (index / trajectory.length) * (index / trajectory.length);
    return {
      x: point.x + windForceX * index * timeFactor,
      y: point.y + windForceY * index * timeFactor * 0.5,
    };
  });
}

/**
 * Returns a human-readable wind direction string.
 */
export function getWindDirectionLabel(direction: number): string {
  const normalized = ((direction % 360) + 360) % 360;

  if (normalized >= 337.5 || normalized < 22.5) return "E";
  if (normalized >= 22.5 && normalized < 67.5) return "SE";
  if (normalized >= 67.5 && normalized < 112.5) return "S";
  if (normalized >= 112.5 && normalized < 157.5) return "SW";
  if (normalized >= 157.5 && normalized < 202.5) return "W";
  if (normalized >= 202.5 && normalized < 247.5) return "NW";
  if (normalized >= 247.5 && normalized < 292.5) return "N";
  return "NE";
}
