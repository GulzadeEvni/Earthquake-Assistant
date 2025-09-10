import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../constants/styles';

interface InputCardProps extends TextInputProps {
  title: React.ReactNode; 
  icon: keyof typeof Ionicons.glyphMap;
  label?: string;
  multiline?: boolean;
  minHeight?: number;
  showCounter?: boolean;
  maxLength?: number;
}

export const InputCard: React.FC<InputCardProps> = ({
  title,
  icon,
  label,
  multiline = false,
  minHeight,
  showCounter = false,
  maxLength,
  value,
  ...textInputProps
}) => {
  const { isSmallScreen } = SIZES;
  const inputHeight = minHeight || (multiline ? (isSmallScreen ? 100 : 120) : 48);

  return (
    <LinearGradient 
      colors={COLORS.gradientCard} 
      style={[styles.card, { padding: isSmallScreen ? SPACING.md : SPACING.xl }]}
    >
      <View style={styles.inputHeader}>
        <Ionicons name={icon} size={isSmallScreen ? 20 : 24} color={COLORS.primary} />
        <View style={{ marginLeft: SPACING.sm }}>
          {title}
        </View>
      </View>

      {label && (
        <Text style={[styles.label, { fontSize: isSmallScreen ? 14 : 16 }]}>
          {label}
        </Text>
      )}

      <TextInput 
        value={value}
        style={[
          styles.input,
          { 
            fontSize: isSmallScreen ? 14 : 16,
            minHeight: inputHeight,
            padding: isSmallScreen ? SPACING.sm : SPACING.md,
          }
        ]} 
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        maxLength={maxLength}
        {...textInputProps}
      />

      {showCounter && maxLength && (
        <Text style={styles.counter}>
          {(value?.length || 0)} / {maxLength}
        </Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    ...SHADOWS.md,
    marginBottom: SPACING.lg,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  label: {
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  counter: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
});
