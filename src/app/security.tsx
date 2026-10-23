import { router } from "expo-router";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
} from "../../components/screens/app-ui";

export default function Security() {
  return (
    <AppPage
      title="Account security"
      subtitle="Review the security options available for your account."
    >
      <AppCard>
        <ThemedText variant="heading">Password</ThemedText>
        <ThemedText style={{ marginTop: 5 }}>
          Use password recovery to update your sign-in details.
        </ThemedText>
      </AppCard>
      <AppCard>
        <ThemedText variant="heading">Two-step verification</ThemedText>
        <ThemedText style={{ marginTop: 5 }}>
          Not connected in this local demo.
        </ThemedText>
      </AppCard>
      <AppButton
        label="Start password recovery"
        onPress={() => router.push("/auth/forgot-password")}
      />
      <AppButton
        label="Privacy and data"
        secondary
        onPress={() => router.push("/privacy")}
      />
      <AppButton
        label="Delete account"
        secondary
        onPress={() => router.push("/delete-account")}
      />
    </AppPage>
  );
}
