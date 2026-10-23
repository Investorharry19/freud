import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { ThemedText } from "../../../components/generic/themed-text";

const COLORS = {
  background: "#F8F4F1",
  green: "#9BB168",
  greenRing: "#E1E6D2", // solid on purpose: it has to hide the ticks behind it
  brown: "#4F3422",
  orange: "#EE7B14",
  orangeRing: "#FFDDD2",
  pillBg: "#E9DCD6",
  pillText: "#8A5A44",
  unitGrey: "#756D69",
  tickMajor: "#D7C0B8",
  tickMinor: "#E9DCD9",
  white: "#FFFFFF",
};

const BUTTON_HEIGHT = 58;
const RING = 4; // ring thickness around the selected unit pill
const HALO = 5; // ring thickness around the ruler indicator

// Ruler geometry
const RULER_HEIGHT = 130;
const TICK_GAP = 17; // distance between two ticks
const STEPS_PER_UNIT = 5; // 4 minor ticks between majors => 0.2 per tick
const MAJOR_TICK = { width: 8, height: 52 };
const MINOR_TICK = { width: 4, height: 29 };
const INDICATOR = { width: 12, height: 120 };

const CURRENT_STEP = 4;
const TOTAL_STEPS = 10;

const LB_PER_KG = 2.20462;
const DEFAULT_KG = 70;

type Unit = "kg" | "lbs";

const UNITS: Record<Unit, { min: number; max: number }> = {
  kg: { min: 30, max: 250 },
  lbs: { min: 66, max: 550 },
};

const tickCount = (unit: Unit) =>
  (UNITS[unit].max - UNITS[unit].min) * STEPS_PER_UNIT + 1;

const valueAt = (unit: Unit, index: number) =>
  Math.round((UNITS[unit].min + index / STEPS_PER_UNIT) * 10) / 10;

const indexFor = (unit: Unit, value: number) => {
  const raw = Math.round((value - UNITS[unit].min) * STEPS_PER_UNIT);
  return Math.min(Math.max(raw, 0), tickCount(unit) - 1);
};

