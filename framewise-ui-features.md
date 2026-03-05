# Framewise Health — Functional Requirements

A patient-facing mobile app for healthcare recovery programs. Patients follow a multi-day care pathway consisting of educational videos, quizzes, daily health tracking, and Q&A.

---

## Navigation

4 main tabs: **Home**, **Diary**, **Chat**, **Profile**

Additional screens accessible via navigation:
- Video player
- Quiz
- Symptom check-in
- Journal entry
- Saved answers
- Emergency contacts management
- Notification preferences

---

## Authentication

### Login
- Patient enters their email address
- App sends a magic link (passwordless auth)
- Optional demo mode login for app store reviewers
- **States:** default, loading, error (invalid email / send failure)

### Email Verification
- Confirms the magic link was sent
- Patient taps the link in their email to authenticate
- Deep link brings them back into the app, authenticated

---

## Onboarding (first-time only)

3 sequential steps, must complete all to access the app:

1. **Choose Avatar** — Pick from 8 animal emoji avatars (Lion, Tiger, Bear, Panda, Koala, Fox, Wolf, Monkey). Required before continuing.
2. **Choose Text Size** — Select accessibility preference: Small, Medium, Large, or Extra Large. Each option shows a live preview of how text will look.
3. **Enable Notifications** — Opt in to push notifications for medication reminders and check-ins. Can skip ("Maybe Later").

---

## Home

The patient's daily dashboard. Shows their progress through the care pathway and surfaces the next thing to do.

### What it needs to show:
- **Patient identity** — avatar, name, care pathway name
- **Nudge banner** — contextual prompt when the patient hasn't completed expected actions (e.g., missed mood log, incomplete tasks). Dismissable. Has an action button that navigates to the relevant screen.
- **Day progress** — visual indicator of current day within the total care pathway (e.g., "Day 5 of 30")
- **Task progress** — how many of today's tasks are complete vs total
- **Next task** — prominent card highlighting the next incomplete task (video or quiz). Tapping opens the task.
- **All done state** — when all tasks are complete, replace the next-task card with a congratulatory message and a shortcut to Q&A.
- **Medications list** — grouped by time of day (morning/afternoon/evening). Each shows name, dosage, and instructions. If a medication has a linked educational video, provide a way to watch it.
- **Task checklist** — all of today's tasks with completion status. Each item navigable to its video or quiz.
- **Quick actions** — shortcuts to "Check In" (diary) and "Ask a Question" (chat)
- **Video library** — grid of all videos in the care pathway, showing completion status and duration
- **Daily tip** — rotating health tip (one per day, cycles weekly)

---

## Diary

Daily health tracking organized by date. Patient can navigate to any past date.

### Date Navigation
- Browse by day (previous/next)
- Jump back to today from any past date
- Each date loads its own set of diary entries

### Mood Logging
- Single-tap emoji selection: Very Bad, Bad, Okay, Good, Great
- Saves immediately on tap
- Shows confirmation after logging
- One mood entry per day per date

### Symptom Check-In
- 5-question step-by-step assessment
- Questions cover: Pain, Energy, Sleep, Appetite, Mobility
- Each question has 4 severity options (e.g., No pain / Mild / Moderate / Severe)
- Produces a 0–10 severity score on completion
- Shows the score on the diary card after completion
- **States:** not started (show start button), completed (show score)

### Medication Adherence
- Only shown if patient has prescribed medications
- Per medication: mark as **Taken**, **Skipped**, or **Issue**
- Saves immediately on selection
- One status per medication per date

### Journal
- Free-text daily journal entry
- Full-screen text editor
- Loads existing entry if one exists for the selected date
- Save action in header
- **States:** loading, editing, saving

---

## Chat / Q&A

AI-powered question-and-answer interface. Patient asks health-related questions and gets answers from an embedded knowledge base scoped to their care pathway.

### Core Functionality
- Text input for asking questions
- Results displayed as chat-style message bubbles (user question → assistant answer)
- Answers can contain URLs (tappable links)
- **Bookmark** any answer to save it for later

### Safety Features
- **Risk detection** — when a question contains medically risky keywords:
  - Warning level: show a banner suggesting medical attention
  - Urgent level: show a banner with a direct "Call 911" button
- **Care team contact** — if the patient has an assigned physician, show their name, specialty, and a tap-to-call phone button

### Suggestion Chips
- Shown before the patient has searched anything
- 4 pre-set starter questions relevant to post-surgical recovery
- Tapping a chip submits it as a search

### Empty State
- Shown when a search returns no results
- Displays the query and suggests rephrasing

### Saved Answers
- Separate screen listing all bookmarked Q&A pairs
- Can un-bookmark from this screen
- **Empty state** when no answers are saved yet

---

## Video Player

Plays educational videos assigned to the patient's care pathway.

### Requirements
- Full-width video player with native playback controls
- Respects patient's playback speed preference
- Two content tabs below the video:
  - **Details** — title, duration, description
  - **Transcript** — full text transcript (if available)
- **Progress tracking** — logs play, pause, and completion events. Marks the corresponding task as complete when the video finishes.
- **States:** loading, video not found (with back navigation), playing

---

## Quiz

Multiple-choice knowledge assessments tied to care pathway modules.

### Quiz Flow
- One question at a time with a progress indicator (e.g., "Question 2 of 5")
- Patient selects an option, then submits
- After submission: correct answer highlighted green, wrong answer highlighted red
- Feedback text shown explaining the correct answer
- Advance to next question or see results

### Results
- Score displayed as percentage
- **Pass (≥70%):** success message
- **Fail (<70%):** encouragement message noting the 70% threshold
- "Done" navigates back to home

---

## Profile

Patient account settings and care information.

### What it needs to show:
- **Patient identity** — avatar, display name, email
- **Care pathway info** — pathway name and current day progress
- **Care team** — assigned physician name, specialty, practice, and tap-to-call phone number. Empty state if no team assigned.
- **Emergency contacts** — list of saved contacts with name, relationship, phone, and primary designation. Link to management screen.
- **Accessibility settings** (display only) — current text size and playback speed
- **Notification preferences** — link to notification settings screen
- **Sign out** — logs the patient out and returns to login

### Emergency Contacts Management
- Full CRUD: add, edit, delete contacts
- Fields per contact: name, relationship (Spouse/Parent/Child/Sibling/Friend/Other), phone number, primary contact toggle
- Delete requires confirmation
- Validation: name and phone are required

### Notification Preferences
- 3 toggleable notification types:
  1. **Medication Reminders** — reminders to take medications on time
  2. **Daily Check-in Reminders** — reminders for daily mood check-in
  3. **Engagement Nudges** — prompts when tasks are incomplete
- **Quiet hours** — set a start and end time during which no notifications are sent
- Changes save immediately

---

## Accessibility

- **Text size scaling** — 4 levels (Small, Medium, Large, Extra Large) that scale all body text throughout the app. Set during onboarding, viewable in profile.
- **Playback speed** — video playback speed preference (0.5x–2.0x), applied to all video players.

---

## Key User Journeys

1. **First launch:** Login → Email verification → Onboarding (avatar → text size → notifications) → Home
2. **Daily routine:** Home → Watch next video → Take quiz → Log mood → Check symptoms → Track medications → Journal
3. **Asking a health question:** Chat → Type or tap suggestion → Read answer → Bookmark if useful → View saved answers later
4. **Managing contacts:** Profile → Emergency contacts → Add/edit/delete contacts
5. **Adjusting notifications:** Profile → Notification preferences → Toggle types → Set quiet hours
