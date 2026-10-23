import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";
import {
  AppButton,
  AppCard,
  AppPage,
  AppChoice,
} from "../../../components/screens/app-ui";
import {
  demoActions,
  getPractice,
} from "../../../components/screens/demo-store";
import { useState } from "react";

const REFLECTIONS = ["More settled", "About the same", "Still distracted"];

export default function MeditationComplete() {
  const { id, minutesCompleted } = useLocalSearchParams<{
    id: string;
    minutesCompleted?: string;
  }>();
  const practice = getPractice(id);
  const completedMinutes = Math.min(
    practice.duration,
    Math.max(1, Number.parseInt(minutesCompleted ?? "", 10) || practice.duration),
  );
  const [reflection, setReflection] = useState(REFLECTIONS[0]);
  const finish = () => {
    demoActions.completeSession(practice, reflection, completedMinutes);
    router.replace("/progress");
  };

  return (
    <AppPage title="Practice complete" subtitle="Thank yourself for making time.">
      <AppCard style={{ backgroundColor: "#E6ECD8" }}>
        <ThemedText variant="heading" style={{ fontSize: 23 }}>
          {practice.title}
        </ThemedText>
        <ThemedText style={{ marginTop: 6 }}>
          {completedMinutes} mindful minutes
        </ThemedText>
      </AppCard>
      <ThemedText variant="heading" style={{ fontSize: 19 }}>
        How do you feel now?
      </ThemedText>
      {REFLECTIONS.map((item) => (
        <AppChoice
          key={item}
          label={item}
          selected={reflection === item}
          onPress={() => setReflection(item)}
        />
      ))}
      <AppButton label="Save and view progress" onPress={finish} />
      <AppButton
        label="Repeat practice"
        secondary
        onPress={() => router.replace(`/meditations/player?id=${practice.id}`)}
      />
    </AppPage>
  );
}
