import mammoth from "mammoth";
import { Question, Exam } from "../types";
import { enrichQuestionFormulas, validateQuestionFormulas } from "./math";

export interface BulkImportDefaults {
  subject?: string;
  chapter?: string;
}

export interface ParseResult {
  questions: Question[];
  fullExams?: Exam[];
  warnings: string[];
  method: "local" | "ocr_ai";
  rawTextForAiFallback?: string;
}

export const BANGLA_OPTION_MAP: Record<string, number> = {
  ক: 0,
  খ: 1,
  গ: 2,
  ঘ: 3,
  ঙ: 4,
  চ: 5,
  ছ: 6,
  জ: 7,
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
};

export function parseAnswerIndex(raw: unknown, optionCount: number): number {
  if (typeof raw === "number" && Number.isInteger(raw)) {
    if (raw >= 0 && raw < optionCount) return raw;
    if (raw >= 1 && raw <= optionCount) return raw - 1;
    return 0;
  }
  const clean = String(raw || "").trim().replace(/^[([\]]+|[)\].,:]+$/g, "").trim();
  if (!clean) return 0;
  const lower = clean.toLowerCase();
  if (lower in BANGLA_OPTION_MAP) {
    const idx = BANGLA_OPTION_MAP[lower];
    return idx < optionCount ? idx : 0;
  }
  const asciiDigits = clean.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
  const num = Number(asciiDigits);
  if (Number.isInteger(num)) {
    if (num >= 1 && num <= optionCount) return num - 1;
    if (num >= 0 && num < optionCount) return num;
  }
  const firstChar = clean.charAt(0).toLowerCase();
  if (firstChar in BANGLA_OPTION_MAP) {
    const idx = BANGLA_OPTION_MAP[firstChar];
    return idx < optionCount ? idx : 0;
  }
  return 0;
}

export function normalizeDifficulty(raw: unknown): "easy" | "medium" | "hard" {
  const v = String(raw || "").trim().toLowerCase();
  if (v === "easy" || v === "সহজ") return "easy";
  if (v === "hard" || v === "কঠিন") return "hard";
  return "medium";
}

export function makeQuestionId(idx: number | string): string {
  return `q_imp_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`;
}

export function parseCsvRows(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    const next = content[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell.trim());
      cell = "";
    } else if (ch === "\r" && next === "\n") {
      row.push(cell.trim());
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      cell = "";
      i++;
    } else if (ch === "\n" || ch === "\r") {
      row.push(cell.trim());
      if (row.some((c) => c.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some((c) => c.length > 0)) rows.push(row);
  }
  return rows;
}

