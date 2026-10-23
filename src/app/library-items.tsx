import { router } from "expo-router";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
  SectionTitle,
} from "../../components/screens/app-ui";
import {
  PRACTICES,
  useDemoState,
} from "../../components/screens/demo-store";

export default function LibraryItems() {
  const { saved, downloaded } = useDemoState();
  const savedItems = PRACTICES.filter((practice) => saved.includes(practice.id));
  const downloadedItems = PRACTICES.filter((practice) =>
    downloaded.includes(practice.id),
  );
  const renderPractice = (practice: (typeof PRACTICES)[number]) => (
    <AppCard key={practice.id}>
      <ThemedText variant="heading">{practice.title}</ThemedText>
      <ThemedText style={{ marginTop: 4 }}>
        {practice.duration} min · {practice.style}
      </ThemedText>
      <AppButton
        label="Open practice"
        secondary
        onPress={() => router.push(`/meditations/${practice.id}`)}
      />
    </AppCard>
  );

  return (
    <AppPage
      title="Your library"
      subtitle="Saved practices and downloads are kept in this demo session only."
    >
      <SectionTitle>Saved</SectionTitle>
      {savedItems.length ? (
        savedItems.map(renderPractice)
      ) : (
        <AppCard>
          <ThemedText>No saved practices yet.</ThemedText>
        </AppCard>
      )}
      <SectionTitle>Downloaded</SectionTitle>
      {downloadedItems.length ? (
        downloadedItems.map(renderPractice)
      ) : (
        <AppCard>
          <ThemedText>
            No downloads yet. Offline audio is not stored in this demo.
          </ThemedText>
        </AppCard>
      )}
      <AppButton
        label="Browse practices"
        onPress={() => router.push("/meditations")}
      />
    </AppPage>
  );
}
