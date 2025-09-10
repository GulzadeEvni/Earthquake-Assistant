import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { sendToAI } from "../utils/ai";
import { formatAIResponse } from "../utils/prompts";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GradientHeader } from "../components/common/GradientHeader";
import { HeroSection } from "../components/common/HeroSection";
import { InputCard } from "../components/common/InputCard";
import { LoadingIndicator } from "../components/common/LoadingIndicator";
import { ResponseCard } from "../components/common/ResponseCard";
import { COLORS, SIZES, SPACING, SHADOWS } from "../constants/styles";

interface SimulationStep {
  key: string;
  label: string;
  icon: string;
}

const steps: SimulationStep[] = [
  { key: "where", label: "Neredesiniz? (Evde / Yolda / Dışarda binada / Diğer)", icon: "location" },
  { key: "health", label: "Herhangi bir sağlık sorunu ya da engel var mı? (örn. diyabet, yaşlı, hamile)", icon: "medical" },
  { key: "resources", label: "Mevcut kaynaklar nelerdir? (su, yiyecek, ilk yardım çantası...)", icon: "cube" },
  { key: "people", label: "Yanınızdaki kişi sayısı / yaş grupları", icon: "people" },
];

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <View style={styles.progressContainer}>
    <Text style={styles.stepLabel}>📊 Adım {current} / {total}</Text>
    <View style={styles.progressBar}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={[styles.progressFill, { width: `${(current / total) * 100}%` }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    </View>
  </View>
);

const NavigationButton = ({ 
  onPress, 
  disabled = false, 
  type = 'secondary',
  loading = false,
  children 
}: {
  onPress: () => void;
  disabled?: boolean;
  type?: 'primary' | 'secondary';
  loading?: boolean;
  children: React.ReactNode;
}) => {
  if (type === 'primary') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled || loading ? [COLORS.gray400, COLORS.gray500] : [COLORS.primary, COLORS.primaryDark]}
          style={styles.primaryBtnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled} 
      style={[styles.navBtn, disabled && styles.navBtnDisabled]}
      activeOpacity={0.8}
    >
      {children}
    </TouchableOpacity>
  );
};