export default function AssessmentWeight() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const [unit, setUnit] = useState<Unit>("kg");
  const [index, setIndex] = useState(() => indexFor("kg", DEFAULT_KG));

  const listRef = useRef<FlatList<number>>(null);
  // True until the ruler has been scrolled to `index` (first mount + unit swap).
  // While true, scroll events are ignored so they can't overwrite `index`.
  const pendingScroll = useRef(true);

  const sidePad = (screenWidth - TICK_GAP) / 2;
  const value = valueAt(unit, index);
  const display = Number.isInteger(value) ? String(value) : value.toFixed(1);

  const ticks = useMemo(
    () => Array.from({ length: tickCount(unit) }, (_, i) => i),
    [unit],
  );

  const handleUnitChange = (next: Unit) => {
    if (next === unit) return;
    const kg = unit === "kg" ? value : value / LB_PER_KG;
    const nextValue = next === "kg" ? kg : kg * LB_PER_KG;

    pendingScroll.current = true;
    setUnit(next);
    setIndex(indexFor(next, nextValue));
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pendingScroll.current) return;
    const next = Math.min(
      Math.max(Math.round(e.nativeEvent.contentOffset.x / TICK_GAP), 0),
      ticks.length - 1,
    );
    if (next !== index) setIndex(next);
  };

  const handleContentSizeChange = () => {
    if (!pendingScroll.current) return;
    listRef.current?.scrollToOffset({
      offset: index * TICK_GAP,
      animated: false,
    });
    pendingScroll.current = false;
  };

  const nudge = (delta: number) => {
    const next = Math.min(Math.max(index + delta, 0), ticks.length - 1);
    listRef.current?.scrollToOffset({
      offset: next * TICK_GAP,
      animated: true,
    });
  };

  const handleContinue = () => {
    // TODO: persist { value, unit } + go to next step
    router.push("/mha/step-5");
  };

  // Plain render helpers (called as functions, not used as components)
  const renderUnit = (u: Unit) => {
    const active = unit === u;

    return (
      <Pressable
        key={u}
        onPress={() => handleUnitChange(u)}
        accessibilityRole="radio"
        accessibilityState={{ selected: active }}
        accessibilityLabel={u === "kg" ? "Kilograms" : "Pounds"}
        style={{
          flex: 1,
          borderRadius: BUTTON_HEIGHT / 2,
          borderWidth: RING,
          borderColor: active ? COLORS.orangeRing : "transparent",
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: BUTTON_HEIGHT / 2 - RING,
            backgroundColor: active ? COLORS.orange : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText
            style={{
              fontSize: 20,
              color: active ? COLORS.white : COLORS.brown,
            }}
            variant="heading"
          >
            {u}
          </ThemedText>
        </View>
      </Pressable>
    );
  };

  const renderTick = ({ item: i }: { item: number }) => {
    const isMajor = i % STEPS_PER_UNIT === 0;
    const size = isMajor ? MAJOR_TICK : MINOR_TICK;

    return (
      <View
        style={{
          width: TICK_GAP,
          height: RULER_HEIGHT,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size.width,
            height: size.height,
            borderRadius: size.width / 2,
            backgroundColor: isMajor ? COLORS.tickMajor : COLORS.tickMinor,
          }}
        />
        {isMajor && (
          <ThemedText
            style={{
              position: "absolute",
              top: 106,
              left: (TICK_GAP - 60) / 2,
              width: 60,
              textAlign: "center",
              fontSize: 17,
              color: COLORS.tickMajor,
            }}
            variant="heading"
          >
            {UNITS[unit].min + i / STEPS_PER_UNIT}
          </ThemedText>
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        overflow: "hidden",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: 26,
              borderWidth: 1.5,
              borderColor: COLORS.brown,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Feather name="chevron-left" size={26} color={COLORS.brown} />
          </Pressable>

          <ThemedText
            style={{
              flex: 1,
              marginLeft: 16,
              fontSize: 22,
              color: COLORS.brown,
            }}
            variant="heading"
          >
            Assessment
          </ThemedText>

          <View
            style={{
              height: 38,
              paddingHorizontal: 16,
              borderRadius: 19,
              backgroundColor: COLORS.pillBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThemedText
              style={{ fontSize: 17, color: COLORS.pillText }}
              variant="heading"
            >
              {CURRENT_STEP} of {TOTAL_STEPS}
            </ThemedText>
          </View>
        </View>

        {/* Question */}
        <ThemedText
          style={{
            fontSize: 34,
            lineHeight: 42,
            color: COLORS.brown,
            textAlign: "center",
            marginTop: 56,
          }}
          variant="heading"
        >
          What’s your weight?
        </ThemedText>

        {/* Unit toggle */}
        <View
          accessibilityRole="radiogroup"
          style={{
            marginTop: 48,
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: COLORS.white,
            flexDirection: "row",
          }}
        >
          {renderUnit("kg")}
          {renderUnit("lbs")}
        </View>

        {/* Big value */}
        <View
          style={{
            marginTop: 64,
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
          }}
        >
          <ThemedText
            style={{ fontSize: 96, lineHeight: 108, color: COLORS.brown }}
            variant="heading"
          >
            {display}
          </ThemedText>
          <ThemedText
            style={{ fontSize: 34, marginLeft: 6, color: COLORS.unitGrey }}
            variant="heading"
          >
            {unit}
          </ThemedText>
        </View>

        {/* Ruler (full-bleed, so it cancels the screen's horizontal padding) */}
        <View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Weight"
          accessibilityValue={{ text: `${display} ${unit}` }}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          onAccessibilityAction={(e) =>
            nudge(e.nativeEvent.actionName === "increment" ? 1 : -1)
          }
          style={{
            marginTop: 24,
            marginHorizontal: -16,
            height: RULER_HEIGHT,
          }}
        >
          <FlatList
            ref={listRef}
            data={ticks}
            keyExtractor={(i) => String(i)}
            renderItem={renderTick}
            getItemLayout={(_, i) => ({
              length: TICK_GAP,
              offset: sidePad + i * TICK_GAP,
              index: i,
            })}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TICK_GAP}
            snapToAlignment="start"
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onContentSizeChange={handleContentSizeChange}
            contentContainerStyle={{ paddingHorizontal: sidePad }}
            initialNumToRender={40}
            windowSize={11}
          />

          {/* Fixed centre indicator */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              alignSelf: "center",
              top: (RULER_HEIGHT - INDICATOR.height - HALO * 2) / 2,
              width: INDICATOR.width + HALO * 2,
              height: INDICATOR.height + HALO * 2,
              borderRadius: (INDICATOR.width + HALO * 2) / 2,
              borderWidth: HALO,
              borderColor: COLORS.greenRing,
              backgroundColor: COLORS.green,
            }}
          />
        </View>

        {/* Pushes the action to the bottom on tall screens */}
        <View style={{ flex: 1, minHeight: 32 }} />

        {/* Continue */}
        <Pressable
          onPress={handleContinue}
          accessibilityRole="button"
          style={({ pressed }) => ({
            height: BUTTON_HEIGHT,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: COLORS.brown,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <ThemedText
            style={{ fontSize: 20, color: COLORS.white }}
            variant="heading"
          >
            Continue
          </ThemedText>
          <Feather name="arrow-right" size={24} color={COLORS.white} />
        </Pressable>
      </ScrollView>
    </Animated.View>
  );
}
