
import { useEffect } from 'react';

export const useUrduFonts = (language: string) => {
  useEffect(() => {
    if (language === 'ur') {
      // Load Urdu fonts dynamically
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Amiri:wght@400;700&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Apply Urdu font styles to body
      document.body.style.fontFamily = '"Noto Nastaliq Urdu", "Amiri", serif';
      document.body.style.direction = 'rtl';
      document.body.style.textAlign = 'right';

      return () => {
        document.body.style.fontFamily = '';
        document.body.style.direction = '';
        document.body.style.textAlign = '';
        document.head.removeChild(link);
      };
    }
  }, [language]);
};
