import { COLORS } from './styles';

export const UI_CONSTANTS = {
  GRID: {
    DEFAULT_COLUMNS: 2,
    MOBILE_COLUMNS: 1,
    DEFAULT_SPACING: 12,
  },
  CARD: {
    MIN_HEIGHT: 120,
    BORDER_RADIUS: 16,
    ICON_SIZE: 24,
    ICON_SIZE_SMALL: 20,
  },
  INPUT: {
    MIN_HEIGHT: 120,
    MAX_LENGTH: 500,
    COUNTER_THRESHOLD: 50,
  },
  BREAKPOINTS: {
    SMALL: 380,
    MEDIUM: 768,
    LARGE: 1024,
  },
} as const;

export const OPTION_SETS = {
  DEPREM_ANINDA: [
    { 
      id: "evde", 
      title: "Evde", 
      icon: "home-outline" as const, 
      colors: ['#4facfe', '#00f2fe'] as [string, string] 
    },
    { 
      id: "yolda", 
      title: "Yolda", 
      icon: "car-outline" as const, 
      colors: ['#43e97b', '#38f9d7'] as [string, string] 
    },
    { 
      id: "binada", 
      title: "Dışarda bir binada", 
      icon: "business-outline" as const, 
      colors: ['#fa709a', '#fee140'] as [string, string] 
    },
    { 
      id: "diger", 
      title: "Diğer", 
      icon: "create-outline" as const, 
      colors: ['#a8edea', '#fed6e3'] as [string, string] 
    },
  ],
  YARALANMALAR: [
    { 
      id: "kirik", 
      title: "Kırık", 
      icon: "medical-outline" as const, 
      colors: [COLORS.success, COLORS.successDark] as [string, string] 
    },
    { 
      id: "bayilma", 
      title: "Bayılma", 
      icon: "heart-outline" as const, 
      colors: ['#f4b5d4', '#cf518a'] as [string, string] 
    },
    { 
      id: "kanama", 
      title: "Kanama", 
      icon: "water-outline" as const, 
      colors: [COLORS.info, COLORS.infoDark] as [string, string] 
    },
    { 
      id: "diger", 
      title: "Diğer", 
      icon: "help-circle-outline" as const, 
      colors: ['#9c85d1', '#8859d7'] as [string, string] 
    },
  ],
  DEPREM_SONRASI: [
    { 
      id: "hasar", 
      title: "Evde hasar varsa ne yapmalıyım?", 
      icon: "home-outline" as const, 
      colors: ['#4facfe', '#00f2fe'] as [string, string] 
    },
    { 
      id: "aile", 
      title: "Aileyi nasıl bulurum?", 
      icon: "people-outline" as const, 
      colors: ['#43e97b', '#38f9d7'] as [string, string] 
    },
    { 
      id: "altyapi", 
      title: "Su ve elektrik kesilince?", 
      icon: "water-outline" as const, 
      colors: ['#fa709a', '#fee140'] as [string, string] 
    },
    { 
      id: "ilkyardim", 
      title: "İlk yardım nasıl yapılır?", 
      icon: "medical-outline" as const, 
      colors: ['#a8edea', '#fed6e3'] as [string, string] 
    },
  ],
  IHTIYACLAR_PRESETS: [
    { 
      id: "2kisi", 
      title: "2 Kişi", 
      icon: "people" as const, 
      colors: [COLORS.info, COLORS.infoDark] as [string, string],
      people: "2",
      days: "3"
    },
    { 
      id: "4kisi", 
      title: "4 Kişilik Aile", 
      icon: "home" as const, 
      colors: [COLORS.success, COLORS.successDark] as [string, string],
      people: "4",
      days: "7"
    },
    { 
      id: "6kisi", 
      title: "6+ Kişi", 
      icon: "business" as const, 
      colors: [COLORS.warning, COLORS.warningDark] as [string, string],
      people: "6",
      days: "7"
    },
  ],
  ESSENTIAL_CATEGORIES: [
    { 
      id: "su",
      icon: "water" as const, 
      title: "Su Rezervi", 
      desc: "Kişi başı günde 4 litre", 
      colors: ['#06b6d4', '#0891b2'] as [string, string]
    },
    { 
      id: "gida",
      icon: "restaurant" as const, 
      title: "Gıda Stoku", 
      desc: "Konserve, kuru gıda", 
      colors: ['#84cc16', '#65a30d'] as [string, string]
    },
    { 
      id: "saglik",
      icon: "medical" as const, 
      title: "İlk Yardım", 
      desc: "Temel sağlık malzemeleri", 
      colors: [COLORS.error, COLORS.errorDark] as [string, string]
    },
    { 
      id: "araclar",
      icon: "flashlight" as const, 
      title: "Acil Araçlar", 
      desc: "Fener, radyo, pil", 
      colors: [COLORS.warning, COLORS.warningDark] as [string, string]
    },
  ],
} as const;