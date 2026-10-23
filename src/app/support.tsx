import { router } from "expo-router";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
  SectionTitle,
} from "../../components/screens/app-ui";

export default function Support() {
  return (
    <AppPage
      title="Support and safety"
      subtitle="Meditation can support wellbeing, but it is not a replacement for professional care."
    >
      <AppCard style={{ backgroundColor: "#FBE3D3" }}>
        <ThemedText variant="heading">Need urgent help?</ThemedText>
        <ThemedText style={{ marginTop: 8, lineHeight: 23 }}>
          If you or someone else is in immediate danger, contact your local
          emergency services now. For emotional support, reach out to a trusted
          person or a qualified professional in your area.
        </ThemedText>
      </AppCard>
      <SectionTitle>In-app support</SectionTitle>
      <AppButton
        label="Send feedback"
        onPress={() => router.push("/no-tabs/settings-feedback")}
      />
      <AppButton
        label="Read privacy information"
        secondary
        onPress={() => router.push("/privacy")}
      />
      <AppCard>
        <ThemedText>
          Regional crisis and support contacts should be provided and maintained
          for the countries where this app is offered.
        </ThemedText>
      </AppCard>
    </AppPage>
  );
}
