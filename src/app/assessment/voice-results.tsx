import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
} from "../../../components/screens/app-ui";

export default function VoiceResults() {
  return (
    <AppPage
      title="Your reflection"
      subtitle="This is a sample reflection, not an analysis of your voice or a clinical assessment."
    >
      <AppCard style={{ backgroundColor: "#E6ECD8" }}>
        <ThemedText variant="heading" style={{ fontSize: 21 }}>
          Start gently, one moment at a time
        </ThemedText>
        <ThemedText style={{ marginTop: 8, lineHeight: 23 }}>
          A brief breathing practice can be one way to create a little room in
          a busy day. Keep what feels useful and leave the rest.
        </ThemedText>
      </AppCard>
      <AppButton
        label="View my starter plan"
        onPress={() => router.replace("/assessment-results")}
      />
    </AppPage>
  );
}
