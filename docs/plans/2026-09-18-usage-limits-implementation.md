# Usage Limits Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show Codex five-hour and weekly remaining usage for default and managed OpenAI profiles, and safely redeem an available reset credit.

**Architecture:** The Rust backend starts the locally installed official Codex app-server with the selected `CODEX_HOME`, sends JSON-RPC initialization and rate-limit requests, and returns a redacted view model to the Tauri UI. Reset performs a fresh limit read, verifies a credit remains, and submits one idempotent consume request.

**Tech Stack:** Tauri 2, Rust standard process/IO APIs, serde_json, React, TypeScript.

---

### Task 1: Add protocol adapter and tests

**Files:**
- Modify: `src-tauri/src/lib.rs`

**Step 1:** Add a parsing test for primary/secondary windows and reset-credit count.

**Step 2:** Implement a bounded JSON-RPC app-server adapter that never logs auth tokens or credit identifiers.

**Step 3:** Add Tauri commands to read all logged-in profiles and consume exactly one verified reset credit.

**Step 4:** Run `cargo test` and verify all tests pass.

### Task 2: Add the home-screen usage panel

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Step 1:** Add UI types and a manual refresh action for usage results.

**Step 2:** Render default and independent-profile usage with remaining percentages, reset timestamps, and available reset-credit count.

**Step 3:** Require a browser confirmation before invoking reset, then refresh results.

**Step 4:** Run the front-end build and lint checks.

### Task 3: Verify release build

**Files:**
- Modify: none

**Step 1:** Run Rust tests, `npm run lint`, and `npm run build` with the nvm-managed Node 22.22.3 runtime.

**Step 2:** Build the Tauri executable and confirm its timestamp.
