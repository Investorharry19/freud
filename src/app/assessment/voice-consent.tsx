import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
} from "../../../components/screens/app-ui";

export default function VoiceConsent() {
  return (
    <AppPage
      title="Voice reflection"
      subtitle="Your voice is personal. You are in control of whether to continue."
    >
      <AppCard>
        <ThemedText variant="heading">What happens in this demo?</ThemedText>
        <ThemedText style={{ marginTop: 8, lineHeight: 23 }}>
          The voice assessment is a prototype. It does not request microphone
          access, record audio, or upload your voice. Any future recording
          feature should explain its purpose, retention, and controls before
          asking permission.
        </ThemedText>
      </AppCard>
      <AppButton
        label="Continue to demo"
        onPress={() => router.push("/mha/step-10")}
      />
      <AppButton
        label="Skip voice reflection"
        secondary
        onPress={() => router.replace("/assessment-results")}
      />
    </AppPage>
  );
}
