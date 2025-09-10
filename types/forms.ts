export interface BaseFormState {
  selectedOption: string | null;
  customText: string;
}

export interface DepremAnindaFormState extends BaseFormState {}

export interface YaralanmalarFormState extends BaseFormState {}

export interface DepremSonrasiFormState {
  question: string;
}

export interface IhtiyaclarFormState {
  peopleCount: string;
  days: string;
  specialNeeds: string;
}

export interface SimulasyonFormState {
  currentStep: number;
  answers: Record<string, string>;
}

export interface AIRequestOptions {
  question: string;
  systemPrompt: string;
  onSuccess?: (response: string) => void;
  onError?: (error: string) => void;
}

export interface AIResponseState {
  loading: boolean;
  response: string | null;
  error: string | null;
}