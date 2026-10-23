import MathText from "@/components/MathText";

function splitPreservingDisplayMath(text) {
  const raw = String(text ?? "");
  const chunks = [];
  const re = /\$\$[\s\S]+?\$\$/g;
  let last = 0;
  let match;
  while ((match = re.exec(raw)) !== null) {
    if (match.index > last) {
      chunks.push({ type: "text", value: raw.slice(last, match.index) });
    }
    chunks.push({ type: "math", value: match[0] });
    last = match.index + match[0].length;
  }
  if (last < raw.length) {
    chunks.push({ type: "text", value: raw.slice(last) });
  }
  return chunks;
}

function renderInlineMarkdown(text, keyPrefix) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold">
          <MathText text={part.slice(2, -2)} className="math-text-ui--flow" />
        </strong>
      );
    }
    return (
      <MathText
        key={`${keyPrefix}-t-${i}`}
        text={part}
        className="math-text-ui--flow"
      />
    );
  });
}

export default function CkeSolutionText({ text, className = "" }) {
  const raw = String(text ?? "").trim();
  if (!raw) return null;

  const chunks = splitPreservingDisplayMath(raw);
  const nodes = [];

  chunks.forEach((chunk, chunkIdx) => {
    if (chunk.type === "math") {
      nodes.push(
        <div key={`m-${chunkIdx}`} className="overflow-x-auto py-1">
          <MathText text={chunk.value} className="math-text-ui--flow" />
        </div>,
      );
      return;
    }

    const lines = chunk.value.split("\n");
    lines.forEach((line, lineIdx) => {
      if (line.trim() === "") {
        nodes.push(<div key={`g-${chunkIdx}-${lineIdx}`} className="h-2" />);
        return;
      }
      nodes.push(
        <p key={`l-${chunkIdx}-${lineIdx}`} className="leading-relaxed">
          {renderInlineMarkdown(line, `${chunkIdx}-${lineIdx}`)}
        </p>,
      );
    });
  });

  return (
    <div
      className={`space-y-1 text-sm text-slate-800 dark:text-slate-200 ${className}`}
    >
      {nodes}
    </div>
  );
}
