import { useState } from 'react';

export const useFormHandler = <T extends Record<string, any>>(
  initialState: T
) => {
  const [formData, setFormData] = useState<T>(initialState);
  
  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const reset = () => setFormData(initialState);
  
  const isFieldEmpty = (field: keyof T): boolean => {
    const value = formData[field];
    return !value || (typeof value === 'string' && value.trim() === '');
  };

  const getFieldValue = (field: keyof T): T[keyof T] => {
    return formData[field];
  };

  const hasChanges = (): boolean => {
    return JSON.stringify(formData) !== JSON.stringify(initialState);
  };

  return { 
    formData, 
    updateField, 
    reset, 
    isFieldEmpty,
    getFieldValue,
    hasChanges
  };
};