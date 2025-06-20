import { RecognitionType } from '@/types';

export const RECOGNITION_TYPES: RecognitionType[] = [
  { emoji: '🙏', label: 'Obrigado!', value: '🙏 Obrigado!' },
  { emoji: '🙌', label: 'Bom trabalho!', value: '🙌 Bom trabalho!' },
  { emoji: '😍', label: 'Impressionante!', value: '😍 Impressionante!' },
  { emoji: '✨', label: 'Extraordinário!', value: '✨ Extraordinário!' },
];

export const POSTS_PER_PAGE = 5;

export const DEFAULT_AVATAR = 'https://randomuser.me/api/portraits/lego/1.jpg'; 

export const TOAST_OPTIONS = {
  duration: 4000,
  style: {
    background: '#ffffff',
    color: '#374151',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    fontSize: '14px',
    maxWidth: '400px',
    fontFamily: 'var(--font-poppins)',
  },
  success: {
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid #d1fae5',
      background: '#f0fdf4',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid #fecaca',
      background: '#fef2f2',
    },
  },
};