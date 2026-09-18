# Running IDEA Profile Implementation Plan

**Goal:** Show which Codex profile a currently running IDEA instance is using.

**Architecture:** Persist the process ID and selected profile whenever this tool starts IDEA. The desktop UI refreshes a status value from the Tauri backend. For a normally started IDEA, identify the default Codex authentication file and compare its stable account identifier with the locally managed account profiles; unknown custom launch environments remain explicitly unverified.

**Tech Stack:** React, TypeScript, Tauri 2, Rust, Windows ToolHelp process APIs.

---

### Task 1: Represent runtime identity

**Files:**
- Modify: `src-tauri/src/lib.rs`

1. Add serializable runtime status and persisted launch-record types.
2. Save the launched IDEA process ID, launch timestamp, and selected profile after `Command::spawn` succeeds.
3. Report an active managed launch only while the recorded PID is alive.

### Task 2: Identify default authentication

**Files:**
- Modify: `src-tauri/src/lib.rs`

1. Read the default `CODEX_HOME` authentication file for a normally launched IDEA.
2. Extract a non-secret account identifier from authentication JSON.
3. Match it against the saved account profiles and report an explicit unverified state when it cannot be matched.

### Task 3: Present status

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.css`

1. Add current IDEA runtime status to the app-data contract.
2. Render a compact status panel above the launch selector.
3. Refresh it with the existing polling interval and distinguish managed, default, unavailable, and stopped states.

### Task 4: Verify

**Files:**
- Modify: `src-tauri/src/lib.rs`

1. Add unit tests for account identifier extraction and managed launch record handling.
2. Run `npm run build`, `npm run lint`, and `npx tauri build` from the MSVC environment.
