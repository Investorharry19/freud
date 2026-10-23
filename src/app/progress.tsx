import { router } from "expo-router";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
  SectionTitle,
} from "../../components/screens/app-ui";
import { useDemoState } from "../../components/screens/demo-store";

export default function Progress() {
  const { sessions, moods } = useDemoState();
  const minutes = sessions.reduce((sum, session) => sum + session.minutes, 0);
  const sessionDays = new Set(
    sessions.map((session) => {
      const date = new Date(session.completedAt);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }),
  );
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const streakCursor = new Date(today);
  if (!sessionDays.has(todayKey)) streakCursor.setDate(streakCursor.getDate() - 1);
  let streak = 0;
  while (
    sessionDays.has(
      `${streakCursor.getFullYear()}-${streakCursor.getMonth()}-${streakCursor.getDate()}`,
    )
  ) {
    streak += 1;
    streakCursor.setDate(streakCursor.getDate() - 1);
  }

  return (
    <AppPage
      title="Your progress"
      subtitle="Notice the small moments that add up."
    >
      <AppCard style={{ backgroundColor: "#E6ECD8" }}>
        <ThemedText variant="heading" style={{ fontSize: 22 }}>
          {sessions.length} sessions · {minutes} mindful minutes
        </ThemedText>
        <ThemedText style={{ marginTop: 6 }}>
          Current streak: {streak ? `${streak} day${streak === 1 ? "" : "s"}` : "Ready to begin"}
        </ThemedText>
      </AppCard>
      <SectionTitle>Recent practices</SectionTitle>
      {sessions.length ? (
        sessions.map((session, index) => (
          <AppCard key={`${session.practiceId}-${index}`}>
            <ThemedText variant="heading">{session.title}</ThemedText>
            <ThemedText style={{ marginTop: 4 }}>
              {session.minutes} minutes ·{" "}
              {new Date(session.completedAt).toLocaleDateString()}
            </ThemedText>
          </AppCard>
        ))
      ) : (
        <AppCard>
          <ThemedText>No completed practices yet. Your first one can be short.</ThemedText>
        </AppCard>
      )}
      <SectionTitle>Mood check-ins</SectionTitle>
      <AppCard>
        <ThemedText>
          {moods.length
            ? `${moods.length} check-in${moods.length === 1 ? "" : "s"} recorded`
            : "Your mood check-ins will appear here."}
        </ThemedText>
      </AppCard>
      <AppButton
        label="Explore meditations"
        onPress={() => router.push("/meditations")}
      />
    </AppPage>
  );
}
