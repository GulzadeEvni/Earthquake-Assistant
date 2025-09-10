import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../constants/styles';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  marginTop?: number;
  paddingVertical?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  marginTop,
  paddingVertical,
}) => {
  const { isSmallScreen, isMediumScreen } = SIZES;
  
  return (
    <View style={[
      styles.heroSection,
      { 
        paddingVertical: paddingVertical || (isSmallScreen ? SPACING.md : SPACING.xl),
        marginTop: marginTop || (isSmallScreen ? 10 : 20)
      }
    ]}>
      <Text style={[
        styles.heroTitle,
        { fontSize: isSmallScreen ? 24 : isMediumScreen ? 28 : 32 }
      ]}>
        {title}
      </Text>
      <Text style={[
        styles.heroSubtitle,
        { 
          fontSize: isSmallScreen ? 14 : 16,
          maxWidth: SIZES.screenWidth * 0.85
        }
      ]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    alignItems: "center",
  },
  heroTitle: {
    fontWeight: "900",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
});