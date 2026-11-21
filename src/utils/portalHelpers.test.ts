import test from "node:test";
import assert from "node:assert/strict";
import {
  computePortalStats,
  getBestScoreByExam,
  getLatestResultIdByExam,
  filterExams,
  getGradeInfo,
  computeLeaderboardRows,
  computePercentile
} from "./portalHelpers";
import { DEFAULT_EXAMS, INITIAL_HISTORY, SEEDED_LEADERBOARD } from "../data/seedData";

test("computePortalStats returns zeroed stats for empty history", () => {
  assert.deepEqual(computePortalStats([]), {
    total: 0,
    avg: 0,
    best: 0,
    mins: 0
  });
});

test("computePortalStats aggregates accuracy, best score, and minutes accurately", () => {
  const stats = computePortalStats(INITIAL_HISTORY);
  assert.equal(stats.total, 2);
  assert.equal(stats.avg, 82);
  assert.equal(stats.best, 83);
  assert.equal(stats.mins, 10);
});

test("getBestScoreByExam and getLatestResultIdByExam resolve highest score and newest attempt", () => {
  const older = {
    ...INITIAL_HISTORY[0],
    id: "res_old",
    examId: "e3",
    score: 4.5,
    dateISO: "2026-10-01T10:00:00Z"
  };
  const newer = {
    ...INITIAL_HISTORY[0],
    id: "res_new",
    examId: "e3",
    score: 3.75,
    dateISO: "2026-11-18T10:00:00Z"
  };

  const bestMap = getBestScoreByExam([older, newer]);
  const latestMap = getLatestResultIdByExam([older, newer]);

  assert.equal(bestMap.get("e3"), 4.5);
  assert.equal(latestMap.get("e3"), "res_new");
});

test("filterExams filters by subject, type, and search query", () => {
  const physicsDrills = filterExams(DEFAULT_EXAMS, {
    subject: "পদার্থবিজ্ঞান",
    type: "drill"
  });
  assert.equal(physicsDrills.length, 1);
  assert.equal(physicsDrills[0].id, "e3");

  const mathSearch = filterExams(DEFAULT_EXAMS, { search: "ম্যাট্রিক্স" });
  assert.equal(mathSearch.length, 1);
  assert.equal(mathSearch[0].id, "e5");
});

test("getGradeInfo classifies accuracy thresholds cleanly", () => {
  assert.equal(getGradeInfo(92).grade, "A+");
  assert.equal(getGradeInfo(75).grade, "A");
  assert.equal(getGradeInfo(60).grade, "B");
  assert.equal(getGradeInfo(40).grade, "C");
});

test("computeLeaderboardRows ranks global and single-exam standings deterministically", () => {
  const globalRows = computeLeaderboardRows(
    "all",
    SEEDED_LEADERBOARD,
    INITIAL_HISTORY,
    "তানভীর আহমেদ"
  );
  assert.ok(globalRows.length >= 10);
  // First row must have highest score
  assert.ok(globalRows[0].score >= globalRows[1].score);
  const currentUserRow = globalRows.find((r) => r.isCurrentUser);
  assert.ok(currentUserRow);
  assert.equal(currentUserRow.score, 8.5);
  assert.equal(currentUserRow.examsCount, 2);

  const e4Rows = computeLeaderboardRows(
    "e4",
    SEEDED_LEADERBOARD,
    INITIAL_HISTORY,
    "তানভীর আহমেদ"
  );
  assert.equal(e4Rows[0].score, 6);
  assert.equal(computePercentile(0, 10), 100);
  assert.equal(computePercentile(4, 10), 60);
});
