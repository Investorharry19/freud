import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { ThemedText } from "../../components/generic/themed-text";
import { router } from "expo-router";

const quoteLines = [
  "In the midst of ",
  "winter, I found there ",
  "was within me an",
  "invincible summer.",
];

export default function Quote() {
  const lineAnimations = useRef(quoteLines.map(() => new Animated.Value(0)));
  const authorAnimation = useRef(new Animated.Value(0));

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/fetching_data");
    }, 6000);

    lineAnimations.current.forEach((animation, index) => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 650,
        delay: index * 180,
        useNativeDriver: true,
      }).start();
    });

    Animated.timing(authorAnimation.current, {
      toValue: 1,
      duration: 650,
      delay: quoteLines.length * 180,
      useNativeDriver: true,
    }).start();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ED7E1C",
      }}
    >
      <View style={{ paddingHorizontal: 20, alignItems: "center" }}>
        <View style={{}}>
          {quoteLines.map((line, index) => (
            <Animated.View
              key={line}
              style={{
                opacity: lineAnimations.current[index],
                transform: [
                  {
                    translateX: lineAnimations.current[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [28, 0],
                    }),
                  },
                ],
              }}
            >
              <ThemedText
                variant="heading"
                style={{ color: "#fff", fontSize: 34, lineHeight: 42 }}
              >
                {index === 0 ? `“${line}` : line}
                {index === quoteLines.length - 1 ? "”" : ""}
              </ThemedText>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          style={{
            opacity: authorAnimation.current,
            transform: [
              {
                translateX: authorAnimation.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [28, 0],
                }),
              },
            ],
            marginTop: 40,
            alignSelf: "flex-start",
          }}
        >
          <ThemedText style={{ color: "#fff", fontSize: 18 }}>
            - ALBERT CAMUS
          </ThemedText>
        </Animated.View>
      </View>
    </View>
  );
}
