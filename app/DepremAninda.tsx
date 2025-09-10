import React from 'react';
import { QuestionFlowScreen } from '../components/screens/QuestionFlowScreen';
import { PROMPTS } from '../utils/prompts';
import { OPTION_SETS } from '../constants/ui';
import { COLORS } from '../constants/styles';

export default function DepremAninda() {
  return (
    <QuestionFlowScreen
      pageTitle="Deprem Anında"
      pageSubtitle="Anlık hayat kurtaran öneriler"
      heroTitle="Durumunu Seç"
      heroSubtitle="Hızlı müdahale için durumunu belirle ve hayat kurtaran bilgileri al"
      optionSet={OPTION_SETS.DEPREM_ANINDA}
      generatePrompt={PROMPTS.DEPREM_ANINDA}
      responseCardTitle="📍 Hayat Kurtaran Bilgiler"
      responseCardSubtitle="Anlık duruma özel acil müdahale"
      responseCardIcon="shield-checkmark"
      responseCardIconColors={[COLORS.success, COLORS.successDark]}
      responseCardWarning="🚨 Acil durumlarda 112'yi aramayı unutmayın. Sakin olun, panik yapmayın."
    />
  );
}