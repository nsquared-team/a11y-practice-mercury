// Mercury day/night cycle utilities
// Mercury's solar day is about 176 Earth days
// For visual effect, we'll simulate this on a compressed timescale

export type MercuryCyclePhase = 'day' | 'night' | 'dawn' | 'dusk';

export interface MercuryCycleState {
  phase: MercuryCyclePhase;
  sunPosition: number; // 0-1, where 0.5 is solar noon
  temperature: number; // Simulated surface temperature in Celsius
  intensity: number; // 0-1, how intense the current phase is
}

// Mercury's extreme temperatures
const MERCURY_DAY_TEMP = 427; // °C (800°F)
const MERCURY_NIGHT_TEMP = -173; // °C (-280°F)

/**
 * Calculate the current Mercury cycle state
 * Uses a compressed cycle (1 hour = 1 Mercury "hour" for demo purposes)
 * In reality, Mercury's day is 176 Earth days
 */
export function getMercuryCycleState(): MercuryCycleState {
  const now = new Date();

  // Use minutes of the hour for a visible cycle (60 min = full day)
  // This makes the effect visible during a demo session
  const cyclePosition = now.getMinutes() / 60;

  // Sun position: 0 = midnight, 0.5 = noon, 1 = midnight again
  const sunPosition = cyclePosition;

  // Determine phase and intensity
  let phase: MercuryCyclePhase;
  let intensity: number;

  if (sunPosition >= 0.1 && sunPosition < 0.4) {
    // Morning/Day
    phase = sunPosition < 0.2 ? 'dawn' : 'day';
    intensity = sunPosition < 0.2
      ? (sunPosition - 0.1) / 0.1  // Dawn: 0->1
      : 1;
  } else if (sunPosition >= 0.4 && sunPosition < 0.6) {
    // Peak day (solar noon around 0.5)
    phase = 'day';
    intensity = 1;
  } else if (sunPosition >= 0.6 && sunPosition < 0.9) {
    // Afternoon/Evening
    phase = sunPosition > 0.8 ? 'dusk' : 'day';
    intensity = sunPosition > 0.8
      ? 1 - (sunPosition - 0.8) / 0.1  // Dusk: 1->0
      : 1;
  } else {
    // Night (0-0.1 or 0.9-1)
    phase = 'night';
    intensity = 1;
  }

  // Calculate temperature based on sun position
  // Smoothly interpolate between day and night temperatures
  const dayFactor = Math.sin(sunPosition * Math.PI);
  const temperature = Math.round(
    MERCURY_NIGHT_TEMP + (MERCURY_DAY_TEMP - MERCURY_NIGHT_TEMP) * dayFactor
  );

  return {
    phase,
    sunPosition,
    temperature,
    intensity,
  };
}

/**
 * Get the overlay color based on the current cycle state
 */
export function getCycleOverlayColor(state: MercuryCycleState): string {
  switch (state.phase) {
    case 'day':
      // Warm amber glow during day
      return `rgba(245, 158, 11, ${0.05 * state.intensity})`;
    case 'night':
      // Cool blue tint at night
      return `rgba(59, 130, 246, ${0.08 * state.intensity})`;
    case 'dawn':
      // Transition from blue to amber
      return `rgba(234, 88, 12, ${0.06 * state.intensity})`;
    case 'dusk':
      // Transition from amber to blue
      return `rgba(234, 88, 12, ${0.06 * state.intensity})`;
    default:
      return 'transparent';
  }
}

/**
 * Get CSS gradient for the overlay effect
 */
export function getCycleGradient(state: MercuryCycleState): string {
  const baseColor = getCycleOverlayColor(state);

  if (state.phase === 'night') {
    // Night: cool gradient from edges
    return `radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(30, 58, 138, ${0.15 * state.intensity}) 100%)`;
  } else if (state.phase === 'day') {
    // Day: warm gradient suggesting sun
    return `radial-gradient(ellipse at 50% -20%, rgba(251, 191, 36, ${0.1 * state.intensity}) 0%, transparent 60%)`;
  } else {
    // Dawn/Dusk: horizon glow
    return `linear-gradient(to bottom, ${baseColor} 0%, transparent 30%, transparent 70%, rgba(30, 41, 59, ${0.1 * state.intensity}) 100%)`;
  }
}

/**
 * Format temperature for display
 */
export function formatTemperature(celsius: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    const fahrenheit = Math.round((celsius * 9/5) + 32);
    return `${fahrenheit}°F`;
  }
  return `${celsius}°C`;
}
