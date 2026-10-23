import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
  SectionTitle,
} from "../../../components/screens/app-ui";
import {
  demoActions,
  getPractice,
  useDemoState,
} from "../../../components/screens/demo-store";

export default function MeditationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const practice = getPractice(id);
  const { saved, downloaded } = useDemoState();
  const isSaved = saved.includes(practice.id);
  const isDownloaded = downloaded.includes(practice.id);

  return (
    <AppPage title={practice.title} subtitle={practice.subtitle}>
      <AppCard style={{ backgroundColor: "#E6ECD8", minHeight: 130 }}>
        <ThemedText variant="heading" style={{ fontSize: 22 }}>
          {practice.duration} minutes · {practice.style}
        </ThemedText>
        <ThemedText style={{ marginTop: 10, lineHeight: 24 }}>
          An easy-to-follow moment for {practice.intention.toLowerCase()}.
        </ThemedText>
      </AppCard>
      <SectionTitle>About this practice</SectionTitle>
      <ThemedText style={{ lineHeight: 25 }}>{practice.description}</ThemedText>
      <SectionTitle>What to expect</SectionTitle>
      <AppCard>
        <ThemedText>
          Teacher: Freud Studio{"\n"}
          Benefits: create a mindful pause and support{" "}
          {practice.intention.toLowerCase()}.
        </ThemedText>
      </AppCard>
      <AppButton
        label="Begin practice"
        onPress={() => router.push(`/meditations/player?id=${practice.id}`)}
      />
      <AppButton
        label={isSaved ? "Remove from saved" : "Save for later"}
        secondary
        onPress={() => demoActions.toggleSaved(practice.id)}
      />
      <AppButton
        label={isDownloaded ? "Remove offline download" : "Download for offline"}
        secondary
        onPress={() => demoActions.toggleDownloaded(practice.id)}
      />
    </AppPage>
  );
}
