const MERCURY_DAY_TEMP = 427;
const MERCURY_NIGHT_TEMP = -173;
function getMercuryCycleState() {
  const now = /* @__PURE__ */ new Date();
  const cyclePosition = now.getMinutes() / 60;
  const sunPosition = cyclePosition;
  let phase;
  let intensity;
  if (sunPosition >= 0.1 && sunPosition < 0.4) {
    phase = sunPosition < 0.2 ? "dawn" : "day";
    intensity = sunPosition < 0.2 ? (sunPosition - 0.1) / 0.1 : 1;
  } else if (sunPosition >= 0.4 && sunPosition < 0.6) {
    phase = "day";
    intensity = 1;
  } else if (sunPosition >= 0.6 && sunPosition < 0.9) {
    phase = sunPosition > 0.8 ? "dusk" : "day";
    intensity = sunPosition > 0.8 ? 1 - (sunPosition - 0.8) / 0.1 : 1;
  } else {
    phase = "night";
    intensity = 1;
  }
  const dayFactor = Math.sin(sunPosition * Math.PI);
  const temperature = Math.round(
    MERCURY_NIGHT_TEMP + (MERCURY_DAY_TEMP - MERCURY_NIGHT_TEMP) * dayFactor
  );
  return {
    phase,
    sunPosition,
    temperature,
    intensity
  };
}
function getCycleOverlayColor(state) {
  switch (state.phase) {
    case "day":
      return `rgba(245, 158, 11, ${0.05 * state.intensity})`;
    case "night":
      return `rgba(59, 130, 246, ${0.08 * state.intensity})`;
    case "dawn":
      return `rgba(234, 88, 12, ${0.06 * state.intensity})`;
    case "dusk":
      return `rgba(234, 88, 12, ${0.06 * state.intensity})`;
    default:
      return "transparent";
  }
}
function getCycleGradient(state) {
  const baseColor = getCycleOverlayColor(state);
  if (state.phase === "night") {
    return `radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(30, 58, 138, ${0.15 * state.intensity}) 100%)`;
  } else if (state.phase === "day") {
    return `radial-gradient(ellipse at 50% -20%, rgba(251, 191, 36, ${0.1 * state.intensity}) 0%, transparent 60%)`;
  } else {
    return `linear-gradient(to bottom, ${baseColor} 0%, transparent 30%, transparent 70%, rgba(30, 41, 59, ${0.1 * state.intensity}) 100%)`;
  }
}
function formatTemperature(celsius, unit = "C") {
  if (unit === "F") {
    const fahrenheit = Math.round(celsius * 9 / 5 + 32);
    return `${fahrenheit}\xB0F`;
  }
  return `${celsius}\xB0C`;
}
export {
  formatTemperature,
  getCycleGradient,
  getCycleOverlayColor,
  getMercuryCycleState
};
