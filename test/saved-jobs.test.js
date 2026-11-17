import { test } from "node:test";
import assert from "node:assert/strict";
import {
  loadSavedJobs,
  saveJob,
  removeSavedJob
} from "../lib/saved-jobs.js";

test("should load saved job IDs", async () => {
  const savedJobs = await loadSavedJobs();

  assert.ok(Array.isArray(savedJobs));
});

test("should save a job ID", async () => {
  await saveJob("j1");

  const savedJobs = await loadSavedJobs();

  assert.ok(savedJobs.includes("j1"));
});

test("should not save duplicate job IDs", async () => {
  await saveJob("j1");
  await saveJob("j1");

  const savedJobs = await loadSavedJobs();

  assert.equal(savedJobs.filter((id) => id === "j1").length, 1);
});

test("should remove a saved job ID", async () => {
  await saveJob("j1");
  await removeSavedJob("j1");

  const savedJobs = await loadSavedJobs();

  assert.ok(!savedJobs.includes("j1"));
});

test("should handle removing a job ID that does not exist", async () => {
  await saveJob("j1");
  await removeSavedJob("j999");

  const savedJobs = await loadSavedJobs();

  assert.ok(savedJobs.includes("j1"));
});