export function parseCsvQuestions(
  content: string,
  defaults?: BulkImportDefaults
): ParseResult {
  const rows = parseCsvRows(content.replace(/^\uFEFF/, ""));
  const warnings: string[] = [];
  if (rows.length < 2) {
    return {
      questions: [],
      warnings: ["CSV ফাইলে হেডার সারি এবং কমপক্ষে একটি প্রশ্ন সারি থাকা আবশ্যক।"],
      method: "local",
      rawTextForAiFallback: content
    };
  }

  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const findCol = (aliases: string[]) =>
    headers.findIndex((h) => aliases.some((a) => h === a || h.includes(a)));

  const qCol = findCol(["question", "প্রশ্ন", "text", "stem"]);
  const optCols: number[] = [];
  [
    ["option1", "opt1", "option_1", "option a", "a", "ক", "অপশন ১", "অপশন ক"],
    ["option2", "opt2", "option_2", "option b", "b", "খ", "অপশন ২", "অপশন খ"],
    ["option3", "opt3", "option_3", "option c", "c", "গ", "অপশন ৩", "অপশন গ"],
    ["option4", "opt4", "option_4", "option d", "d", "ঘ", "অপশন ৪", "অপশন ঘ"],
    ["option5", "opt5", "option_5", "option e", "e", "ঙ", "অপশন ৫", "অপশন ঙ"],
    ["option6", "opt6", "option_6", "option f", "f", "চ", "অপশন ৬", "অপশন চ"]
  ].forEach((aliases) => {
    const idx = headers.findIndex((h) => aliases.includes(h));
    if (idx !== -1 && !optCols.includes(idx)) optCols.push(idx);
  });

  const ansCol = findCol(["answer", "correct", "ans", "উত্তর", "সঠিক উত্তর"]);
  const expCol = findCol(["explanation", "explain", "ব্যাখ্যা", "সমাধান"]);
  const subCol = findCol(["subject", "বিষয়"]);
  const chapCol = findCol(["chapter", "অধ্যায়"]);
  const topicCol = findCol(["topic", "টপিক"]);
  const diffCol = findCol(["difficulty", "কঠিনতা"]);
  const marksCol = findCol(["marks", "mark", "নম্বর"]);

  const resolvedQCol = qCol !== -1 ? qCol : 0;
  const resolvedOptCols =
    optCols.length >= 2 ? optCols : [1, 2, 3, 4].filter((i) => i < headers.length);

  const questions: Question[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const text = (row[resolvedQCol] || "").trim();
    const options = resolvedOptCols
      .map((ci) => (row[ci] || "").trim())
      .filter((o) => o.length > 0);

    if (!text || options.length < 2) {
      warnings.push(`সারি ${r + 1} বাদ পড়েছে (প্রশ্ন বা পর্যাপ্ত অপশন নেই)।`);
      continue;
    }

    const answer = parseAnswerIndex(
      ansCol !== -1 ? row[ansCol] : row[resolvedOptCols[resolvedOptCols.length - 1] + 1],
      options.length
    );
    const marksNum = marksCol !== -1 ? Number(row[marksCol]) : undefined;

    const q = enrichQuestionFormulas({
      id: makeQuestionId(r),
      text,
      questionType: options.length === 2 ? "true_false" : "mcq",
      options,
      answer,
      explanation: expCol !== -1 ? (row[expCol] || "").trim() : "",
      subject: (subCol !== -1 ? row[subCol] : "") || defaults?.subject || undefined,
      chapter: (chapCol !== -1 ? row[chapCol] : "") || defaults?.chapter || undefined,
      topic: topicCol !== -1 ? (row[topicCol] || "").trim() || undefined : undefined,
      difficulty: normalizeDifficulty(diffCol !== -1 ? row[diffCol] : undefined),
      marks: marksNum && !Number.isNaN(marksNum) && marksNum > 0 ? marksNum : undefined
    });

    const formulaErrs = validateQuestionFormulas(q);
    if (formulaErrs.length > 0) {
      warnings.push(
        `প্রশ্ন #${questions.length + 1}-এ LaTeX সিনট্যাক্স সতর্কতা: ${formulaErrs[0]}`
      );
    }
    questions.push(q);
  }

  return {
    questions,
    warnings,
    method: "local",
    rawTextForAiFallback: content
  };
}

