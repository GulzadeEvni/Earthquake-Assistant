
export const HF_TOKEN = ""; // Hugging Face API Token
export const HF_MODEL = "openai/gpt-oss-120b:together";


const responseCache = new Map<string, { response: string; timestamp: number }>();

const getCachedResponse = (key: string): string | null => {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 dakika
    return cached.response;
  }
  return null;
};

const setCachedResponse = (key: string, response: string) => {
  responseCache.set(key, { response, timestamp: Date.now() });
};

export async function sendToAI(message: string, systemPrompt: string): Promise<string> {
  const cacheKey = `${systemPrompt}-${message}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  try {
    const payload = {
      model: HF_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("HF API error:", res.status, errorText);
      throw new Error(`API hatası: ${res.status}`);
    }

    const data = await res.json();
    
    if (data?.choices?.[0]?.message?.content) {
      const response = data.choices[0].message.content.trim();
      setCachedResponse(cacheKey, response);
      return response;
    }
    
    return "Üzgünüm, anlaşılır bir yanıt alınamadı. Lütfen daha sonra tekrar deneyin.";
  } catch (err: any) {
    console.error("sendToAI error:", err);
    
    if (err.name === 'AbortError') {
      return "⏰ Yanıt alma süresi aşıldı. Lütfen internet bağlantınızı kontrol edin.";
    }
    
    return "⚠️ Teknik bir sorun oluştu. Acil durumda 112'yi arayın.";
  }
}