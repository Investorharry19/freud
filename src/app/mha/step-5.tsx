import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../../../components/generic/themed-text";
import AssessmentHeader from "../../../components/generic/assessment-header";
import MoodDial from "../../../components/generic/mood-dial";
import MoodFace, { MOODS } from "../../../components/generic/mood-face";
import { COLORS } from "../../../constants/assessment-colors";

// TODO: drive these from the real assessment flow
const STEP = 5;
const TOTAL_STEPS = 10;

const FACE_SIZE = 127;
const DEFAULT_INDEX = 2; // neutral

export default function AssessmentMood() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(DEFAULT_INDEX);
  const mood = MOODS[index];

  // Little pop whenever the mood changes
  const pop = useSharedValue(1);
  useEffect(() => {
    pop.value = 0.85;
    pop.value = withSpring(1, { damping: 10, stiffness: 180 });
  }, [index, pop]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pop.value }],
  }));

  const handleMoodPress = () => {
    // TODO: save `mood.id`
    router.push("/mha/step-6");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: insets.top + 8,
          alignItems: "center",
        }}
      >
        <View style={{ alignSelf: "stretch" }}>
          <AssessmentHeader step={STEP} total={TOTAL_STEPS} />
        </View>

        <ThemedText
          style={{
            fontSize: 34,
            lineHeight: 40,
            color: COLORS.brown,
            textAlign: "center",
            marginTop: 40,
          }}
          variant="heading"
        >
          How would you describe your mood?
        </ThemedText>

        <ThemedText
          style={{ fontSize: 26, color: COLORS.grey, marginTop: 36 }}
          variant="heading"
        >
          I Feel {mood.label}.
        </ThemedText>

        <Pressable
          onPress={handleMoodPress}
          accessibilityRole="button"
          accessibilityLabel={`Continue with ${mood.label} mood`}
        >
          <Animated.View
            style={[
              {
                marginTop: 28,
                width: FACE_SIZE,
                height: FACE_SIZE,
                borderRadius: FACE_SIZE / 2,
                backgroundColor: mood.color,
                shadowColor: mood.color,
                shadowOpacity: 0.35,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 8 },
                elevation: 6,
              },
              popStyle,
            ]}
          >
            <MoodFace mood={mood} size={FACE_SIZE} />
          </Animated.View>
        </Pressable>

        {/* Swipe hint */}
        <View style={{ marginTop: 32 }}>
          <Svg width={30} height={32} viewBox="0 0 30 32">
            <Path
              d="M3 3 Q15 17 27 3"
              stroke={COLORS.iconGrey}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M3 16 Q15 30 27 16"
              stroke={COLORS.iconGrey}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>
      </View>

      <MoodDial initialIndex={DEFAULT_INDEX} onChange={setIndex} />
    </View>
  );
}