export function parseTextQuestions(
  rawText: string,
  defaults?: BulkImportDefaults
): ParseResult {
  const warnings: string[] = [];
  const lines = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const questions: Question[] = [];

  interface DraftQ {
    textLines: string[];
    options: string[];
    explanationLines: string[];
    section: "stem" | "option" | "explanation";
    answerRaw?: string;
  }

  let current: DraftQ | null = null;

  const flush = () => {
    if (!current) return;
    const text = current.textLines.join("\n").trim();
    const options = current.options.map((o) => o.trim()).filter(Boolean);
    if (text && options.length >= 2) {
      const q = enrichQuestionFormulas({
        id: makeQuestionId(questions.length),
        text,
        questionType: options.length === 2 ? "true_false" : "mcq",
        options,
        answer: parseAnswerIndex(current.answerRaw, options.length),
        explanation: current.explanationLines.join("\n").trim(),
        subject: defaults?.subject || undefined,
        chapter: defaults?.chapter || undefined,
        difficulty: "medium"
      });
      const errs = validateQuestionFormulas(q);
      if (errs.length > 0) {
        warnings.push(`প্রশ্ন #${questions.length + 1}-এ ফর্মুলা সতর্কতা: ${errs[0]}`);
      }
      questions.push(q);
    }
    current = null;
  };

  const qStartRegex =
    /^(?:Q\s*\.?\s*\d+|প্রশ্ন\s*[-#:]?\s*[\d০-৯]+|[\d০-৯]+\s*[.)।:])\s*(.+)$/i;
  const optRegex = /^(?:[([*]?\s*([কখগঘঙচছজA-Ha-h])\s*[).:\]]\s+)(.+)$/;
  const ansRegex =
    /^(?:Answer|Ans|Correct\s*Answer|উত্তর|সঠিক\s*উত্তর)\s*[:ঃ-]\s*(.+)$/i;
  const expRegex =
    /^(?:Explanation|Explain|Solution|ব্যাখ্যা|সমাধান)\s*[:ঃ-]\s*(.*)$/i;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const ansMatch = line.match(ansRegex);
    if (ansMatch && current) {
      current.answerRaw = ansMatch[1].trim();
      current.section = "explanation";
      continue;
    }

    const expMatch = line.match(expRegex);
    if (expMatch && current) {
      if (expMatch[1]?.trim()) {
        current.explanationLines.push(expMatch[1].trim());
      }
      current.section = "explanation";
      continue;
    }

    const optMatch = line.match(optRegex);
    if (optMatch && current) {
      let optText = optMatch[2].trim();
      if (/^\*/.test(line) || /\(\*\)$|✓|✔/.test(optText)) {
        optText = optText.replace(/\(\*\)|✓|✔/g, "").trim();
        current.answerRaw = optMatch[1];
      }
      current.options.push(optText);
      current.section = "option";
      continue;
    }

    const qMatch = line.match(qStartRegex);
    if (qMatch && (!current || current.options.length >= 2)) {
      flush();
      current = {
        textLines: [qMatch[1].trim()],
        options: [],
        explanationLines: [],
        section: "stem"
      };
      continue;
    }

    if (!current) {
      current = {
        textLines: [line],
        options: [],
        explanationLines: [],
        section: "stem"
      };
    } else if (current.section === "stem") {
      current.textLines.push(line);
    } else if (current.section === "option" && current.options.length > 0) {
      current.options[current.options.length - 1] += " " + line;
    } else if (current.section === "explanation") {
      current.explanationLines.push(line);
    }
  }

  flush();
  if (questions.length === 0) {
    warnings.push("স্ট্যান্ডার্ড টেক্সট ফরম্যাটে প্রশ্ন শনাক্ত হয়নি।");
  }

  return {
    questions,
    warnings,
    method: "local",
    rawTextForAiFallback: rawText
  };
}

export function parseHtmlQuestions(
  htmlString: string,
  defaults?: BulkImportDefaults
): ParseResult {
  if (typeof window === "undefined") {
    return { questions: [], warnings: [], method: "local" };
  }
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  doc
    .querySelectorAll("script:not([type^=\"math/tex\"]), style, noscript, iframe")
    .forEach((el) => el.remove());

  doc.querySelectorAll(".katex-display, .katex").forEach((katexEl) => {
    const ann = katexEl.querySelector('annotation[encoding="application/x-tex"]');
    if (ann && ann.textContent) {
      const isDisplay = katexEl.classList.contains("katex-display");
      const latex = ann.textContent.trim();
      const marker = doc.createTextNode(isDisplay ? `$$${latex}$$` : `$${latex}$`);
      katexEl.replaceWith(marker);
    }
  });

  doc.querySelectorAll('script[type^="math/tex"]').forEach((scriptEl) => {
    const latex = (scriptEl.textContent || "").trim();
    if (!latex) return;
    const isDisplay = (scriptEl.getAttribute("type") || "").includes("display");
    scriptEl.replaceWith(doc.createTextNode(isDisplay ? `$$${latex}$$` : `$${latex}$`));
  });

  doc.querySelectorAll("sup").forEach((sup) => {
    const val = (sup.textContent || "").trim();
    if (val) sup.replaceWith(doc.createTextNode(`^{${val}}`));
  });

  doc.querySelectorAll("sub").forEach((sub) => {
    const val = (sub.textContent || "").trim();
    if (val) sub.replaceWith(doc.createTextNode(`_{${val}}`));
  });

  doc.querySelectorAll("p, div, li, tr, br, h1, h2, h3, h4, h5, h6").forEach((el) => {
    if (el.tagName === "BR") {
      el.replaceWith(doc.createTextNode("\n"));
    } else {
      el.appendChild(doc.createTextNode("\n"));
    }
  });

  return parseTextQuestions(
    (doc.body?.textContent || "").replace(/\n{3,}/g, "\n\n").trim(),
    defaults
  );
}

export function parseJsonQuestions(
  jsonText: string,
  defaults?: BulkImportDefaults
): ParseResult {
  const warnings: string[] = [];
  try {
    const parsed = JSON.parse(jsonText);
    const items = Array.isArray(parsed) ? parsed : [parsed];
    const fullExams: Exam[] = [];
    const questions: Question[] = [];

    for (const item of items) {
      if (!item || typeof item !== "object") continue;

      if (Array.isArray(item.questions)) {
        const normalizedQs = item.questions
          .map((q: any, idx: number) => {
            const text = String(q?.text || q?.question || "").trim();
            const options = Array.isArray(q?.options)
              ? q.options.map((o: any) => String(o ?? "").trim()).filter(Boolean)
              : [];
            if (!text || options.length < 2) return null;
            return enrichQuestionFormulas({
              id: String(q?.id || makeQuestionId(idx)),
              text,
              questionType:
                q?.questionType === "true_false" || options.length === 2
                  ? "true_false"
                  : "mcq",
              options,
              answer: parseAnswerIndex(q?.answer, options.length),
              explanation: String(q?.explanation || "").trim(),
              subject: q?.subject || item.subject || defaults?.subject || undefined,
              chapter: q?.chapter || item.chapter || defaults?.chapter || undefined,
              topic: q?.topic || undefined,
              difficulty: normalizeDifficulty(q?.difficulty),
              questionImages: Array.isArray(q?.images)
                ? q.images.filter((s: any) => typeof s === "string")
                : undefined,
              marks: typeof q?.marks === "number" && q.marks > 0 ? q.marks : undefined
            });
          })
          .filter(Boolean) as Question[];

        if (normalizedQs.length > 0) {
          questions.push(...normalizedQs);
          if (item.id && item.name) {
            fullExams.push({
              ...item,
              questions: normalizedQs
            });
          }
        }
        continue;
      }

      const text = String(item.text || item.question || "").trim();
      const options = Array.isArray(item.options)
        ? item.options.map((o: any) => String(o ?? "").trim()).filter(Boolean)
        : [];
      if (text && options.length >= 2) {
        questions.push(
          enrichQuestionFormulas({
            id: String(item.id || makeQuestionId(questions.length)),
            text,
            questionType:
              item.questionType === "true_false" || options.length === 2
                ? "true_false"
                : "mcq",
            options,
            answer: parseAnswerIndex(item.answer, options.length),
            explanation: String(item.explanation || "").trim(),
            subject: item.subject || defaults?.subject || undefined,
            chapter: item.chapter || defaults?.chapter || undefined,
            topic: item.topic || undefined,
            difficulty: normalizeDifficulty(item.difficulty),
            questionImages: Array.isArray(item.images)
              ? item.images.filter((s: any) => typeof s === "string")
              : undefined,
            marks:
              typeof item.marks === "number" && item.marks > 0
                ? item.marks
                : undefined
          })
        );
      }
    }

    if (questions.length === 0) {
      warnings.push("JSON ফাইলে বৈধ কোনো প্রশ্ন বা পরীক্ষা পাওয়া যায়নি।");
    }

    return {
      questions,
      fullExams: fullExams.length > 0 ? fullExams : undefined,
      warnings,
      method: "local"
    };
  } catch (err: unknown) {
    return {
      questions: [],
      warnings: ["JSON পার্সিং ব্যর্থ হয়েছে: " + (err instanceof Error ? err.message : String(err))],
      method: "local"
    };
  }
}

export async function parseBulkImportFile(
  file: File,
  defaults?: BulkImportDefaults
): Promise<ParseResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";

  if (ext === "json" || file.type === "application/json") {
    return parseJsonQuestions(await file.text(), defaults);
  }
  if (ext === "csv" || file.type === "text/csv") {
    return parseCsvQuestions(await file.text(), defaults);
  }
  if (ext === "html" || ext === "htm" || file.type === "text/html") {
    return parseHtmlQuestions(await file.text(), defaults);
  }
  if (ext === "txt" || file.type === "text/plain") {
    return parseTextQuestions(await file.text(), defaults);
  }
  if (
    ext === "docx" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const arrayBuffer = await file.arrayBuffer();
    const htmlRes = await mammoth.convertToHtml({ arrayBuffer });
    const rawRes = await mammoth.extractRawText({ arrayBuffer });
    const parsedHtml = parseHtmlQuestions(htmlRes.value || "", defaults);
    if (parsedHtml.questions.length > 0) {
      return {
        ...parsedHtml,
        rawTextForAiFallback: rawRes.value || htmlRes.value
      };
    }
    return {
      ...parseTextQuestions(rawRes.value || "", defaults),
      rawTextForAiFallback: rawRes.value || htmlRes.value
    };
  }

  throw new Error(
    `সমর্থিত নয় এমন ফাইল ফরম্যাট (.${ext})। DOCX, CSV, TXT, JSON, HTML ফাইল ব্যবহার করুন।`
  );
}
