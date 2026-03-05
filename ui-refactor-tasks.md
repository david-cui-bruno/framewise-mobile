# UI Refactor Tasks

Tasks to align the current app with the Framewise UI Design Guide. Organized by area. Each task is independent unless noted.

---

## Foundation

### F1. Create shared `ScreenHeader` component
Currently every detail screen duplicates the back-button + centered-title pattern inline (with a `mr-10` offset hack). Create a reusable `ScreenHeader` with slots for left action (back button), centered title, and optional right action. Use across all stack screens.

### F2. Add `GradientHeader` to all main screens
The `GradientHeader` component exists but is only used inside `FeaturedTaskCard`. Per the design doc, it should appear at the top of Home, Diary, Chat, Profile, and all secondary screens. Each screen has variant content inside the gradient:
- **Home:** avatar + patient name + pathway name
- **Diary:** date navigation (prev/next chevrons + date label + "Today" chip)
- **Chat:** care team physician chip (if assigned)
- **Profile:** avatar + display name centered below title

### F3. Rebuild the tab bar as pill-style `BottomTabBar`
Current tab bar is the default Expo `Tabs` with inline styles. Design doc specifies a custom pill-style tab bar where the active tab is a blue pill with white icon + label, and inactive tabs are just icons. Replace the `screenOptions.tabBarStyle` with a custom `tabBar` render function or custom component.

### F4. Add press feedback animations
Design doc specifies all `Pressable` elements should scale to 0.98 on press (90–120ms, ease-out). Add a shared `AnimatedPressable` wrapper using `react-native-reanimated` that applies this, and use it in PrimaryButton, SecondaryButton, Chip, cards, etc.

### F5. Add screen transition animations
- Tab switch: fade + translateY (–8px → 0) in 200ms
- Push navigation: standard iOS slide (already default)
- Mood selection: emoji scale bounce (1.0 → 1.2 → 1.0, 200ms)
- Task completion: checkbox fill with brief success green flash
- Onboarding step transition: horizontal slide between steps

---

## Home Screen

### H1. Replace `ProgressRing` + `ProgressStrip` with two `MetricCard`s
Current home screen shows a large SVG ring and a separate progress strip (redundant data). Design doc replaces both with a two-up `MetricCard` row:
- Left card: "Day" · "5 of 30" · info accent
- Right card: "Tasks Done" · "3/5" · primary accent

### H2. Replace `FeaturedTaskCard` with `TaskCard`
Current: gradient background card with "UP NEXT" badge. Design doc: white card with colored left border accent (`primary` for video, `violet` for quiz), type label ("Video" / "Quiz"), title, optional duration, chevron.

### H3. Redesign medication section with `MedicationRow`
Current: each medication is a `MedicationCard` component with pill icon, name, dosage, and optional video play button. Design doc: `MedicationRow` with `cardTitle` name, `caption` dosage/instructions, and an optional "Video" chip link. Group by time-of-day with `Chip` filters (Morning / Afternoon / Evening) instead of uppercase text labels.

