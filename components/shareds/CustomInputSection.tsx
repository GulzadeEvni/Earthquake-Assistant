import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InputCard } from '../common/InputCard';
import { COLORS, SPACING, SHADOWS, SIZES } from '../../constants/styles';
import { UI_CONSTANTS } from '../../constants/ui';

interface CustomInputSectionProps {
  title?: string;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  buttonText?: string;
  buttonColors?: [string, string];
  maxLength?: number;
  minHeight?: number;
}

export const CustomInputSection: React.FC<CustomInputSectionProps> = ({
  title = "Özel Durum",
  placeholder = "Durumunu detaylı açıkla...",
  value,
  onChange,
  onSubmit,
  loading = false,
  buttonText = "Gönder",
  buttonColors = [COLORS.primary, COLORS.primaryDark],
  maxLength = UI_CONSTANTS.INPUT.MAX_LENGTH,
  minHeight = UI_CONSTANTS.INPUT.MIN_HEIGHT,
}) => {
  const canSubmit = value.trim() && !loading;

  return (
    <View style={styles.section}>
      <InputCard
        title={title}
        icon="create"
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        multiline
        minHeight={minHeight}
        showCounter
        maxLength={maxLength}
      />
      
      <TouchableOpacity 
        style={[styles.button, !canSubmit && styles.buttonDisabled]} 
        onPress={onSubmit}
        disabled={!canSubmit}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={canSubmit ? buttonColors : [COLORS.gray400, COLORS.gray500]}
          style={styles.buttonGradient}
        >
          <Text style={[
            styles.buttonText,
            { fontSize: SIZES.isSmallScreen ? 16 : 18 }
          ]}>
            {loading ? "Analiz Ediliyor..." : buttonText}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: SPACING.lg,
  },
  button: {
    borderRadius: UI_CONSTANTS.CARD.BORDER_RADIUS,
    overflow: "hidden",
    ...SHADOWS.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
    ...SHADOWS.sm,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});