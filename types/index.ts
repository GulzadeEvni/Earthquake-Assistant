import Ionicons from 'react-native-vector-icons/Ionicons';
import glyphMap from 'react-native-vector-icons/Ionicons';
export type IconName = keyof typeof glyphMap;

export interface AIResponse {
  success: boolean;
  message: string;
  timestamp: Date;
}

export interface ButtonItem {
  title: string;
  type?: string;
  page?: string;
  icon: IconName;
}

export interface GradientCardProps {
  title: string;
  icon: IconName;
  colors: [string, string];
  onPress: () => void;
  size?: number;
  isSelected?: boolean;
}

export interface ToplanmaAlani {
 id: string;
  ad: string;
  kategoriAdi?: string;
  il: string;
  ilce: string;
  mahalle: string;
  durum?: string;
  boylam: number;
  enlem: number;
  elektrik?: string;
  kullanımAlani?: number;
  otomatikHesaplananAlan?: number;
  su?: string;
  tabelaKod?: string;
  toplamAlan?: number;
  toplamÇadırKonteynerSayısı?: string;
  tur?: string;
  veriUretim?: string;
  wcKanalizasyon?: string;
  yolDurumu?: string;
  yol?: string;
  kapiNo?: string;
  aciklama?: string;
}