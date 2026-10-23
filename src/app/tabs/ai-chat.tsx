import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "../../../components/generic/themed-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = { id: number; text: string; fromUser: boolean };

const STARTER_MESSAGES: Message[] = [
  {
    id: 0,
    text: "Hi, I'm here to help you pause and reflect. What would feel helpful right now?",
    fromUser: false,
  },
];

export default function AiChat() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState(STARTER_MESSAGES);
  const [draft, setDraft] = useState("");
  const [replyPending, setReplyPending] = useState(false);

  const send = () => {
    const text = draft.trim();
    if (!text || replyPending) return;
    setMessages((current) => [...current, { id: Date.now(), text, fromUser: true }]);
    setDraft("");
    setReplyPending(true);
    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          text: "Thanks for sharing. Try taking one slow breath, then notice what you need in this moment. This demo companion is not a therapist or emergency service.",
          fromUser: false,
        },
      ]);
      setReplyPending(false);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FAF6F0" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, paddingTop: insets.top + 12 }}>
        <ThemedText
          variant="heading"
          style={{ fontSize: 28, marginHorizontal: 20, marginBottom: 12 }}
        >
          Freud companion
        </ThemedText>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 18,
            gap: 12,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                alignSelf: message.fromUser ? "flex-end" : "flex-start",
                maxWidth: "88%",
                padding: 14,
                borderRadius: 18,
                backgroundColor: message.fromUser ? "#E6ECD8" : "#FFFFFF",
              }}
            >
              <ThemedText>{message.text}</ThemedText>
            </View>
          ))}
          {replyPending ? (
            <ActivityIndicator
              accessibilityLabel="Freud is preparing a response"
              color="#8FA66A"
            />
          ) : null}
          <ThemedText style={{ fontSize: 13, lineHeight: 19, marginTop: 8 }}>
            Demo conversation only. If you may be in immediate danger, contact
            local emergency services or someone you trust.
          </ThemedText>
        </ScrollView>
        <View
          style={{
            padding: 14,
            paddingBottom: insets.bottom + 12,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: "#E8DECF",
          }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Write a message..."
            accessibilityLabel="Message"
            onSubmitEditing={send}
            returnKeyType="send"
            editable={!replyPending}
            style={{
              flex: 1,
              minHeight: 48,
              borderRadius: 24,
              paddingHorizontal: 16,
              backgroundColor: "#FFFFFF",
            }}
          />
          <Pressable
            onPress={send}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#4F3422",
            }}
          >
            <Feather name="arrow-up" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
