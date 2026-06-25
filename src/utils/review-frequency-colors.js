function clampFrequency(freq) {
  return Math.min(100, Math.max(0, Math.round(Number(freq) || 0)));
}

function getFrequencyHsl(freq) {
  const n = clampFrequency(freq);

  if (n <= 30) {
    const t = n / 30;
    return { h: 142, s: 52 + t * 18, l: 34 + t * 14 };
  }

  if (n <= 70) {
    const t = (n - 31) / 39;
    return { h: 43, s: 88, l: 36 + t * 16 };
  }

  const t = (n - 71) / 29;
  return { h: 0, s: 70 + t * 24, l: 50 - t * 12 };
}

export function getFrequencyColors(freq) {
  const { h, s, l } = getFrequencyHsl(freq);
  const main = `hsl(${h} ${s}% ${l}%)`;
  const soft = `hsl(${h} ${s}% ${l}% / 0.16)`;
  const track = `hsl(${h} ${s}% ${l}% / 0.22)`;

  return { main, soft, track };
}

export function getFrequencyBadgeStyle(freq) {
  const { main, soft } = getFrequencyColors(freq);
  return { backgroundColor: soft, color: main };
}

export function getFrequencyTextStyle(freq) {
  return { color: getFrequencyColors(freq).main };
}

export function getFrequencySliderStyle(freq) {
  const { main, track } = getFrequencyColors(freq);
  return {
    "--freq-slider-range": main,
    "--freq-slider-track": track,
    "--freq-slider-thumb": main,
  };
}
