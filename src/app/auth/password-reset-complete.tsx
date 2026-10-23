import { router } from "expo-router";
import { AppButton, AppCard, AppPage } from "../../../components/screens/app-ui";
import { ThemedText } from "../../../components/generic/themed-text";

export default function PasswordResetComplete() {
  return (
    <AppPage
      title="Password updated"
      subtitle="Your demo flow is complete. Connect an authentication provider to securely save real account changes."
    >
      <AppCard style={{ backgroundColor: "#E6ECD8" }}>
        <ThemedText variant="heading">
          You can now return to sign in.
        </ThemedText>
      </AppCard>
      <AppButton
        label="Back to sign in"
        onPress={() => router.replace("/auth/sign-in")}
      />
    </AppPage>
  );
}