export default function Simulasyon() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const setAnswer = (text: string) => {
    setAnswers(prev => ({ ...prev, [steps[index].key]: text }));
  };

  const next = () => {
    if (index < steps.length - 1) setIndex(index + 1);
  };

  const back = () => {
    if (index > 0) setIndex(index - 1);
  };

  const finish = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const scenario = steps.map(s => `**${s.label}**\n${answers[s.key] || "Belirtilmedi"}`).join("\n\n");
      
      const systemPrompt = `
Lütfen aşağıdaki senaryoya göre KİŞİSELLEŞTİRİLMİŞ bir eylem planı oluştur.
**Kalın başlıklar** kullan.
Emoji ile görsel zenginlik kat.
Maddeler halinde ve pratik öneriler ver.

**🎯 SENARYO ANALİZİ**
Aşağıdaki senaryoya göre adım adım eylem planı:

${scenario}

**🚨 ACİL DURUM PROTOKOLÜ**
• Öncelikle kendi güvenliğini sağla
• 112'yi aramak için hazırlan

**📋 KİŞİSELLEŞTİRİLMİŞ EYLEM PLANI**
`.trim();

      const aiResponse = await sendToAI("Senaryo analizi ve eylem planı:", systemPrompt);
      const formattedResponse = formatAIResponse(aiResponse);
      setResult(formattedResponse);
    } catch (err) {
      console.error("AI error", err);
      setResult("❌ Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewSimulation = () => {
    setIndex(0);
    setAnswers({});
    setResult(null);
  };

  const currentStep = steps[index];

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Simülasyon Modu"
        subtitle="Kişiselleştirilmiş senaryo analizi"
      />
      
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: SIZES.screenWidth * 0.05 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          title="Senaryo Simülasyonu"
          subtitle="Kendi senaryonu oluştur ve kişiselleştirilmiş eylem planını öğren"
        />
        
        <View style={styles.content}>
          <ProgressBar current={index + 1} total={steps.length} />
          
          <InputCard
            title={
              <Text style={{ marginLeft: 8 }}>
                {currentStep.label}
              </Text>
            }
            icon={currentStep.icon as any}
            placeholder="Cevabınızı detaylı yazın..."
            value={answers[currentStep.key] || ""}
            onChangeText={setAnswer}
            multiline
            minHeight={SIZES.isSmallScreen ? 100 : 120}
            showCounter
            maxLength={500}
          />


          <View style={styles.navContainer}>
            <NavigationButton 
              onPress={back} 
              disabled={index === 0}
            >
              <Ionicons name="arrow-back" size={SIZES.wp(5)} color={index === 0 ? COLORS.gray500 : COLORS.textSecondary} />
              <Text style={[styles.navBtnText, index === 0 && styles.navBtnTextDisabled]}>Geri</Text>
            </NavigationButton>
            
            {index < steps.length - 1 ? (
              <NavigationButton onPress={next}>
                <Text style={styles.navBtnText}>İleri</Text>
                <Ionicons name="arrow-forward" size={SIZES.wp(5)} color={COLORS.textSecondary} />
              </NavigationButton>
            ) : (
              <NavigationButton 
                type="primary"
                onPress={finish} 
                disabled={loading || Object.keys(answers).length < steps.length}
                loading={loading}
              >
                <Ionicons 
                  name={loading ? "hourglass" : "play"} 
                  size={SIZES.wp(5)} 
                  color="white" 
                />
                <Text style={styles.primaryBtnText}>
                  {loading ? "Analiz Ediliyor..." : "🎬 Simülasyonu Çalıştır"}
                </Text>
              </NavigationButton>
            )}
          </View>

          {loading && (
            <LoadingIndicator
              title="📊 Senaryo Analiz Ediliyor"
              subtitle="Kişiselleştirilmiş eylem planı hazırlanıyor..."
            />
          )}

          {result && (
            <ResponseCard
              title="Kişiselleştirilmiş Eylem Planı"
              subtitle="Senaryonuza özel acil durum rehberi"
              content={result}
              icon="bulb"
              iconColors={[COLORS.warning, COLORS.warningDark]}
              warningText="Bu tavsiyeler genel bilgi amaçlıdır. Acil durumlarda yerel yetkililerle iletişime geçin."
              onNewRequest={handleNewSimulation}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  scrollContent: { 
    flexGrow: 1,
    paddingBottom: SPACING.xl
  },
  content: { 
    flex: 1,
  },
  progressContainer: { 
    marginBottom: SIZES.hp(2.5) 
  },
  stepLabel: { 
    fontSize: SIZES.wp(4), 
    fontWeight: "600", 
    textAlign: "center", 
    marginBottom: SIZES.hp(0.8),
    color: COLORS.textSecondary
  },
  progressBar: { 
    height: SIZES.hp(1), 
    backgroundColor: COLORS.gray200, 
    borderRadius: SIZES.wp(1), 
    overflow: "hidden" 
  },
  progressFill: { 
    height: "100%",
  },
  navContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: SIZES.hp(2.5) 
  },
  navBtn: {
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: SIZES.hp(1.5), 
    paddingHorizontal: SIZES.wp(5),
    backgroundColor: COLORS.white, 
    borderRadius: 12,
    minWidth: SIZES.wp(25),
    justifyContent: "center",
    ...SHADOWS.sm,
  },
  navBtnDisabled: { 
    backgroundColor: COLORS.gray100 
  },
  navBtnText: { 
    fontSize: SIZES.wp(4), 
    fontWeight: "600", 
    color: COLORS.textSecondary, 
    marginHorizontal: SIZES.wp(1.5) 
  },
  navBtnTextDisabled: { 
    color: COLORS.gray500 
  },
  primaryBtn: { 
    borderRadius: 16,
    overflow: "hidden", 
    minWidth: SIZES.wp(50),
    ...SHADOWS.primary,
  },
  primaryBtnGradient: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center",
    paddingVertical: SIZES.hp(1.5),
    paddingHorizontal: SIZES.wp(5),
  },
  primaryBtnDisabled: { 
    ...SHADOWS.sm,
  },
  primaryBtnText: { 
    color: COLORS.white, 
    fontWeight: "700", 
    marginLeft: SIZES.wp(2) 
  },
});