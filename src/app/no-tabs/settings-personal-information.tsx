import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Octicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { BarChart } from "react-native-gifted-charts";
import { ThemedText } from "../../../components/generic/themed-text";
import { useAppTheme } from "../../../components/theme/theme-provider";
import { router } from "expo-router";

const COLORS = {
  green: "#9BB168",
  orange: "#EE7B14",
  white: "#FFFFFF",
};

const PROFILE = {
  name: "Ameh Hendra",
  membership: "Basic Member",
  stats: [
    { label: "Age", value: "21" },
    { label: "Weight", value: "67kg" },
    { label: "Height", value: "123cm" },
  ],
  freudScore: 80,
  freudLabel: "Healthy",
  mood: "Sad",
  // relative bar heights + opacity (the highlighted bar is fully white)
  moodBars: [
    { value: 18, opacity: 0.3 },
    { value: 30, opacity: 0.45 },
    { value: 42, opacity: 0.55 },
    { value: 34, opacity: 0.45 },
    { value: 62, opacity: 0.7 },
    { value: 100, opacity: 1 },
    { value: 68, opacity: 0.85 },
    { value: 52, opacity: 0.6 },
    { value: 36, opacity: 0.45 },
    { value: 16, opacity: 0.35 },
  ],
};

/* ---------- Segmented ring gauge (react-native-svg) ---------- */

// 0° = 12 o'clock, clockwise
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
};

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
) => {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
};

function SegmentedRing({
  score,
  size = 130,
  stroke = 12,
  segments = 5,
  gapDeg = 22, // gap includes room for the rounded caps
}: {
  score: number;
  size?: number;
  stroke?: number;
  segments?: number;
  gapDeg?: number;
}) {
  const c = size / 2;
  const r = (size - stroke) / 2;
  const segSpan = 360 / segments - gapDeg;
  const progress = Math.min(Math.max(score, 0), 100) / 100;

  return (
    <Svg width={size} height={size}>
      {Array.from({ length: segments }).map((_, i) => {
        const start = i * (360 / segments) + gapDeg / 2;
        const fill = Math.min(Math.max(progress * segments - i, 0), 1);
        return (
          <View key={i} style={{ position: "absolute" }}>
            {/* faded track */}
            <Path
              d={arcPath(c, c, r, start, start + segSpan)}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
            />
            {/* filled portion */}
            {fill > 0 && (
              <Path
                d={arcPath(c, c, r, start, start + segSpan * fill)}
                stroke={COLORS.white}
                strokeWidth={stroke}
                strokeLinecap="round"
                fill="none"
              />
            )}
          </View>
        );
      })}
    </Svg>
  );
}

/* ---------- Screen ---------- */

