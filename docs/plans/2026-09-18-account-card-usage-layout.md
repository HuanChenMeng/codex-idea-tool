# Account Card Usage Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show each independent OpenAI account's quota, reset credits, refresh action, and reset action inside that account's existing card.

**Architecture:** Reuse the existing quota state and Tauri commands. Remove the standalone account-quota panel, match each quota profile to its account card, and place the bulk refresh beside the add-account command.

**Tech Stack:** React, TypeScript, CSS, Tauri.

---

### Task 1: Compose quota details into account cards

**Files:**
- Modify: `src/App.tsx`

**Step 1:** Remove the standalone `AccountUsage` panel from the account page.

**Step 2:** Pass quota state and quota actions into `Accounts`.

**Step 3:** Match each card's account identifier to its quota profile and render its two quota windows, available reset count, per-account refresh, and reset action beneath the existing account controls.

### Task 2: Adjust account page layout

**Files:**
- Modify: `src/App.css`

**Step 1:** Add a compact action group for the account panel header.

**Step 2:** Style the embedded quota area so long account names cannot affect its controls or overflow the card.

### Task 3: Verify the production renderer

**Files:**
- Test: frontend production build

**Step 1:** Run `E:\everyday\nvm\v22.22.3\npm.cmd run build`.

**Step 2:** Package `Codex-Idea-Tool.exe` with `npx tauri build --no-bundle` and provide the EXE.
