import React from 'react';
import { View, StyleSheet, Dimensions, DimensionValue } from 'react-native';
import { GradientCard } from '../common/GradientCard';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, SIZES } from '../../constants/styles';

const { width } = Dimensions.get('window');

interface Option {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
}

interface OptionGridProps {
  options: readonly Option[];
  selectedOption?: string | null;
  onSelect: (optionId: string) => void;
  columns?: number;
  spacing?: number;
  disabled?: boolean;
}

export const OptionGrid: React.FC<OptionGridProps> = ({
  options,
  selectedOption,
  onSelect,
  columns = 2,
  spacing = 16,
  disabled = false,
}) => {
  const isSmallScreen = width < 380;
  const actualColumns = isSmallScreen ? 1 : columns;
  const shouldCenter = options.length < columns && !isSmallScreen;
  
  const getItemWidth = (): DimensionValue => {
    if (isSmallScreen) return '90%';
    if (shouldCenter) return `${100 / columns}%`;
    return `${100 / actualColumns - ((spacing * (actualColumns - 1)) / actualColumns)}%`;
  };

  return (
    <View style={[
      styles.grid,
      { gap: spacing },
      shouldCenter && styles.centerGrid
    ]}>
      {options.map((option) => (
        <View key={option.id} style={[styles.gridItem, { width: getItemWidth() }]}>
          <GradientCard
            title={option.title}
            icon={option.icon}
            colors={option.colors}
            onPress={() => onSelect(option.id)}
            isSelected={selectedOption === option.id}
            disabled={disabled}
            minHeight={isSmallScreen ? 100 : 120}
            size={isSmallScreen ? 110 : 130}
            iconSize={28}
            fontSize={SIZES.isSmallScreen ? 14 : 16}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerGrid: {
    justifyContent: 'center',
  },
  gridItem: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
});