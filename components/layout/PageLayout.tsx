import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { GradientHeader } from '../common/GradientHeader';
import { HeroSection } from '../common/HeroSection';
import { COLORS, SIZES, SPACING } from '../../constants/styles';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle = "Size yardımcı olmaktan mutluluk duyarım",
  heroTitle,
  heroSubtitle,
  children,
  showBackButton = true,
  rightComponent,
}) => {
  return (
    <View style={styles.container}>
      <GradientHeader
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        rightComponent={rightComponent}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {heroTitle && heroSubtitle && (
          <HeroSection title={heroTitle} subtitle={heroSubtitle} />
        )}
        
        <View style={styles.content}>
          {children}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.isSmallScreen ? SPACING.md : SPACING.lg,
    paddingBottom: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
});