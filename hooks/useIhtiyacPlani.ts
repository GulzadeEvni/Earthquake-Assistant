import { useState } from 'react';
import { sendToAI } from '../utils/ai';
import { formatAIResponse } from '../utils/prompts';

export interface IhtiyacPlaniState {
  peopleCount: string;
  days: string;
  specialNeeds: string;
}

export const useIhtiyacPlani = () => {
  const [state, setState] = useState<IhtiyacPlaniState>({
    peopleCount: "2",
    days: "3",
    specialNeeds: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const updateField = <K extends keyof IhtiyacPlaniState>(field: K, value: IhtiyacPlaniState[K]) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (people: string, days: string) => {
    setState(prev => ({ ...prev, peopleCount: people, days: days }));
  };

  const generatePlan = async () => {
    if (!state.peopleCount.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const question = `Aile büyüklüğü: ${state.peopleCount}. Kalan gün sayısı (stok): ${state.days}. Özel ihtiyaçlar: ${state.specialNeeds || "yok"}. Lütfen su, gıda, ilaç, elektrik kesintisine yönelik önlemler ve alışveriş listesi (adetlerle) ver.`;
      
      const systemPrompt = `
Lütfen aşağıdaki yanıtı DÜZENLİ ve KATEGORİK şeklinde ver.
Her kategori için **kalın** başlıklar kullan.
Pratik ve uygulanabilir öneriler ver.
Emoji kullanarak görsel zenginlik kat.
Miktarları net belirt (litre, adet, kg olarak).

**📋 KİŞİSELLEŞTİRİLMİŞ DEPREM HAZIRLIK PLANI**

Kişi Sayısı: ${state.peopleCount}
Gün Sayısı: ${state.days}
Özel İhtiyaçlar: ${state.specialNeeds || "Yok"}

Lütfen aşağıdaki kategorilerde detaylı liste hazırla:
`.trim();

      const aiResponse = await sendToAI(question, systemPrompt);
      const formattedResponse = formatAIResponse(aiResponse);
      setResult(formattedResponse);
    } catch (err) {
      console.error(err);
      setResult("❌ Servisten cevap alınamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setState({ peopleCount: "2", days: "3", specialNeeds: "" });
    setResult(null);
  };

  return {
    state,
    loading,
    result,
    updateField,
    applyPreset,
    generatePlan,
    reset,
  };
};