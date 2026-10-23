import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppCard,
  AppPage,
  SectionTitle,
} from "../../../components/screens/app-ui";
import { useDemoState } from "../../../components/screens/demo-store";

export default function MoodHistory() {
  const { moods } = useDemoState();
  return (
    <AppPage
      title="Mood history"
      subtitle="A private space to notice patterns, without judging them."
    >
      <SectionTitle>Recent check-ins</SectionTitle>
      {moods.length ? (
        moods.map((entry, index) => (
          <AppCard key={`${entry.recordedAt}-${index}`}>
            <ThemedText variant="heading">
              {entry.mood} · intensity {entry.intensity}/5
            </ThemedText>
            <ThemedText style={{ marginTop: 5 }}>
              {new Date(entry.recordedAt).toLocaleString()}
            </ThemedText>
            {entry.note ? (
              <ThemedText style={{ marginTop: 8 }}>{entry.note}</ThemedText>
            ) : null}
          </AppCard>
        ))
      ) : (
        <AppCard>
          <ThemedText>
            No check-ins yet. When you log a mood, it will appear here for this
            demo session.
          </ThemedText>
        </AppCard>
      )}
    </AppPage>
  );
}
