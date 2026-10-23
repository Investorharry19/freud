import { useEffect, useState } from "react";
import { Pressable, View, type LayoutChangeEvent } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../../../components/generic/themed-text";
import { AppButton, AppPage, APP_COLORS } from "../../../components/screens/app-ui";
import { getPractice } from "../../../components/screens/demo-store";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function MeditationPlayer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const practice = getPractice(id);
  const duration = practice.duration * 60;
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const playing = !paused && elapsed < duration;
  const handleTrackLayout = (event: LayoutChangeEvent) =>
    setTrackWidth(event.nativeEvent.layout.width);

  useEffect(() => {
    if (paused || elapsed >= duration) return;
    const interval = setInterval(
      () => setElapsed((current) => Math.min(current + 1, duration)),
      1000,
    );
    return () => clearInterval(interval);
  }, [duration, elapsed, paused]);

  return (
    <AppPage
      title={practice.title}
      subtitle="A quiet space to pause and breathe."
    >
      <View
        style={{
          height: 260,
          borderRadius: 130,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: APP_COLORS.greenSoft,
        }}
      >
        <Feather name="wind" size={68} color={APP_COLORS.green} />
        <ThemedText variant="heading" style={{ marginTop: 14, fontSize: 20 }}>
          Breathe in · Breathe out
        </ThemedText>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText>{formatTime(elapsed)}</ThemedText>
        <ThemedText>{formatTime(duration)}</ThemedText>
      </View>
      <View
        onLayout={handleTrackLayout}
        onStartShouldSetResponder={() => true}
        onResponderRelease={(event) => {
          if (!trackWidth) return;
          const position = Math.min(
            Math.max(event.nativeEvent.locationX / trackWidth, 0),
            1,
          );
          setElapsed(Math.round(position * duration));
        }}
        accessibilityRole="adjustable"
        accessibilityLabel="Practice progress"
        accessibilityValue={{ min: 0, max: duration, now: elapsed }}
        style={{
          height: 8,
          borderRadius: 4,
          backgroundColor: APP_COLORS.border,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${(elapsed / duration) * 100}%`,
            height: "100%",
            backgroundColor: APP_COLORS.green,
          }}
        />
      </View>
      <Pressable
        onPress={() => setPaused((value) => !value)}
        accessibilityRole="button"
        accessibilityLabel={playing ? "Pause practice" : "Play practice"}
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          alignSelf: "center",
          backgroundColor: APP_COLORS.brown,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather
          name={playing ? "pause" : "play"}
          size={30}
          color={APP_COLORS.white}
        />
      </Pressable>
      <ThemedText style={{ textAlign: "center", lineHeight: 22 }}>
        Demo player: playback timer is simulated; audio and background playback
        are not connected yet.
      </ThemedText>
      <AppButton
        label="Finish practice"
        disabled={elapsed === 0}
        onPress={() =>
          router.replace(
            `/meditations/complete?id=${practice.id}&minutesCompleted=${Math.min(
              practice.duration,
              Math.max(1, Math.ceil(elapsed / 60)),
            )}`,
          )
        }
      />
    </AppPage>
  );
}
