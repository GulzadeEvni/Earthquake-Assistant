// app/DepremSonrasi.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { sendToAI } from "../utils/ai";
import { formatAIResponse, PROMPTS } from "../utils/prompts";
import { GradientHeader } from "../components/common/GradientHeader";
import { LoadingIndicator } from "../components/common/LoadingIndicator";
import { ResponseCard } from "../components/common/ResponseCard";
import { ResponsiveGrid } from '../components/common/ResponsiveGrid';
import { COLORS, SIZES } from "../constants/styles";

const { width: screenWidth } = Dimensions.get("window");

const suggestedQuestions = [
  { title: "Evde hasar varsa ne yapmalıyım?", icon: "home-outline" as const, colors: ['#4facfe', '#00f2fe'] as [string, string] },
  { title: "Aileyi nasıl bulurum?", icon: "people-outline" as const, colors: ['#43e97b', '#38f9d7'] as [string, string] },
  { title: "Su ve elektrik kesilince?", icon: "water-outline" as const, colors: ['#fa709a', '#fee140'] as [string, string] },
  { title: "İlk yardım nasıl yapılır?", icon: "medical-outline" as const, colors: ['#a8edea', '#fed6e3'] as [string, string] },
];

export default function DepremSonrasi() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const ask = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const systemPrompt = PROMPTS.DEPREM_SONRASI("");
      const aiResponse = await sendToAI(question, systemPrompt);
      const formattedResponse = formatAIResponse(aiResponse);
      setAnswer(formattedResponse);
    } catch (error) {
      setAnswer("❌ Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuestion(suggestion);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <GradientHeader 
        title="Deprem Sonrası" 
        subtitle="Güvenlik ve rehabilitasyon rehberi"
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: SIZES.isSmallScreen ? 16 : 20, paddingBottom: 20 }}>
        <View style={{ alignItems: "center", marginVertical: SIZES.isSmallScreen ? 16 : 24 }}>
          <Text style={{ fontSize: SIZES.isSmallScreen ? 24 : 32, fontWeight: "900", textAlign: "center", color: COLORS.textPrimary }}>
            Soru Sor
          </Text>
          <Text style={{ fontSize: SIZES.isSmallScreen ? 14 : 16, textAlign: "center", color: COLORS.textSecondary, marginTop: 8 }}>
            Deprem sonrası güvenlik ve rehabilitasyon konularında rehber alın
          </Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Ionicons name="help-circle" size={24} color={COLORS.primary} />
              <Text style={styles.inputHeaderText}>Sorunuzu Yazın</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                value={question}
                onChangeText={setQuestion}
                style={styles.textInput}
                multiline
                placeholder="Deprem sonrası durumunuz hakkında sormak istediğiniz soruyu detaylı yazın..."
                placeholderTextColor={COLORS.textTertiary}
                textAlignVertical="top"
              />
            </View>
            
            <TouchableOpacity 
              style={[styles.askButton, !question.trim() && styles.askButtonDisabled]} 
              onPress={ask} 
              disabled={!question.trim() || loading}
            >
              <Ionicons name={loading ? "hourglass" : "send"} size={20} color="white" />
              <Text style={styles.askButtonText}>
                {loading ? "Analiz Ediliyor..." : "Soru Sor"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.suggestedSection}>
          <Text style={styles.suggestedTitle}>💡 Sık Sorulan Sorular</Text>
          <ResponsiveGrid columns={2} spacing={12}>
            {suggestedQuestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestedCard}
                onPress={() => handleSuggestionSelect(item.title.replace(/[🔴🟠🟡🟢🔵🟣⚫️⚪️🟤🔴🟠🟡🟢🔵🟣⚫️⚪️🟤]/g, '').trim())}
                activeOpacity={0.8}
              >
                <View style={[styles.gradientBackground, { backgroundColor: item.colors[0] }]}>
                  <Ionicons name={item.icon} size={24} color="white" />
                </View>
                <Text style={styles.suggestedText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ResponsiveGrid>
        </View>

        {loading && <LoadingIndicator title="Analiz Ediliyor" subtitle="Sorunuza en uygun yanıt hazırlanıyor..." />}

        {answer && (
          <ResponseCard
            title="Uzman Önerileri"
            subtitle="Deprem sonrası güvenlik rehberi"
            content={answer}
            icon="bulb"
            iconColors={['#f59e0b', '#d97706']}
            warningText="Bu tavsiyeler genel bilgi amaçlıdır. Acil durumlarda yerel yetkililerle iletişime geçin."
            onNewRequest={() => {
              setQuestion("");
              setAnswer(null);
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputSection: {
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  inputHeaderText: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: 12,
    fontSize: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    color: COLORS.textPrimary,
    textAlignVertical: "top",
    backgroundColor: COLORS.white,
    fontSize: 16,
  },
  askButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
  },
  askButtonDisabled: {
    backgroundColor: COLORS.gray400,
  },
  askButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 8,
  },
  suggestedSection: {
    marginBottom: 30,
  },
  suggestedTitle: {
    fontWeight: "700",
    color: COLORS.textPrimary,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 16,
  },
  suggestedCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 120,
  },
  gradientBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  suggestedText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
});