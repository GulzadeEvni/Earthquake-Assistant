import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PageLayout } from '../layout/PageLayout';
import { OptionGrid } from '../layout/OptionGrid';
import { CustomInputSection } from '../shareds/CustomInputSection';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { ResponseCard } from '../common/ResponseCard';
import { useAIRequest } from '../../hooks/useAIRequest';
import { useFormHandler } from '../../hooks/useFormHandler';
import { COLORS, SIZES, SPACING } from '../../constants/styles';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
}

interface QuestionFlowScreenProps {
  pageTitle: string;
  pageSubtitle?: string;
  heroTitle: string;
  heroSubtitle: string;
  optionSet: readonly Option[];
  generatePrompt: (userInput: string) => string;
  responseCardTitle: string;
  responseCardSubtitle: string;
  responseCardIcon: string;
  responseCardIconColors: [string, string];
  responseCardWarning: string;
  customInputTitle?: string;
  customInputPlaceholder?: string;
  customInputButtonColors?: [string, string];
}

interface FormState {
  selectedOption: string | null;
  customText: string;
}

export const QuestionFlowScreen: React.FC<QuestionFlowScreenProps> = ({
  pageTitle,
  pageSubtitle = "Size yardımcı olmaktan mutluluk duyarım",
  heroTitle,
  heroSubtitle,
  optionSet,
  generatePrompt,
  responseCardTitle,
  responseCardSubtitle,
  responseCardIcon,
  responseCardIconColors,
  responseCardWarning,
  customInputTitle = "Özel Durum",
  customInputPlaceholder = "Durumunu detaylı açıkla...",
  customInputButtonColors = [COLORS.primary, COLORS.primaryDark],
}) => {
  const { formData, updateField, reset: resetForm } = useFormHandler<FormState>({
    selectedOption: null,
    customText: "",
  });
  
  const { loading, response, makeRequest, reset: resetAI } = useAIRequest();

  const handleOptionSelect = async (optionId: string) => {
    updateField('selectedOption', optionId);
    
    if (optionId !== "diger") {
      const option = optionSet.find(opt => opt.id === optionId);
      if (option) {
        const systemPrompt = generatePrompt(option.title);
        await makeRequest(`${option.title} için ne yapmalıyım?`, systemPrompt);
      }
    }
  };

  const handleCustomSubmit = async () => {
    const systemPrompt = generatePrompt(formData.customText);
    await makeRequest("Özel durum için ne yapmalıyım?", systemPrompt);
  };

  const handleNewRequest = () => {
    resetForm();
    resetAI();
  };

  return (
    <PageLayout
      title={pageTitle}
      subtitle={pageSubtitle}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
    >
      <View style={styles.container}>
        <OptionGrid
          options={optionSet}
          selectedOption={formData.selectedOption}
          onSelect={handleOptionSelect}
          disabled={loading}
        />

        {formData.selectedOption === "diger" && (
          <CustomInputSection
            title={customInputTitle}
            placeholder={customInputPlaceholder}
            value={formData.customText}
            onChange={(text) => updateField('customText', text)}
            onSubmit={handleCustomSubmit}
            loading={loading}
            buttonColors={customInputButtonColors}
          />
        )}

        {loading && (
          <LoadingIndicator
            title="Analiz Ediliyor"
            subtitle="Durumuna özel tavsiyeleri hazırlıyoruz..."
          />
        )}

        {response && (
          <ResponseCard
            title={responseCardTitle}
            subtitle={responseCardSubtitle}
            content={response}
            icon={responseCardIcon}
            iconColors={responseCardIconColors}
            warningText={responseCardWarning}
            onNewRequest={handleNewRequest}
          />
        )}
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
});