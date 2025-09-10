import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SIZES, SPACING } from '../../constants/styles';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  subtitle = 'Size yardımcı olmaktan mutluluk duyarım',
  showBackButton = true,
  rightComponent,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isSmallScreen, isMediumScreen } = SIZES;

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
    >
      <View style={styles.headerContent}>
        {showBackButton ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        
        <View style={styles.titleContainer}>
          <Text style={[
            styles.headerTitle,
            { 
              fontSize: isSmallScreen ? 18 : isMediumScreen ? 20 : 22 
            }
          ]}>
            {title}
          </Text>
        </View>
        
        {rightComponent || <View style={styles.rightPlaceholder} />}
      </View>
      
      {subtitle && (
        <View style={styles.headerSubtitleContainer}>
          <Text style={[
            styles.headerSubtitle,
            { fontSize: isSmallScreen ? 12 : 14 }
          ]}>
            {subtitle}
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: SPACING.xs,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSubtitleContainer: {
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  rightPlaceholder: {
    width: 40,
  },
});