import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../constants/styles';

interface LoadingIndicatorProps {
  title?: string;
  subtitle?: string;
  size?: 'small' | 'large';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  title = 'Analiz Ediliyor',
  subtitle = 'Lütfen bekleyin...',
  size = 'large',
}) => {
  const { isSmallScreen } = SIZES;

  return (
    <View style={styles.loadingCard}>
      <LinearGradient
        colors={[COLORS.white, COLORS.gray100]}
        style={[styles.loadingContent, { padding: isSmallScreen ? SPACING.lg : SPACING.xl }]}
      >
        <View style={styles.loadingAnimation}>
          <ActivityIndicator size={isSmallScreen ? 'small' : size} color={COLORS.primary} />
          <View style={[
            styles.pulseCircle,
            {
              width: isSmallScreen ? 50 : 60,
              height: isSmallScreen ? 50 : 60,
              borderRadius: isSmallScreen ? 25 : 30,
            }
          ]} />
        </View>
        <Text style={[
          styles.loadingTitle,
          { fontSize: isSmallScreen ? 18 : 20 }
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.loadingSubtitle,
          { fontSize: isSmallScreen ? 14 : 16 }
        ]}>
          {subtitle}
        </Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: SPACING.lg,
    ...SHADOWS.md,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingAnimation: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  pulseCircle: {
    position: 'absolute',
    top: -15,
    left: -15,
    backgroundColor: 'rgba(111,177,252,0.2)',
    opacity: 0.6,
  },
  loadingTitle: {
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  loadingSubtitle: {
    color: COLORS.gray600,
    textAlign: 'center',
  },
});