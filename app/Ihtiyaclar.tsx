import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Text, Alert, Platform, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GradientHeader } from "../components/common/GradientHeader";
import { HeroSection } from "../components/common/HeroSection";
import { GradientCard } from "../components/common/GradientCard";
import { InputCard } from "../components/common/InputCard";
import { LoadingIndicator } from "../components/common/LoadingIndicator";
import { ResponseCard } from "../components/common/ResponseCard";
import { ResponsiveGrid } from "../components/common/ResponsiveGrid";
import { useIhtiyacPlani } from "../hooks/useIhtiyacPlani";
import { COLORS, SIZES, SPACING, SHADOWS } from "../constants/styles";
import { OPTION_SETS } from "../constants/ui";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function Ihtiyaclar() {
  const router = useRouter();
  const {
    state: { peopleCount, days, specialNeeds },
    loading,
    result,
    updateField,
    applyPreset,
    generatePlan,
    reset,
  } = useIhtiyacPlani();

  const handleSave = async () => {
  if (!result) {
    Alert.alert('Uyarı', 'Kaydedilecek bir plan bulunamadı. Önce planı oluşturun.');
    return;
  }

  try {

    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('tr-TR').replace(/\//g, '-');
    const timeStr = currentDate.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }).replace(':', '-');
    
    const fileName = `Deprem_Plani_${dateStr}_${timeStr}.txt`;

  
    const fileContent = `
╔════════════════════════════════════════════════════════════════╗
║                    DEPREM HAZIRLIK PLANI                      ║
╚════════════════════════════════════════════════════════════════╝

📅 Oluşturulma Tarihi: ${currentDate.toLocaleString('tr-TR')}
👥 Kişi Sayısı: ${peopleCount}
📆 Gün Sayısı: ${days}
${specialNeeds ? `🏥 Özel İhtiyaçlar: ${specialNeeds}` : ''}

═══════════════════════════════════════════════════════════════════

DETAYLI HAZIRLIK PLANI:

${result}

═══════════════════════════════════════════════════════════════════

⚠️  ÖNEMLİ HATIRLATMA:
Bu plan genel bilgi amaçlıdır. Bölgesel koşulları ve özel 
ihtiyaçlarınızı göz önünde bulundurun.

📱 Bu plan mobil uygulama tarafından oluşturulmuştur.
    `;

    
    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, fileContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log('Dosya kaydedildi:', fileUri);

 
    let message = `Plan "${fileName}" olarak kaydedildi. `;
    
    if (Platform.OS === 'android') {
      message += 'Dosyayı paylaş butonu ile diğer uygulamalara aktarabilirsiniz.';
    } else {
      message += 'Dosyayı paylaş butonu ile diğer uygulamalara aktarabilirsiniz.';
    }

    Alert.alert(
      'Başarılı! ✅',
      message,
      [
        {
          text: 'Dosyayı Paylaş',
          onPress: async () => {
            try {
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                  mimeType: 'text/plain',
                  dialogTitle: 'Deprem Hazırlık Planını Paylaş',
                  UTI: 'public.plain-text'
                });
              } else {
                Alert.alert('Hata', 'Paylaşım özelliği bu cihazda desteklenmiyor.');
              }
            } catch (shareError) {
              console.error('Paylaşım hatası:', shareError);
              Alert.alert('Hata', 'Dosya paylaşılırken bir hata oluştu.');
            }
          }
        },
        {
          text: 'Dosya İçeriğini Görüntüle',
          onPress: () => {
            Alert.alert(
              'Deprem Planı',
              fileContent,
              [
                { text: 'Kapat', style: 'cancel' }
              ],
              { cancelable: true }
            );
          }
        },
        { 
          text: 'Tamam', 
          style: 'default',
          onPress: () => {
            
            console.log('Dosya yolu:', fileUri);
          }
        }
      ]
    );

  } catch (error) {
    console.error('Dosya kaydetme hatası:', error);
    Alert.alert(
      'Hata ❌',
      'Plan dosya olarak kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.',
      [{ text: 'Tamam', style: 'default' }]
    );
  }
};

  return (
    <View style={styles.container}>
      <GradientHeader
        title="İhtiyaç Planlama"
        subtitle="Kişiselleştirilmiş deprem hazırlık rehberi"
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: SIZES.screenWidth * 0.05 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection
          title="Hazırlık Planı"
          subtitle="Aile büyüklüğünüze göre kişiselleştirilmiş deprem hazırlık listesi oluşturun"
        />

        <View style={styles.content}>
          {/* Quick Presets */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Hızlı Seçenekler</Text>
            <ResponsiveGrid columns={3} spacing={SPACING.sm}>
              {OPTION_SETS.IHTIYACLAR_PRESETS.map((preset, idx) => (
                <GradientCard
                  key={idx}
                  title={preset.title}
                  icon={preset.icon}
                  colors={preset.colors}
                  onPress={() => applyPreset(preset.people, preset.days)}
                  size={SIZES.isSmallScreen ? 90 : 110}
                  minHeight={SIZES.isSmallScreen ? 70 : 80}
                />
              ))}
            </ResponsiveGrid>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <LinearGradient colors={COLORS.gradientCard} style={styles.formCard}>
              <View style={styles.formHeader}>
                <Ionicons name="construct" size={20} color={COLORS.success} />
                <Text style={styles.formHeaderText}>Özelleştirin</Text>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Kişi Sayısı</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="people" size={18} color={COLORS.success} />
                    <TextInput
                      value={peopleCount}
                      onChangeText={(text) => updateField('peopleCount', text)}
                      keyboardType="number-pad"
                      style={styles.numberInput}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Gün Sayısı</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="calendar" size={18} color={COLORS.success} />
                    <TextInput
                      value={days}
                      onChangeText={(text) => updateField('days', text)}
                      keyboardType="number-pad"
                      style={styles.numberInput}
                    />
                  </View>
                </View>
              </View>

              <InputCard
                title=""
                icon="medical"
                label="Özel İhtiyaçlar"
                placeholder="İlaçlar, bebek maması, özel diyet gereksinimleri, alerjiler..."
                value={specialNeeds}
                onChangeText={(text) => updateField('specialNeeds', text)}
                multiline
                minHeight={90}
                showCounter
                maxLength={300}
              />

              <TouchableOpacity
                disabled={loading}
                onPress={generatePlan}
                activeOpacity={0.85}
                style={[styles.generateButton, loading && { opacity: 0.9 }]}
              >
                <LinearGradient 
                  colors={loading ? [COLORS.gray400, COLORS.gray500] : [COLORS.success, COLORS.successDark]} 
                  style={styles.generateButtonGradient}
                >
                  <Ionicons name={loading ? "hourglass" : "create"} size={18} color="#fff" />
                  <Text style={styles.generateButtonText}>
                    {loading ? "Plan Hazırlanıyor..." : "Planı Oluştur"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temel İhtiyaç Kategorileri</Text>
            <View style={styles.categoriesContainer}>
              {OPTION_SETS.ESSENTIAL_CATEGORIES.map((cat, i) => (
                <View key={i} style={styles.categoryCard}>
                  <LinearGradient colors={[cat.colors[0] + '20', cat.colors[0] + '10']} style={styles.categoryGradient}>
                    <View style={[styles.categoryIcon, { backgroundColor: cat.colors[0] }]}>
                      <Ionicons name={cat.icon} size={18} color="#fff" />
                    </View>
                    <Text style={styles.categoryTitle} numberOfLines={1} adjustsFontSizeToFit>{cat.title}</Text>
                    <Text style={styles.categoryDesc} numberOfLines={2} adjustsFontSizeToFit>{cat.desc}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          {/* Loading */}
          {loading && (
            <LoadingIndicator
              title="📊 Plan Hazırlanıyor"
              subtitle="Kişiselleştirilmiş hazırlık listesi oluşturuluyor..."
            />
          )}

          {/* Response */}
          {result && !loading && (
            <ResponseCard
              title="Kişiselleştirilmiş Plan"
              subtitle={`👥 ${peopleCount} kişilik aile için ${days} günlük hazırlık`}
              content={result}
              icon="clipboard"
              iconColors={[COLORS.info, COLORS.infoDark]}
              warningText="Bu plan genel bilgi amaçlıdır. Bölgesel koşulları ve özel ihtiyaçlarınızı göz önünde bulundurun."
              onNewRequest={reset}
              onSave={handleSave}
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
    backgroundColor: COLORS.backgroundLight 
  },
  scrollContent: { 
    flexGrow: 1, 
    paddingBottom: SPACING.xxxl 
  },
  content: { 
    paddingHorizontal: SPACING.lg, 
    paddingTop: SPACING.xs, 
    paddingBottom: SPACING.xxxl, 
    alignSelf: 'center', 
    width: '100%', 
    maxWidth: 680 
  },
  section: { 
    marginTop: SPACING.xs, 
    marginBottom: SPACING.lg 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: COLORS.textPrimary, 
    marginBottom: SPACING.sm, 
    textAlign: 'center' 
  },
  formSection: { 
    marginBottom: SPACING.lg 
  },
  formCard: { 
    borderRadius: 16, 
    padding: SPACING.lg, 
    ...SHADOWS.md 
  },
  formHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: SPACING.sm 
  },
  formHeaderText: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginLeft: SPACING.sm, 
    color: COLORS.textPrimary 
  },
  inputRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: SPACING.sm
  },
  inputGroup: { 
    flex: 1, 
    marginRight: SPACING.sm 
  },
  inputLabel: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    fontWeight: '600', 
    marginBottom: SPACING.sm 
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    borderRadius: 12, 
    paddingHorizontal: SPACING.sm, 
    paddingVertical: SPACING.sm, 
    borderWidth: 1, 
    borderColor: '#e6f4ea' 
  },
  numberInput: { 
    flex: 1, 
    marginLeft: SPACING.sm, 
    fontSize: 16, 
    textAlign: 'center', 
    color: COLORS.textPrimary 
  },
  generateButton: { 
    borderRadius: 12, 
    overflow: 'hidden', 
    marginTop: SPACING.sm,
    ...SHADOWS.md
  },
  generateButtonGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: SPACING.sm 
  },
  generateButtonText: { 
    color: '#fff', 
    marginLeft: SPACING.sm, 
    fontSize: 16, 
    fontWeight: '700' 
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  categoryCard: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
    width: SIZES.isSmallScreen ? '100%' : '48%',
    height: 120,
  },
  categoryGradient: { 
    padding: SPACING.sm, 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1,
  },
  categoryIcon: { 
    width: 38, 
    height: 38, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: SPACING.sm 
  },
  categoryTitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: COLORS.textPrimary, 
    textAlign: 'center',
    height: 20,
    lineHeight: 18,
  },
  categoryDesc: { 
    fontSize: 12, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginTop: SPACING.xs,
    height: 30,
    lineHeight: 15,
  },
});