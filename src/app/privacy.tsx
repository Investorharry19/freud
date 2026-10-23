import { router } from "expo-router";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
} from "../../components/screens/app-ui";

export default function Privacy() {
  return (
    <AppPage
      title="Privacy and your data"
      subtitle="A transparent overview of this prototype's data behavior."
    >
      <AppCard>
        <ThemedText variant="heading">Demo session data</ThemedText>
        <ThemedText style={{ marginTop: 8, lineHeight: 23 }}>
          Mood entries, saved practices, and completed sessions are stored
          temporarily in app memory. They are not synced to an account and reset
          when the app process restarts.
        </ThemedText>
      </AppCard>
      <AppCard>
        <ThemedText variant="heading">Voice and chat</ThemedText>
        <ThemedText style={{ marginTop: 8, lineHeight: 23 }}>
          Voice analysis is not active. Chat replies are scripted demo text and
          are not sent to an AI service.
        </ThemedText>
      </AppCard>
      <AppButton
        label="Account deletion options"
        onPress={() => router.push("/delete-account")}
      />
    </AppPage>
  );
}
