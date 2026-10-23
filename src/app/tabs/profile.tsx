import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
} from "../../../components/screens/app-ui";
import { useDemoState } from "../../../components/screens/demo-store";

export default function Profile() {
  const { sessions, moods } = useDemoState();

  return (
    <AppPage
      title="Your profile"
      subtitle="Your wellbeing tools, preferences, and account."
      back={false}
    >
      <AppCard style={{ backgroundColor: "#E6ECD8" }}>
        <ThemedText variant="heading" style={{ fontSize: 21 }}>
          Your mindful journey
        </ThemedText>
        <ThemedText style={{ marginTop: 6 }}>
          {sessions.length} practices · {moods.length} mood check-ins
        </ThemedText>
      </AppCard>
      <AppButton
        label="Progress and history"
        onPress={() => router.push("/progress")}
      />
      <AppButton
        label="Mood check-in"
        onPress={() => router.push("/mood/check-in")}
      />
      <AppButton
        label="Mood history"
        onPress={() => router.push("/mood/history")}
      />
      <AppButton
        label="Saved and downloaded"
        onPress={() => router.push("/library-items")}
      />
      <AppButton
        label="Practice reminders"
        onPress={() => router.push("/reminders")}
      />
      <AppButton
        label="Subscription"
        onPress={() => router.push("/subscription")}
      />
      <AppButton
        label="Account settings"
        onPress={() => router.push("/no-tabs/profile")}
      />
      <AppButton
        label="Security and privacy"
        secondary
        onPress={() => router.push("/security")}
      />
      <AppButton
        label="Support and safety"
        secondary
        onPress={() => router.push("/support")}
      />
    </AppPage>
  );
}