### H4. Style section headings consistently
Current: bare `Text text-lg font-bold`. Design doc: `sectionTitle` variant (14px/600) with consistent spacing. Apply `AppText variant="sectionTitle"` to all section labels (Medications, Today's Tasks, All Videos, etc.).

### H5. Restyle "Today's Tasks" checklist
Currently uses plain checkbox circles. Design doc doesn't change the checklist concept but the card container and text styles should use the design system tokens (`cardTitle` for task name, `caption` for metadata).

### H6. Add `DailyTipCard` design doc styling
Current: `primary-50` background with `primary-200` border. Design doc: `bg-surface-muted`, `border-info`, `rounded-card`, with `info` icon + `sectionTitle` "Today's Tip" + `body` text.

### H7. Move TopBar content into `GradientHeader`
Current `TopBar` is a flat white bar. Fold its content (avatar + name + pathway) into the `GradientHeader` from F2. Remove the standalone `TopBar` component or repurpose it as the gradient header's inner content.

---

## Diary Screen

### D1. Move date navigator into `GradientHeader`
Current: plain text "Diary" header + separate `DateNavigator` below. Design doc: the gradient header itself contains the date navigation (prev/next chevrons + date label inline).

### D2. Redesign `MoodSelector` as bordered cards
Current `EmojiRating`: emoji in circles (`primary-100` selected, `neutral-100` unselected). Design doc: each mood is a bordered card (`rounded-card p-3 border`) with emoji + label below. Selected: `bg-sky-50 border-primary`. Unselected: `bg-surface border-border`.

### D3. Restyle `SymptomCheckInCard` with `MetricCard` for completed state
Current completed state: green `success-50` badge with "Severity score: X/10". Design doc: use a `MetricCard` showing the score with colored accent (success/warning/danger based on severity).

### D4. Redesign `MedicationAdherenceList` with `MedicationRow`
Current: pill icon + name + three action buttons (Taken/Skip/Issue) with solid/tinted backgrounds. Design doc: `MedicationRow` component with `chip`-styled adherence buttons (`rounded-chip`, selected = colored border + 20% opacity background).

### D5. Restyle `JournalCard` entry area
Current: pressable card with pencil icon + chevron. Design doc: `rounded-card border-border bg-surface` with italic placeholder when empty and preview text + "Edit" chip when entry exists.

---

## Chat / Q&A Screen

### C1. Add `GradientHeader` with care team chip
Current: plain centered "Q&A" text + bookmark icon. Design doc: `GradientHeader` containing the title and, if a physician is assigned, a care team chip (name + specialty + phone icon).

### C2. Redesign `ChatBubble` with assistant avatar
Current `ChatMessage`: user bubble is right-aligned primary, assistant is left-aligned white. Design doc adds: assistant messages get a small avatar (32px circle, `bg-sky-200`, with Framewise logo mark or initials). Also: user bubble gets `rounded-br-control` (less rounded bottom-right corner), assistant gets `rounded-bl-control`.

### C3. Restyle suggestion chips as 2x2 grid
Current: horizontal `ScrollView` of chips. Design doc: 2×2 grid layout (not scrollable) centered in the empty state.

### C4. Redesign `ChatInput` with `SearchInput` pattern
Current: multiline `TextInput` in `neutral-100` background + circular send button. Design doc: `SearchInput`-style input (`rounded-control bg-surface border border-border`) + square send `PrimaryButton` (`rounded-control`).

### C5. Restyle `RiskBanner`
Current: uses `warning-50`/`error-50` backgrounds with text. Design doc: adds `AlertTriangle` icon, uses `bg-danger/10 border-danger` or `bg-warning/10 border-warning` with `cardTitle` + `caption` text hierarchy. Urgent banner gets a red "Call 911" `PrimaryButton` styled with `bg-danger`.

---

## Profile Screen

### P1. Add `GradientHeader` with avatar + name
Current: plain text "Profile" header + avatar/name block below. Design doc: avatar and display name are centered inside the `GradientHeader`, with email below.

### P2. Add care pathway progress bar
Current: card shows pathway name + "Day X of Y" text. Design doc adds a linear progress bar below the text.

### P3. Redesign care team section as `DoctorCard`
Current: `CareTeamCard` with doctor icon + name + specialty + phone link. Design doc: `DoctorCard` with 64px avatar area, `cardTitle` name, specialty + practice in `caption`, and a `SecondaryButton` "Call" with phone icon.

### P4. Restyle emergency contacts section
Current: inline list with edit/delete icon buttons. Design doc: each contact is a row with name, relationship `Chip`, phone, and optional "Primary" badge. "Manage Contacts →" link in `primary` color at the bottom instead of "Manage" in the section header.

### P5. Restyle sign out button
Current: `bg-error-50 rounded-2xl py-4` full-width. Design doc: `SecondaryButton` with `text-danger` color (not a filled red button).

---

## Auth Screens

### A1. Add `GradientHeader` to login screen
Current: no header, centered form. Design doc: `GradientHeader` at top with app name only, then centered content below.

### A2. Redesign login form layout
Current: emoji in circle + title + input + buttons. Design doc: Framewise "F" monogram (64px, `rounded-2xl`, `bg-surface`, `shadowMd`) as logo, `sectionTitle` "Welcome back", `body` instructions, `TextInput` with `rounded-control border-border`, error state shows `border-danger` on input + caption error message.

### A3. Redesign verify screen
Current: emoji icon + title + description + custom back `Pressable`. Design doc: envelope icon with `info` color tint, "Resend Email" `SecondaryButton` with 60s countdown, "Use a different email" `SecondaryButton`.

### A4. Add `GradientHeader` to onboarding
Current: no header, just `StepIndicator` dots. Design doc: `GradientHeader` at top (consistent with all screens), step dots below.

---

## Detail Screens

### S1. Add `GradientHeader` to video player
Current: plain white header with circular back button + centered title. Design doc: `GradientHeader` with back button and title inside the gradient.

### S2. Add `GradientHeader` to quiz screen
Same as S1. Replace the plain white header.

### S3. Redesign quiz results with design doc layout
Current: emoji in circle + score + pass/fail message + inline `Pressable` "Done" button. Design doc: large emoji, `metricValueLg` score, `sectionTitle` pass/fail message, `PrimaryButton` "Done".

### S4. Redesign quiz "Done" button
Current quiz results "Done" button is an inline `Pressable` with `bg-primary-500 rounded-full py-4 px-12`. Replace with `PrimaryButton` component.

### S5. Add `GradientHeader` to saved answers screen
Replace plain white header with `GradientHeader` containing back button + "Saved Answers" title.

### S6. Add `GradientHeader` to journal screen
Replace plain white header. Keep "Save" action in the right slot of the gradient header.

### S7. Add `GradientHeader` to symptom check-in
Replace plain white header. Keep progress indicator below the gradient.

### S8. Add `GradientHeader` to notification preferences
Replace plain white header.

### S9. Add `GradientHeader` to emergency contacts
Replace plain white header.

### S10. Redesign emergency contacts form
Current: inline bottom sheet with `bg-neutral-0 border-t`. Design doc: modal sheet that slides up from bottom (240ms, easing). Fields use `rounded-control border-border` inputs. Relationship picker uses `Chip` components. Action buttons use `PrimaryButton` + `SecondaryButton`.

### S11. Replace `TimePicker` with proper time picker
Current: tap-to-cycle through 24 hourly values. Design doc mentions a scroll picker. Consider using a native time picker or at minimum a scroll-based selector.

---

## Typography & Spacing

### T1. Apply `AppText` variants throughout
Replace bare `Text` components with `AppText` using the correct variant:
- Screen titles in gradient → `navTitle`
- Section labels → `sectionTitle`
- Card headers → `cardTitle`
- Body text → `body`
- Metadata/timestamps → `caption`
- Chip labels → `chip`
- Button labels → `button` / `buttonSecondary`

### T2. Normalize spacing to 8px grid
Audit all screens for non-standard spacing. Ensure:
- Screen edge insets: `px-4` (16px)
- Card padding: `p-4` or `px-4 py-3`
- Between sections: `gap-4` (16px)
- Within card list rows: `gap-3` (12px)
- Chip groups: `gap-2` (8px)
- Bottom safe area: `pb-6` minimum on scroll views

---

## Accessibility

### X1. Ensure 44px minimum touch targets
Audit all tappable elements. The design doc specifies `h-11 w-11` minimum. Mood emojis: `h-16 w-16`. Tab bar icons: `h-10 w-10` minimum hit area.

### X2. Add `accessibilityLabel` to all interactive elements
- Mood emojis: label should say "Great mood" not just the emoji character
- Video progress: `accessibilityValue={{ now, min: 0, max: 100 }}`
- Risk banners: `accessibilityLiveRegion="assertive"`

---

## Future / Optional

### O1. Dark mode support
Design doc includes full dark mode color overrides. Not required for initial refactor but the token structure should support it. Consider adding a `useColorScheme()` wrapper that swaps the color object.

### O2. Micro-interactions polish
After core layout work is done:
- Medication adherence tap: immediate 90ms color fill
- Video progress bar: smooth animation during playback
- Onboarding horizontal slide between steps (180ms)
