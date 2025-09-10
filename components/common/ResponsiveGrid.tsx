import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: number;
  spacing?: number;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 2,
  spacing = 12,
}) => {
  const isSmallScreen = width < 380;
  const actualColumns = isSmallScreen ? 1 : columns;
  const childrenArray = React.Children.toArray(children);
  
 
  const shouldCenter = childrenArray.length < columns && !isSmallScreen;

  return (
    <View style={[
      styles.grid, 
      { 
        gap: spacing,
        justifyContent: shouldCenter ? 'center' : 'space-between'
      }
    ]}>
      {React.Children.map(children, (child, index) => (
        <View 
          style={[
            styles.gridItem, 
            { 
              width: isSmallScreen 
                ? '100%' 
                : shouldCenter 
                  ? `${100 / columns}%`  
                  : `${100 / columns - ((spacing * (columns - 1)) / columns)}%`
            }
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center', 
  },
  gridItem: {
    marginBottom: 12,
    alignItems: 'center', 
  },
});