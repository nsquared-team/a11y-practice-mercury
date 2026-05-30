// A11y-neutral SVG geometry helpers. Pure math shared by both trees so the two
// charts plot identically; each tree wraps the resulting <svg> with its own
// (accessible or inaccessible) markup.

export function linePlot(points, { width = 520, height = 200, pad = 28 } = {}) {
  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const xy = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * innerW;
    const y = pad + (1 - (p.value - min) / span) * innerH;
    return { x: +x.toFixed(1), y: +y.toFixed(1), ...p };
  });
  const line = xy.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${xy[xy.length - 1].x},${height - pad} L${xy[0].x},${height - pad} Z`;
  return { xy, line, area, width, height, pad, max, min };
}

// Multi-series area/line chart over a shared x-axis.
// labels: string[]; series: [{ key, label, color, values: number[] }].
export function multiSeriesPlot(labels, series, { width = 720, height = 240, pad = 32 } = {}) {
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const x = labels.map((t, i) => +(pad + (i / (labels.length - 1)) * innerW).toFixed(1));
  const plotted = series.map((s) => {
    const xy = s.values.map((v, i) => ({ x: x[i], y: +(pad + (1 - v / max) * innerH).toFixed(1), v, t: labels[i] }));
    const line = xy.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const area = `${line} L${xy[xy.length - 1].x},${height - pad} L${xy[0].x},${height - pad} Z`;
    return { ...s, xy, line, area };
  });
  return { x, labels, series: plotted, width, height, pad, max, baseline: height - pad };
}

export function barPlot(bars, { width = 520, height = 200, pad = 28, gap = 16 } = {}) {
  const values = bars.map((b) => b.value);
  const max = Math.max(...values);
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const bw = (innerW - gap * (bars.length - 1)) / bars.length;
  const rects = bars.map((b, i) => {
    const h = (b.value / max) * innerH;
    return {
      x: +(pad + i * (bw + gap)).toFixed(1),
      y: +(pad + (innerH - h)).toFixed(1),
      w: +bw.toFixed(1),
      h: +h.toFixed(1),
      ...b,
    };
  });
  return { rects, width, height, pad, max, baseline: pad + innerH };
}
