import React from 'react';
import { QuestionFlowScreen } from '../components/screens/QuestionFlowScreen';
import { PROMPTS } from '../utils/prompts';
import { OPTION_SETS } from '../constants/ui';
import { COLORS } from '../constants/styles';

export default function Yaralanmalar() {
  return (
    <QuestionFlowScreen
      pageTitle="Yaralanmalar"
      pageSubtitle="Acil müdahale ve ilk yardım rehberi"
      heroTitle="İlk Yardım"
      heroSubtitle="Yaralanma türünü seçin ve acil müdahale talimatlarını alın"
      optionSet={OPTION_SETS.YARALANMALAR}
      generatePrompt={PROMPTS.YARALANMALAR}
      responseCardTitle="Acil Müdahale Talimatları"
      responseCardSubtitle="Profesyonel ilk yardım önerileri"
      responseCardIcon="medical"
      responseCardIconColors={[COLORS.error, COLORS.errorDark]}
      responseCardWarning="Ciddi yaralanmalarda hemen 112'yi arayın. Bilinçsiz müdahaleden kaçının."
      customInputTitle="Özel Yaralanma Durumu"
      customInputPlaceholder="Yaralanma detaylarını açıklayın (örn: kolunda kesik, başını çarptı...)"
      customInputButtonColors={[COLORS.error, COLORS.errorDark]}
    />
  );
}