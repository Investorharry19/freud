# Screen Implementation Roadmap

The screens below now have local/demo implementations and routes. Interactions such as purchase, real audio playback, device notifications, remote chat, account authentication, voice analysis, and server persistence still require production integrations.

## Priority 1: Complete the core meditation journey

1. **Assessment results and personalized plan**
   - Suggested route: `src/app/assessment-results.tsx`
   - Added a sample starting plan and connected the assessment's voice flow and skip action to results.
   - Assessment answers are not persisted, so the plan is illustrative rather than personalized.

2. **Meditation library**
   - Suggested route: `src/app/meditations/index.tsx`
   - Let users browse and filter by intention, duration, and style; practice details show a sample teacher.
   - Include search, filters, and useful empty states.
   - Explore now links to the practice catalog and featured practice detail.

3. **Meditation detail**
   - Suggested route: `src/app/meditations/[id].tsx`
   - Show a practice's description, duration, instructor or voice, benefits, and format (guided or silent).
   - Provide a clear action to begin the practice.

4. **Meditation player**
   - Suggested route: `src/app/meditations/player.tsx`
   - Provide play/pause, progress seeking, elapsed and remaining time, and end/resume controls.
   - The player has a simulated timer and seek control; audio, background playback, and interruption handling still need production integration.

5. **Session completion**
   - Suggested route: `src/app/meditations/complete.tsx`
   - Confirm the session, collect a short reflection, and record the completed minutes in demo state.
   - Let users save, repeat, or return to their plan.

6. **History and progress**
   - Suggested route: `src/app/progress.tsx`
   - Show completed sessions, current streak, total minutes, and mood check-in counts.
   - Session history and mood entries are in-memory demo data.

## Priority 2: Complete wellbeing and supporting flows

7. **Mood check-in**
   - Suggested route: `src/app/mood/check-in.tsx`
   - Allow users to choose a mood, optionally record intensity or a note, and save the entry.
   - Added a mood history route; entries and notes are held in memory for the current app session.

8. **AI chat**
   - Suggested route: use the existing `src/app/tabs/ai-chat.tsx` route for the conversation UI.
   - Added a message list, input, simulated response/loading state, and safety message.
   - Home links to `/tabs/ai-chat`; responses are scripted and no remote AI service is connected.

9. **Reminder scheduling**
   - Suggested route: `src/app/reminders.tsx`
   - Let users choose reminder days and times, then manage or pause the local demo schedule.
   - The notification settings screen links to reminders; device notifications are not scheduled.

10. **Password recovery completion**
    - Suggested routes:
      - `src/app/auth/verify-code.tsx`
      - `src/app/auth/reset-password.tsx`
      - `src/app/auth/password-reset-complete.tsx`
    - Added code entry, validation, new-password entry, and success confirmation.
    - Use demo code `123456`; real verification and password changes require an auth provider.

11. **Voice-analysis consent and results**
    - Suggested routes:
      - `src/app/assessment/voice-consent.tsx`
      - `src/app/assessment/voice-results.tsx`
    - Added consent, skip, and sample results screens. The prototype does not request microphone access or record audio.
    - Add platform permission and error states only when real speech capture is implemented.

## Priority 3: Add if needed for the product

- **Subscription and purchases:** [subscription screen](./src/app/subscription.tsx) and [plan management](./src/app/subscription/manage.tsx) show plans and demo restore/purchase states.
- **Saved and downloaded practices:** [library items](./src/app/library-items.tsx) lists locally saved practices; offline audio is not stored.
- **Account security and privacy:** [security](./src/app/security.tsx), [privacy](./src/app/privacy.tsx), and [account deletion](./src/app/delete-account.tsx) screens are implemented for the demo.
- **Support and safety resources:** [support](./src/app/support.tsx) provides general safety guidance and a feedback route; add region-specific resources before release.

## Related flow fixes

- The root route still opens Home; decide whether new users should instead go through welcome/onboarding and returning users should go to Home.
- Sign-up starts the assessment, and sign-in now routes to Home after local form validation. Connect both flows to real authentication before release.
- The profile tab is now a hub linking to wellbeing and account routes; `src/app/no-tabs/profile.tsx` remains account settings.
- `src/app/mha/step-11.tsx` now redirects to the assessment results screen.
- A VS Code task in `.vscode/tasks.json` runs the project lint and TypeScript checks.
