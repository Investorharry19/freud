import { router } from "expo-router";
import { ThemedText } from "../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
  SectionTitle,
} from "../../components/screens/app-ui";

export default function AssessmentResults() {
  return (
    <AppPage
      title="Your mindful starting point"
      subtitle="A sample starter plan for this local demo. Assessment answers are not stored yet; this is a wellbeing guide, not a diagnosis."
    >
      <AppCard style={{ backgroundColor: "#E6ECD8" }}>
        <ThemedText variant="heading" style={{ color: "#4F3422", fontSize: 24 }}>
          Start with small pauses
        </ThemedText>
        <ThemedText style={{ color: "#4F3422", lineHeight: 23, marginTop: 8 }}>
          A short breathing practice and a consistent wind-down routine may be
          helpful places to begin.
        </ThemedText>
      </AppCard>
      <SectionTitle>Your 7-day starter plan</SectionTitle>
      <AppCard>
        <ThemedText variant="heading">1. Breathe Out</ThemedText>
        <ThemedText style={{ marginTop: 5 }}>
          10 minutes · a grounding breath practice
        </ThemedText>
      </AppCard>
      <AppCard>
        <ThemedText variant="heading">2. Check in with yourself</ThemedText>
        <ThemedText style={{ marginTop: 5 }}>
          Notice your mood without judging it.
        </ThemedText>
      </AppCard>
      <AppButton
        label="Start my first practice"
        onPress={() => router.push("/meditations/breathe-out")}
      />
      <AppButton
        label="Go to Home"
        secondary
        onPress={() => router.replace("/tabs/home")}
      />
    </AppPage>
  );
}
