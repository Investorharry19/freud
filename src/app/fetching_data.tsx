import { useCallback, useEffect, useRef } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { DeviceMotion } from "expo-sensors";
import Animated, {
  Easing,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { ThemedText } from "../../components/generic/themed-text";
import { router } from "expo-router";

// ---- Tuning ---------------------------------------------------------------

const ACCEL_X = 1300; // px/s² at full sideways tilt (before per-bubble sensitivity)
const ACCEL_Y = 380; // vertical push is much weaker
const MAX_SPEED_X = 680; // px/s (before per-bubble sensitivity)
const MAX_SPEED_Y = 260;
const FRICTION_Y_BOOST = 1.5; // vertical motion dies out faster than horizontal

const DEAD_ZONE_X = 0.05; // small, so sideways tilts feel immediate
const DEAD_ZONE_Y = 0.15; // vertical needs a deliberate tilt
const VERTICAL_GAIN = 0.5; // overall vertical strength
const VERTICAL_COUPLING = 0.35; // vertical response with no sideways tilt (0 to 1)
const BASELINE_ADAPT = 0.004; // how quickly the "neutral" holding angle follows you

const WALL_RESTITUTION = 0.55; // speed kept after hitting a screen edge
const BUBBLE_RESTITUTION = 0.8; // bounciness of bubble-to-bubble hits
const COLLISION_ITERATIONS = 3; // more = more stable when bubbles get squeezed
const SHAKE_THRESHOLD = 12; // m/s² (gravity excluded)

// ---- Bubble config --------------------------------------------------------

type BubbleConfig = {
  id: string;
  color: string;
  size: number;
  /** starting position as a fraction of the screen (center of the bubble) */
  home: { x: number; y: number };
  /** how strongly tilt pushes this bubble */
  sensitivity: number;
  /** higher = stops sooner, lower = glides longer */
  friction: number;
  /** higher = reacts to tilt changes instantly, lower = lags behind */
  response: number;
  /** strength of the idle floating drift (px/s²) */
  drift: number;
  phase: number;
};

const BUBBLES: BubbleConfig[] = [
  {
    id: "yellow",
    color: "#7D944D",
    size: 176,
    home: { x: 0.28, y: 0.2 },
    sensitivity: 0.8,
    friction: 1.8,
    response: 5,
    drift: 40,
    phase: 0,
  },
  {
    id: "coral",
    color: "#678033",
    size: 122,
    home: { x: 0.76, y: 0.5 },
    sensitivity: 1.3,
    friction: 1.4,
    response: 9,
    drift: 30,
    phase: 1.7,
  },
  {
    id: "sage",
    color: "#435e0a",
    size: 254,
    home: { x: 0.4, y: 0.82 },
    sensitivity: 0.55,
    friction: 2.2,
    response: 3.5,
    drift: 50,
    phase: 3.1,
  },
  {
    id: "white",
    color: "#63831d",
    size: 100,
    home: { x: 0.74, y: 0.2 },
    sensitivity: 1.8,
    friction: 1.1,
    response: 12,
    drift: 20,
    phase: 4.6,
  },
];

// ---- Physics state --------------------------------------------------------

type Body = {
  /** center position in screen coordinates */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** this bubble's own smoothed view of the tilt */
  sx: number;
  sy: number;
  /** 0 to 1, flashes on collision and decays (drives a small squash) */
  impact: number;
};

// ---- Bubble ---------------------------------------------------------------

type TiltBubbleProps = {
  index: number;
  config: BubbleConfig;
  bodies: SharedValue<Body[]>;
  time: SharedValue<number>;
};

function TiltBubble({ index, config, bodies, time }: TiltBubbleProps) {
  const { color, size, phase } = config;

  const animatedStyle = useAnimatedStyle(() => {
    const b = bodies.value[index];

    // stretch along the direction of travel by flattening across it, so the
    // bubble never grows past its circle and can't poke past the screen edge
    const speed = Math.hypot(b.vx, b.vy);
    const stretch = Math.min(speed / MAX_SPEED_X, 1) * 0.22;
    const angle = Math.atan2(b.vy, b.vx);

    // slow breathing (shrink only) plus a quick squash when something hits it
    const breathe = 1 - (0.5 + 0.5 * Math.sin(time.value * 1.2 + phase)) * 0.03;
    const squash = 1 - b.impact * 0.1;
    const base = breathe * squash;

    return {
      transform: [
        { translateX: b.x - size / 2 },
        { translateY: b.y - size / 2 },
        { rotate: `${angle}rad` },
        { scaleX: base },
        { scaleY: base * (1 - stretch) },
        { rotate: `${-angle}rad` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.34,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.45)",
        },
        animatedStyle,
      ]}
    />
  );
}

// ---- Screen ---------------------------------------------------------------

const shape = (n: number, deadZone: number) => {
  const c = Math.max(-1, Math.min(1, n));
  if (Math.abs(c) < deadZone) return 0;
  // rescale so the response starts smoothly after the dead zone
  return Math.sign(c) * ((Math.abs(c) - deadZone) / (1 - deadZone));
};

export default function FetchingData() {
  const { width, height } = useWindowDimensions();

  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const kick = useSharedValue(0);
  const handledKick = useSharedValue(0);
  const time = useSharedValue(0);
  const pulse = useSharedValue(0);

  const screenW = useSharedValue(width);
  const screenH = useSharedValue(height);

  const bodies = useSharedValue<Body[]>(
    BUBBLES.map((c) => {
      const r = c.size / 2;
      return {
        x: Math.max(r, Math.min(width - r, c.home.x * width)),
        y: Math.max(r, Math.min(height - r, c.home.y * height)),
        vx: 0,
        vy: 0,
        sx: 0,
        sy: 0,
        impact: 0,
      };
    }),
  );

  useEffect(() => {
    screenW.value = width;
    screenH.value = height;
  }, [width, height, screenW, screenH]);

  // one physics loop for all bubbles so they can see each other
  useFrameCallback((frame) => {
    const dt = Math.min((frame.timeSincePreviousFrame ?? 16) / 1000, 0.032);
    time.value += dt;

    const t = time.value;
    const W = screenW.value;
    const H = screenH.value;
    const tx = tiltX.value;
    const ty = tiltY.value;

    const kicked = kick.value !== handledKick.value;
    if (kicked) handledKick.value = kick.value;

    // 1. integrate each bubble on its own
    const next: Body[] = bodies.value.map((b, i) => {
      const c = BUBBLES[i];

      // ease toward the current tilt at this bubble's own pace
      const k = 1 - Math.exp(-c.response * dt);
      const sx = b.sx + (tx - b.sx) * k;
      const sy = b.sy + (ty - b.sy) * k;

      let vx = b.vx;
      let vy = b.vy;

      // shake / tap -> random impulse, scaled per bubble
      if (kicked) {
        vx += (Math.random() - 0.5) * 1100 * c.sensitivity;
        vy += (Math.random() - 0.5) * 620 * c.sensitivity;
      }

      // tilt is a force (horizontal much stronger than vertical), plus a
      // gentle idle drift so bubbles stay alive when the phone is still
      vx +=
        (sx * ACCEL_X * c.sensitivity + Math.sin(t * 0.9 + c.phase) * c.drift) *
        dt;
      vy +=
        (sy * ACCEL_Y * c.sensitivity +
          Math.cos(t * 0.7 + c.phase * 1.3) * c.drift) *
        dt;

      // friction (vertical settles faster)
      vx *= Math.exp(-c.friction * dt);
      vy *= Math.exp(-c.friction * FRICTION_Y_BOOST * dt);

      // per-axis speed limits
      const maxX = MAX_SPEED_X * c.sensitivity;
      const maxY = MAX_SPEED_Y * c.sensitivity;
      vx = Math.max(-maxX, Math.min(maxX, vx));
      vy = Math.max(-maxY, Math.min(maxY, vy));

      return {
        x: b.x + vx * dt,
        y: b.y + vy * dt,
        vx,
        vy,
        sx,
        sy,
        impact: b.impact * Math.exp(-8 * dt),
      };
    });

    // keeps the whole circumference on screen
    const wall = (b: Body, r: number) => {
      if (b.x < r) {
        b.x = r;
        b.vx = Math.abs(b.vx) * WALL_RESTITUTION;
      } else if (b.x > W - r) {
        b.x = W - r;
        b.vx = -Math.abs(b.vx) * WALL_RESTITUTION;
      }
      if (b.y < r) {
        b.y = r;
        b.vy = Math.abs(b.vy) * WALL_RESTITUTION;
      } else if (b.y > H - r) {
        b.y = H - r;
        b.vy = -Math.abs(b.vy) * WALL_RESTITUTION;
      }
    };

    // 2. resolve walls and bubble-to-bubble collisions
    for (let iter = 0; iter < COLLISION_ITERATIONS; iter++) {
      for (let i = 0; i < next.length; i++) {
        wall(next[i], BUBBLES[i].size / 2);
      }

      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const a = next[i];
          const b = next[j];
          const ra = BUBBLES[i].size / 2;
          const rb = BUBBLES[j].size / 2;

          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.hypot(dx, dy);
          const minDist = ra + rb;
          if (dist >= minDist) continue;

          // exactly on top of each other: pick an arbitrary direction
          if (dist < 0.0001) {
            dx = 1;
            dy = 0;
            dist = 1;
          }

          const nx = dx / dist;
          const ny = dy / dist;

          // bigger bubbles are heavier (mass ~ area)
          const ma = ra * ra;
          const mb = rb * rb;

          // push them apart, the lighter one moves more
          const overlap = minDist - dist;
          a.x -= nx * overlap * (mb / (ma + mb));
          a.y -= ny * overlap * (mb / (ma + mb));
          b.x += nx * overlap * (ma / (ma + mb));
          b.y += ny * overlap * (ma / (ma + mb));

          // bounce: exchange momentum along the contact normal
          const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (approach < 0) {
            const impulse =
              (-(1 + BUBBLE_RESTITUTION) * approach) / (1 / ma + 1 / mb);
            a.vx -= (impulse * nx) / ma;
            a.vy -= (impulse * ny) / ma;
            b.vx += (impulse * nx) / mb;
            b.vy += (impulse * ny) / mb;

            const hit = Math.min(1, Math.abs(approach) / 350);
            a.impact = Math.max(a.impact, hit);
            b.impact = Math.max(b.impact, hit);
          }
        }
      }
    }

    // collisions may have pushed someone toward a wall, so clamp once more
    for (let i = 0; i < next.length; i++) {
      wall(next[i], BUBBLES[i].size / 2);
    }

    bodies.value = next;
  });

  const motionSubscription = useRef<ReturnType<
    typeof DeviceMotion.addListener
  > | null>(null);
  const lastShake = useRef(0);
  const baselineY = useRef<number | null>(null);

  const startMotion = useCallback(async () => {
    if (motionSubscription.current) return;

    if (Platform.OS === "web") {
      const permission = await DeviceMotion.requestPermissionsAsync();
      if (!permission.granted) return;
    }

    if (!(await DeviceMotion.isAvailableAsync())) return;

    DeviceMotion.setUpdateInterval(33);
    motionSubscription.current = DeviceMotion.addListener(
      ({ accelerationIncludingGravity, acceleration }) => {
        if (
          accelerationIncludingGravity &&
          Number.isFinite(accelerationIncludingGravity.x) &&
          Number.isFinite(accelerationIncludingGravity.y)
        ) {
          const nx = accelerationIncludingGravity.x / DeviceMotion.Gravity;
          const ny = accelerationIncludingGravity.y / DeviceMotion.Gravity;

          // treat however the user is holding the phone as "neutral" vertically
          if (baselineY.current === null) baselineY.current = ny;
          baselineY.current += (ny - baselineY.current) * BASELINE_ADAPT;

          const horizontal = shape(nx, DEAD_ZONE_X);
          const vertical =
            shape(ny - baselineY.current, DEAD_ZONE_Y) * VERTICAL_GAIN;

          // vertical movement is mostly a reaction to a strong sideways tilt
          const coupling =
            VERTICAL_COUPLING + (1 - VERTICAL_COUPLING) * Math.abs(horizontal);

          tiltX.value = horizontal;
          tiltY.value = -vertical * coupling;
        }

        // shake the phone -> bubbles scatter
        if (acceleration) {
          const magnitude = Math.hypot(
            acceleration.x ?? 0,
            acceleration.y ?? 0,
            acceleration.z ?? 0,
          );
          const now = Date.now();
          if (magnitude > SHAKE_THRESHOLD && now - lastShake.current > 700) {
            lastShake.current = now;
            kick.value += 1;
          }
        }
      },
    );
  }, [tiltX, tiltY, kick]);

  useEffect(() => {
    if (Platform.OS !== "web") void startMotion();

    return () => {
      motionSubscription.current?.remove();
      motionSubscription.current = null;
      baselineY.current = null;
    };
  }, [startMotion]);

  // gentle breathing on the title
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: 0.75 + pulse.value * 0.25,
    transform: [{ scale: 1 + pulse.value * 0.03 }],
  }));

  setTimeout(() => {
    router.replace("/welcome");
  }, 10000 );

  return (
    <View
      onTouchStart={() => {
        if (Platform.OS === "web") void startMotion();
        kick.value += 1; // tap to scatter the bubbles
      }}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#9BB168",
        overflow: "hidden",
      }}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {BUBBLES.map((config, index) => (
          <TiltBubble
            key={config.id}
            index={index}
            config={config}
            bodies={bodies}
            time={time}
          />
        ))}
      </View>

      <View style={{ alignItems: "center", zIndex: 1 }}>
        <Animated.View style={titleStyle}>
          <ThemedText
            variant="heading"
            style={{
              color: "#fff",
              fontSize: 40,
              lineHeight: 42,
              marginBottom: 20,
            }}
          >
            Fetching Data...
          </ThemedText>
        </Animated.View>
        <ThemedText
          style={{ color: "#fff", paddingHorizontal: 20, textAlign: "center" }}
        >
          Tilt to move the bubbles, shake or tap to scatter them
        </ThemedText>
      </View>
    </View>
  );
}
