import katex from "katex";
import { Question, MathSegment } from "../types";

/**
 * Safely tokenizes mixed Bengali/English text and LaTeX / mhchem math segments.
 * Supports:
 * - Display math: $$...$$ and \[...\]
 * - Inline math: $...$ and \(...\)
 * - Standalone mhchem: \ce{...} even if not wrapped in $
 * Never interprets plain user prose as HTML.
 */
export function tokenizeMathText(input: string): MathSegment[] {
  if (!input) return [];
  const segments: MathSegment[] = [];
  const pattern =
    /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|(?<!\\)\$(?!\$)((?:\\\$|[^$\n])+?)(?<!\\)\$|(\\ce\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\})/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: input.slice(lastIndex, match.index).replace(/\\\$/g, "$")
      });
    }

    if (match[1] !== undefined) {
      segments.push({
        type: "math",
        latex: match[1].trim(),
        displayMode: true
      });
    } else if (match[2] !== undefined) {
      segments.push({
        type: "math",
        latex: match[2].trim(),
        displayMode: true
      });
    } else if (match[3] !== undefined) {
      segments.push({
        type: "math",
        latex: match[3].trim(),
        displayMode: false
      });
    } else if (match[4] !== undefined) {
      const candidate = match[4].trim();
      if (candidate) {
        segments.push({
          type: "math",
          latex: candidate,
          displayMode: false
        });
      } else {
        segments.push({
          type: "text",
          value: match[0]
        });
      }
    } else if (match[5] !== undefined) {
      segments.push({
        type: "math",
        latex: match[5].trim(),
        displayMode: false
      });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({
      type: "text",
      value: input.slice(lastIndex).replace(/\\\$/g, "$")
    });
  }

  return segments;
}

export function renderLatex(
  latex: string,
  displayMode = false
): { html: string; valid: boolean; error?: string } {
  const trimmed = latex.trim();
  if (!trimmed) {
    return { html: "", valid: true };
  }

  let valid = true;
  let error: string | undefined;

  try {
    katex.renderToString(trimmed, {
      displayMode,
      throwOnError: true,
      strict: false,
      trust: false
    });
  } catch (err: unknown) {
    valid = false;
    error = err instanceof Error ? err.message : "Invalid LaTeX syntax";
  }

  return {
    html: katex.renderToString(trimmed, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
      errorColor: "#dc2626"
    }),
    valid,
    error
  };
}

export function extractLatexExpressions(texts: (string | undefined)[]): string[] {
  const found = new Set<string>();
  for (const t of texts) {
    if (!t) continue;
    const segments = tokenizeMathText(t);
    for (const seg of segments) {
      if (seg.type === "math" && seg.latex.trim()) {
        found.add(seg.latex.trim());
      }
    }
  }
  return Array.from(found);
}

export function hasMathSyntax(text?: string): boolean {
  if (!text) return false;
  return tokenizeMathText(text).some((s) => s.type === "math");
}

export function validateQuestionFormulas(q: Question): string[] {
  const expressions = extractLatexExpressions([
    q.text,
    ...(q.options || []),
    q.explanation
  ]);
  const errors: string[] = [];
  for (const expr of expressions) {
    const res = renderLatex(expr, false);
    if (!res.valid) {
      errors.push(`${expr} → ${res.error || "সিনট্যাক্স ত্রুটি"}`);
    }
  }
  return errors;
}

export function enrichQuestionFormulas(q: Question): Question {
  const formulas = extractLatexExpressions([
    q.text,
    ...(q.options || []),
    q.explanation
  ]);
  const existingSource = q.formulaSource?.trim();
  const formulaSource = formulas.length > 0 ? formulas.join("\n") : existingSource || undefined;
  return {
    ...q,
    formulas: formulas.length > 0 ? formulas : undefined,
    formulaSource
  };
}
