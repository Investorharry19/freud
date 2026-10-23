import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
} from "../../../components/screens/app-ui";

export default function AssessmentVoicePreview() {
  return (
    <AppPage
      title="Voice reflection preview"
      subtitle="This prototype shows where an optional voice check could fit into your assessment."
    >
      <AppCard style={{ backgroundColor: "#E6ECD8" }}>
        <ThemedText variant="heading">No recording is taking place</ThemedText>
        <ThemedText style={{ marginTop: 8, lineHeight: 23 }}>
          Microphone access and speech analysis are not connected in this demo.
          You can continue without sharing any audio.
        </ThemedText>
      </AppCard>
      <AppButton
        label="See my assessment summary"
        onPress={() => router.replace("/assessment/voice-results")}
      />
      <AppButton
        label="Skip and continue"
        secondary
        onPress={() => router.replace("/assessment-results")}
      />
    </AppPage>
  );
}
