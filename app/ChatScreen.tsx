import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { 
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, 
  ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING, SHADOWS } from "../constants/styles";
import { sendToAI } from "../utils/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const { question } = useLocalSearchParams<{ question?: string }>();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Merhaba! Ben Deprem Asistanı. Size nasıl yardımcı olabilirim?", 
      timestamp: new Date() 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  
  const scrollToEnd = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  
  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  
  useEffect(() => {
    if (question?.trim()) {
      handleSend(question, true);
    }
  }, [question]);

  const handleSend = useCallback(async (text?: string, isAuto = false) => {
    const messageText = text ?? input;
    if (!messageText.trim() || loading) return;

    const userMessage: Message = { 
      role: "user", 
      content: messageText, 
      timestamp: new Date() 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    if (!isAuto) setInput(""); 
    setLoading(true);
    scrollToEnd();

    try {
      const systemPrompt = "Sen bir acil durum asistanısın. Kısa, net, adım adım öneriler ver. Gereksiz detay verme. Türkçe yanıt ver.";
      const aiResponse = await sendToAI(messageText, systemPrompt);
      const assistantMessage: Message = { 
        role: "assistant", 
        content: aiResponse, 
        timestamp: new Date() 
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, scrollToEnd]);

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <View style={[
      styles.messageRow, 
      item.role === "user" ? styles.userRow : styles.assistantRow
    ]}>
      <View style={[
        styles.avatar,
        item.role === "user" ? styles.userAvatar : styles.assistantAvatar
      ]}>
        <Ionicons 
          name={item.role === "user" ? "person" : "chatbubbles"} 
          size={16} 
          color="white" 
        />
      </View>
      
      <View style={[
        styles.messageBubble, 
        item.role === "user" ? styles.userBubble : styles.assistantBubble
      ]}>
        <Text style={item.role === "user" ? styles.userText : styles.assistantText}>
          {item.content}
        </Text>
        <Text style={[
          styles.timestamp,
          item.role === "user" ? styles.userTimestamp : styles.assistantTimestamp
        ]}>
          {item.timestamp.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
    </View>
  ), []);

  const Header = useMemo(() => (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.header, { paddingTop: insets.top + 10 }]}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.headerTextBox}>
        <Text style={[
          styles.headerTitle,
          { fontSize: SIZES.isSmallScreen ? 18 : 22 }
        ]}>
          Deprem Asistanı
        </Text>
        <Text style={[
          styles.headerSubtitle,
          { fontSize: SIZES.isSmallScreen ? 12 : 14 }
        ]}>
          Size yardımcı olmaktan mutluluk duyarım
        </Text>
      </View>
      {loading && <ActivityIndicator size="small" color="white" />}
    </LinearGradient>
  ), [insets.top, loading, router]);

  const InputArea = useMemo(() => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          { fontSize: SIZES.isSmallScreen ? 14 : 16 }
        ]}
        value={input}
        onChangeText={setInput}
        placeholder="Mesajınızı yazın..."
        placeholderTextColor={COLORS.textTertiary}
        multiline
        maxLength={500}
        textAlignVertical="center"
        onFocus={scrollToEnd}
      />
      <TouchableOpacity 
        style={[
          styles.sendButton, 
          (!input.trim() || loading) && styles.sendButtonDisabled
        ]} 
        onPress={() => handleSend()}
        disabled={!input.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons name="send" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  ), [input, loading, handleSend, scrollToEnd]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {Header}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
        onContentSizeChange={scrollToEnd}
      />

      {InputArea}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...SHADOWS.primary,
  },
  backButton: { 
    position: "absolute", 
    left: SPACING.lg, 
    bottom: SPACING.lg 
  },
  headerTextBox: { 
    alignItems: "center" 
  },
  headerTitle: { 
    color: COLORS.white, 
    fontWeight: "700" 
  },
  headerSubtitle: { 
    color: "rgba(255,255,255,0.9)", 
    marginTop: SPACING.xs 
  },
  messagesList: { 
    flex: 1,
    backgroundColor: COLORS.background
  },
  messagesContainer: { 
    padding: SPACING.lg,
    flexGrow: 1,
    paddingBottom: 80 
  },
  messageRow: { 
    flexDirection: "row", 
    marginBottom: SPACING.lg,
    alignItems: "flex-end"
  },
  userRow: { 
    justifyContent: "flex-end",
    flexDirection: "row-reverse"
  },
  assistantRow: { 
    justifyContent: "flex-start" 
  },
  avatar: {
    width: 32, 
    height: 32, 
    borderRadius: 16,
    alignItems: "center", 
    justifyContent: "center", 
    marginHorizontal: SPACING.sm,
    ...SHADOWS.sm,
  },
  userAvatar: { 
    backgroundColor: COLORS.info 
  },
  assistantAvatar: { 
    backgroundColor: "#ff6b35" 
  },
  messageBubble: { 
    maxWidth: "75%", 
    padding: SPACING.sm, 
    borderRadius: 18,
    ...SHADOWS.sm,
  },
  userBubble: { 
    backgroundColor: COLORS.info, 
    borderTopRightRadius: 4 
  },
  assistantBubble: { 
    backgroundColor: COLORS.white, 
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  userText: { 
    color: COLORS.white, 
    fontSize: SIZES.isSmallScreen ? 14 : 16,
    lineHeight: 22
  },
  assistantText: { 
    color: COLORS.textPrimary, 
    fontSize: SIZES.isSmallScreen ? 14 : 16,
    lineHeight: 22
  },
  timestamp: { 
    fontSize: 11, 
    marginTop: SPACING.xs 
  },
  userTimestamp: { 
    color: "rgba(255,255,255,0.7)", 
    textAlign: "right" 
  },
  assistantTimestamp: { 
    color: COLORS.textTertiary 
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.lg,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.gray50,
    color: COLORS.textPrimary,
    maxHeight: 100,
    minHeight: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  sendButton: {
    backgroundColor: COLORS.info,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.sm,
  },
  sendButtonDisabled: { 
    backgroundColor: COLORS.gray400,
  },
});