import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SPACING, SIZES } from '../../constants/styles';

export interface GradientCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string, ...string[]];
  onPress: () => void;
  size?: number;
  isSelected?: boolean;
  iconSize?: number;
  fontSize?: number;
  minHeight?: number;
  disabled?: boolean;
  badge?: React.ReactNode;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  title,
  icon,
  colors,
  onPress,
  size = 130,
  isSelected = false,
  iconSize = 28,
  fontSize = 16,
  minHeight = 120,
  disabled = false,
  badge,
}) => {
  const { isSmallScreen, isMediumScreen } = SIZES;
  
  const cardSize = size;
  const textSize = fontSize;
  const actualIconSize = iconSize;
  const cardMinHeight = minHeight;

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { 
          width: cardSize, 
          minHeight: cardMinHeight,
          margin: SPACING.sm,
        }, 
        disabled ? SHADOWS.sm : SHADOWS.md,
        disabled && styles.disabled
      ]}
      onPress={onPress}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
    >
      <LinearGradient
        colors={isSelected 
          ? [COLORS.primary, COLORS.primaryDark] 
          : disabled 
            ? [COLORS.gray300, COLORS.gray400]
            : colors
        }
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name={icon} 
            size={actualIconSize} 
            color={disabled ? COLORS.gray600 : COLORS.white} 
          />
        </View>
        <Text 
          style={[
            styles.title, 
            { 
              fontSize: textSize,
              marginTop: SPACING.xs,
            },
            disabled && styles.disabledText
          ]} 
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {title}
        </Text>
        {(isSelected || badge) && (
          <View style={styles.selectedBadge}>
            {badge || <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.sm,
    position: 'relative',
  },
  iconContainer: {
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  selectedBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  disabled: {
    opacity: 0.7,
  },
  disabledText: {
    color: COLORS.gray600,
  },
});