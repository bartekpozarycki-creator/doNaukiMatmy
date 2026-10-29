export function NumberLineOpenInterval({
  leftText = "1/3",
  rightText = "3/2",
}) {
  return (
    <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-950/40">
      <svg
        viewBox="0 0 420 90"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={`Oś liczbowa: przedział otwarty od ${leftText} do ${rightText}`}
      >
        <line
          x1="30"
          y1="42"
          x2="390"
          y2="42"
          stroke="currentColor"
          className="text-slate-700 dark:text-slate-300"
          strokeWidth="2.5"
        />
        <polygon
          points="390,42 378,36 378,48"
          className="fill-slate-700 dark:fill-slate-300"
        />
        <line
          x1="130"
          y1="42"
          x2="290"
          y2="42"
          stroke="#0ea5e9"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle
          cx="130"
          cy="42"
          r="9"
          fill="white"
          stroke="#0ea5e9"
          strokeWidth="3"
        />
        <circle
          cx="290"
          cy="42"
          r="9"
          fill="white"
          stroke="#0ea5e9"
          strokeWidth="3"
        />
        <text
          x="130"
          y="72"
          textAnchor="middle"
          className="fill-slate-800 dark:fill-slate-200"
          fontSize="16"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {leftText}
        </text>
        <text
          x="290"
          y="72"
          textAnchor="middle"
          className="fill-slate-800 dark:fill-slate-200"
          fontSize="16"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {rightText}
        </text>
        <text
          x="400"
          y="28"
          textAnchor="middle"
          className="fill-slate-600 dark:fill-slate-400"
          fontSize="14"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          x
        </text>
      </svg>
      <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
        Przedział otwarty ({leftText}, {rightText})
      </p>
    </div>
  );
}

export function ParabolaBelowAxis({
  leftText = "1/3",
  rightText = "3/2",
}) {
  const leftX = 130;
  const rightX = 290;
  const midX = (leftX + rightX) / 2;
  const half = (rightX - leftX) / 2;
  const axisY = 70;
  const scale = 42;

  const points = [];
  for (let i = 0; i <= 48; i += 1) {
    const x = 45 + (i / 48) * 330;
    const u = (x - midX) / half;
    const yMath = u * u - 1;
    const y = axisY - scale * yMath;
    points.push(`${x},${y}`);
  }
  const path = `M ${points.join(" L ")}`;
  const shade = `M ${leftX} ${axisY} Q ${midX} ${axisY + scale} ${rightX} ${axisY} Z`;

  return (
    <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white px-3 py-4 dark:border-slate-700 dark:bg-slate-950/40">
      <svg
        viewBox="0 0 420 140"
        className="mx-auto h-auto w-full max-w-md"
        role="img"
        aria-label={`Wykres paraboli skierowanej w górę z miejscami zerowymi ${leftText} i ${rightText}, wartości ujemne między pierwiastkami`}
      >
        <line
          x1="30"
          y1={axisY}
          x2="390"
          y2={axisY}
          stroke="currentColor"
          className="text-slate-600 dark:text-slate-400"
          strokeWidth="2"
        />
        <line
          x1={midX}
          y1="12"
          x2={midX}
          y2="128"
          stroke="currentColor"
          className="text-slate-600 dark:text-slate-400"
          strokeWidth="2"
        />
        <polygon
          points="390,70 378,64 378,76"
          className="fill-slate-600 dark:fill-slate-400"
        />
        <polygon
          points={`${midX},12 ${midX - 6},24 ${midX + 6},24`}
          className="fill-slate-600 dark:fill-slate-400"
        />
        <path d={shade} fill="#0ea5e933" stroke="none" />
        <path
          d={path}
          fill="none"
          stroke="#0284c7"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={leftX} cy={axisY} r="5" className="fill-sky-600" />
        <circle cx={rightX} cy={axisY} r="5" className="fill-sky-600" />
        <text
          x={leftX}
          y={axisY + 22}
          textAnchor="middle"
          className="fill-slate-800 dark:fill-slate-200"
          fontSize="15"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {leftText}
        </text>
        <text
          x={rightX}
          y={axisY + 22}
          textAnchor="middle"
          className="fill-slate-800 dark:fill-slate-200"
          fontSize="15"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {rightText}
        </text>
        <text
          x="400"
          y={axisY - 12}
          textAnchor="middle"
          className="fill-slate-600 dark:fill-slate-400"
          fontSize="14"
        >
          x
        </text>
        <text
          x={midX + 12}
          y="22"
          className="fill-slate-600 dark:fill-slate-400"
          fontSize="14"
        >
          y
        </text>
      </svg>
      <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
        y = 6x² − 11x + 3 &lt; 0 między pierwiastkami
      </p>
    </div>
  );
}

export function renderCkeDiagram(marker) {
  const raw = String(marker ?? "").trim();
  if (raw === "[[wykres:parabola-zad10]]") {
    return <ParabolaBelowAxis />;
  }
  if (raw === "[[wykres:os-zad10]]") {
    return <NumberLineOpenInterval />;
  }
  return null;
}
