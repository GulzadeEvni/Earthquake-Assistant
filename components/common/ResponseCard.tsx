import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING, SHADOWS } from '../../constants/styles';

interface ResponseCardProps {
  title: string;
  subtitle: string;
  content: string;
  icon: string;
  iconColors: [string, string];
  warningText?: string;
  onNewRequest?: () => void;
  onSave?: () => void;
  emergencyNumber?: string;
}

export const ResponseCard: React.FC<ResponseCardProps> = ({
  title,
  subtitle,
  content,
  icon,
  iconColors,
  warningText = '🚨 Acil durumlarda 112\'yi aramayı unutmayın',
  onNewRequest,
  onSave,
  emergencyNumber = '112',
}) => {
  const { isSmallScreen } = SIZES;

  const callEmergency = () => {
    Linking.openURL(`tel:${emergencyNumber}`);
  };

  const formatContent = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <Text key={index} style={[styles.boldText, styles.sectionTitle]}>
            {line.replace(/\*\*/g, '')}
          </Text>
        );
      } else if (line.startsWith('•')) {
        return (
          <Text key={index} style={styles.listItem}>
            {line}
          </Text>
        );
      } else if (line.trim() === '') {
        return <View key={index} style={styles.emptyLine} />;
      } else {
        return (
          <Text key={index} style={styles.regularText}>
            {line}
          </Text>
        );
      }
    });
  };

  return (
    <View style={[styles.responseCard, SHADOWS.lg]}>
      <LinearGradient
        colors={[COLORS.white, COLORS.gray100]}
        style={[styles.responseContent, { padding: isSmallScreen ? SPACING.md : SPACING.lg }]}
      >
        <View style={[styles.responseHeader, { marginBottom: isSmallScreen ? SPACING.md : SPACING.lg }]}>
          <View style={[styles.responseIconContainer, { marginRight: isSmallScreen ? SPACING.sm : SPACING.md }]}>
            <LinearGradient
              colors={iconColors}
              style={[
                styles.responseIconGradient,
                {
                  width: isSmallScreen ? 40 : 48,
                  height: isSmallScreen ? 40 : 48,
                }
              ]}
            >
              <Ionicons name={icon as any} size={isSmallScreen ? 20 : 24} color={COLORS.white} />
            </LinearGradient>
          </View>
          <View style={styles.responseHeaderText}>
            <Text style={[
              styles.responseTitle,
              { fontSize: isSmallScreen ? 18 : 20 }
            ]}>
              {title}
            </Text>
            <Text style={[
              styles.responseSubtitle,
              { fontSize: isSmallScreen ? 12 : 14 }
            ]}>
              {subtitle}
            </Text>
          </View>
        </View>
        
        <View style={[styles.responseDivider, { marginBottom: isSmallScreen ? SPACING.md : SPACING.lg }]} />
        
        <ScrollView style={{ maxHeight: 320 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {formatContent(content)}
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={[styles.emergencyButton, { marginBottom: SPACING.md, marginTop: SPACING.sm }]}
          onPress={callEmergency}
        >
          <LinearGradient
            colors={[COLORS.error, COLORS.errorDark]}
            style={styles.emergencyButtonGradient}
          >
            <Ionicons name="call" size={20} color={COLORS.white} />
            <Text style={styles.emergencyButtonText}>
              🚨 Acil Ara: {emergencyNumber}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {warningText && (
          <View style={[
            styles.warningBanner,
            { padding: isSmallScreen ? SPACING.sm : SPACING.md }
          ]}>
            <Ionicons name="alert-circle" size={isSmallScreen ? 14 : 16} color={COLORS.warning} />
            <Text style={[
              styles.warningText,
              {
                fontSize: isSmallScreen ? 12 : 14,
                marginLeft: isSmallScreen ? SPACING.xs : SPACING.sm
              }
            ]}>
              {warningText}
            </Text>
          </View>
        )}
        
        {(onNewRequest || onSave) && (
          <View style={styles.actionButtons}>
            {onNewRequest && (
              <TouchableOpacity style={styles.actionButton} onPress={onNewRequest}>
                <LinearGradient
                  colors={[COLORS.success, '#059669']}
                  style={[
                    styles.actionButtonGradient,
                    {
                      paddingHorizontal: isSmallScreen ? SPACING.md : SPACING.lg,
                      paddingVertical: isSmallScreen ? SPACING.sm : SPACING.md
                    }
                  ]}
                >
                  <Ionicons name="refresh" size={isSmallScreen ? 14 : 16} color={COLORS.white} />
                  <Text style={[
                    styles.actionButtonText,
                    {
                      fontSize: isSmallScreen ? 12 : 14,
                      marginLeft: isSmallScreen ? SPACING.xs : SPACING.sm
                    }
                  ]}>
                    Yeni Sorgu
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
            
            {onSave && (
              <TouchableOpacity style={[styles.actionButton, { marginLeft: SPACING.sm }]} onPress={onSave}>
                <LinearGradient
                  colors={[COLORS.info, '#2563eb']}
                  style={[
                    styles.actionButtonGradient,
                    {
                      paddingHorizontal: isSmallScreen ? SPACING.md : SPACING.lg,
                      paddingVertical: isSmallScreen ? SPACING.sm : SPACING.md
                    }
                  ]}
                >
                  <Ionicons name="save" size={isSmallScreen ? 14 : 16} color={COLORS.white} />
                  <Text style={[
                    styles.actionButtonText,
                    {
                      fontSize: isSmallScreen ? 12 : 14,
                      marginLeft: isSmallScreen ? SPACING.xs : SPACING.sm
                    }
                  ]}>
                    Kaydet
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  responseCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: SPACING.lg,
  },
  responseContent: {},
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  responseIconContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  responseIconGradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  responseHeaderText: {
    flex: 1,
  },
  responseTitle: {
    fontWeight: '800',
    color: COLORS.gray800,
    marginBottom: SPACING.xs,
  },
  responseSubtitle: {
    color: COLORS.gray600,
    fontWeight: '500',
  },
  responseDivider: {
    height: 1,
    backgroundColor: COLORS.gray300,
  },
  contentContainer: {
    padding: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    color: COLORS.primary,
  },
  boldText: {
    fontWeight: '800',
    color: COLORS.gray800,
  },
  listItem: {
    fontSize: 14,
    color: COLORS.gray700,
    marginLeft: SPACING.md,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  regularText: {
    fontSize: 14,
    color: COLORS.gray700,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  emptyLine: {
    height: SPACING.sm,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: SPACING.lg,
  },
  warningText: {
    color: '#92400e',
    fontWeight: '600',
    flex: 1,
  },
  emergencyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  emergencyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  emergencyButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    marginLeft: SPACING.sm,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});