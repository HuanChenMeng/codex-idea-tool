# CLIProxyAPI Usage Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Read and reset Codex quota for CLIProxyAPI-managed OAuth accounts without requiring a local Codex runtime.

**Architecture:** The Tauri backend will call the documented CLIProxyAPI Management API using a user-supplied URL and management key, enumerate Codex auth records, and route usage and reset-credit requests through its authenticated upstream-call endpoint. The frontend keeps the key in memory, presents proxy results as the preferred source, and falls back to the existing local Codex adapter when the proxy cannot be reached.

**Tech Stack:** Tauri 2, Rust, reqwest blocking client, React, TypeScript.

---

### Task 1: Model and parse CLIProxyAPI responses

**Files:**
- Modify: `src-tauri/src/lib.rs`
- Test: `src-tauri/src/lib.rs`

**Step 1: Write failing tests**

Add fixtures for a `wham/usage` response and a reset-credit response, then assert the existing UI usage model exposes remaining percentages, reset times, plan type, and count of available credits.

**Step 2: Run the Rust tests to verify failure**

Run: `cargo test --manifest-path src-tauri/Cargo.toml`

Expected: FAIL until proxy usage parsing exists.

**Step 3: Implement the minimal parser**

Add tolerant JSON readers for CLIProxyAPI auth records and the two Codex upstream response bodies. Do not deserialize or log any OAuth tokens.

**Step 4: Run the Rust tests**

Run: `cargo test --manifest-path src-tauri/Cargo.toml`

Expected: PASS.

### Task 2: Add proxy usage and reset commands

**Files:**
- Modify: `src-tauri/src/lib.rs`

**Step 1: Add CLIProxyAPI request helper**

Validate an HTTP(S) management URL, use the management key only in the Authorization header, impose a request timeout, and return concise status errors with no response-body or secret echoing.

**Step 2: Implement preferred proxy loading with local fallback**

Call `GET /v0/management/auth-files`, restrict records to Codex, then call `POST /v0/management/api-call` for the official usage and reset-credit endpoints per `auth_index`. Return proxy profiles on success; fall back to the local app-server adapter only when the proxy path is unavailable.

**Step 3: Implement proxy reset**

Re-read reset credits, consume one available credit through the selected proxy credential, then call the documented CLIProxyAPI `/reset-quota` endpoint to clear the routing cooldown. Preserve the existing confirmation in the renderer.

**Step 4: Run tests**

Run: `cargo test --manifest-path src-tauri/Cargo.toml`

Expected: PASS.

### Task 3: Make proxy configuration usable on the home screen

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Step 1: Add in-memory proxy configuration controls**

Add URL and masked management-key inputs in the quota section. Do not use localStorage or write the key to a project/app data file.

**Step 2: Wire refresh and reset requests**

Pass proxy configuration only for the active command. Show the result origin on each quota card, and require an entered key before querying the proxy.

**Step 3: Update explanatory copy**

State that CLIProxyAPI is preferred when configured, local Codex is a fallback, and credentials are never displayed or logged.

### Task 4: Verify and package

**Files:**
- Verify: `src-tauri/src/lib.rs`
- Verify: `src/App.tsx`
- Verify: `src/App.css`

**Step 1: Run frontend checks**

Run: `E:\everyday\nvm\v22.22.3\npm.cmd run lint` and `E:\everyday\nvm\v22.22.3\npm.cmd run build`

**Step 2: Run Rust tests and diff check**

Run: `cargo test --manifest-path src-tauri/Cargo.toml` and `git diff --check`

**Step 3: Build the Windows package**

Run Tauri with the configured nvm Node and MSVC build environment, producing a fresh Windows executable and MSI.