export default function PersonalInformation() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { colors, isDark } = useAppTheme();

  const CARD_GAP = 12;
  const CARD_PADDING = 16;
  const cardWidth = (screenWidth - 32 - CARD_GAP) / 2;
  const chartWidth = cardWidth - CARD_PADDING * 2;

  const BAR_SPACING = 4;
  const barCount = PROFILE.moodBars.length;
  const barWidth = Math.floor(
    (chartWidth - BAR_SPACING * (barCount - 1)) / barCount,
  );

  const moodData = PROFILE.moodBars.map((b) => ({
    value: b.value,
    frontColor: `rgba(255,255,255,${b.opacity})`,
  }));

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        overflow: "hidden",
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 24,
          }}
        >
          {/* ---------- Header ---------- */}
          <View
            style={{
              height: 200,
              marginHorizontal: -16,
              position: "relative",
              marginBottom: 250,
            }}
          >
            <ImageBackground
              source={require("../../../assets/profile-settings-bg-image.jpg")}
              style={{
                height: 550,
                width: 550,
                backgroundColor: COLORS.green,
                borderRadius: "100%",
                position: "absolute",
                alignSelf: "center",
                top: -300,
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 30,
                overflow: "hidden",
              }}
            >
              <Image
                source={require("../../../assets/auth-screen-logo.png")}
                style={{ width: 40, height: 40 }}
              />
            </ImageBackground>

            <View style={{ alignSelf: "center", bottom: -160 }}>
              <Image
                source={require("../../../assets/female-avatar.jpg")}
                style={{
                  height: 150,
                  width: 150,
                  borderRadius: 100,
                  alignSelf: "center",
                  borderWidth: 2,
                  borderColor: colors.surface,
                }}
              />
              <Pressable
                onPress={() => {
                  router.push("/no-tabs/settings-select-avatar");
                  console.log("Nice");
                }}
                style={{
                  position: "absolute",
                  bottom: 15,
                  right: 5,
                  backgroundColor: colors.heading,
                  height: 35,
                  width: 35,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 100,
                }}
              >
                <Octicons name="pencil" size={18} color={colors.surface} />
              </Pressable>
            </View>

            <View
              style={{
                bottom: -180,
                alignItems: "center",
                justifyContent: "center",
                gap: 15,
              }}
            >
              <ThemedText
                variant="body"
                style={{ fontSize: 30, color: colors.heading }}
              >
                {PROFILE.name}
              </ThemedText>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 100,
                  paddingHorizontal: 15,
                  paddingVertical: 6,
                }}
              >
                <ThemedText style={{ fontSize: 17 }}>
                  {PROFILE.membership}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* ---------- Stats row ---------- */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 15,
            }}
          >
            {PROFILE.stats.map((stat, i) => (
              <View
                key={stat.label}
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
                <View style={{ gap: 10, alignItems: "center" }}>
                  <ThemedText
                    style={{ color: colors.mutedText, fontSize: 20 }}
                  >
                    {stat.label}
                  </ThemedText>
                  <ThemedText
                    variant="heading"
                    style={{
                      color: colors.heading,
                      fontSize: 30,
                      lineHeight: 40,
                    }}
                  >
                    {stat.value}
                  </ThemedText>
                </View>
                {i < PROFILE.stats.length - 1 && (
                  <View
                    style={{
                      width: 2,
                      height: 100,
                      backgroundColor: colors.border,
                    }}
                  />
                )}
              </View>
            ))}
          </View>

          {/* ---------- Cards ---------- */}
          <View style={{ flexDirection: "row", gap: CARD_GAP, marginTop: 36 }}>
            {/* Freud Score */}
            <View
              style={{
                width: cardWidth,
                backgroundColor: isDark ? "#34452F" : COLORS.green,
                borderRadius: 32,
                padding: CARD_PADDING,
                gap: 12,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Feather name="heart" size={26} color={COLORS.white} />
                <ThemedText style={{ color: COLORS.white, fontSize: 20 }}>
                  Freud Score
                </ThemedText>
              </View>

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <SegmentedRing
                  score={PROFILE.freudScore}
                  size={Math.min(chartWidth, 140)}
                />
                <View style={{ position: "absolute", alignItems: "center" }}>
                  <ThemedText
                    variant="heading"
                    style={{
                      color: COLORS.white,
                      fontSize: 44,
                      lineHeight: 50,
                    }}
                  >
                    {PROFILE.freudScore}
                  </ThemedText>
                  <ThemedText style={{ color: COLORS.white, fontSize: 16 }}>
                    {PROFILE.freudLabel}
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Mood */}
            <View
              style={{
                width: cardWidth,
                backgroundColor: isDark ? "#633B27" : COLORS.orange,
                borderRadius: 32,
                padding: CARD_PADDING,
                gap: 8,
                marginTop: 6,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Feather name="frown" size={26} color={COLORS.white} />
                <ThemedText style={{ color: COLORS.white, fontSize: 20 }}>
                  Mood
                </ThemedText>
              </View>

              <ThemedText
                style={{ color: COLORS.white, fontSize: 20, marginTop: 4 }}
              >
                {PROFILE.mood}
              </ThemedText>

              <BarChart
                data={moodData}
                width={chartWidth}
                height={110}
                maxValue={100}
                barWidth={barWidth}
                spacing={BAR_SPACING}
                initialSpacing={0}
                endSpacing={0}
                barBorderRadius={5}
                disableScroll
                isAnimated
                animationDuration={600}
                hideRules
                hideYAxisText
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisLabelWidth={0}
                noOfSections={1}
                backgroundColor="transparent"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}
