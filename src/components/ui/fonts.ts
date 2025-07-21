// app/ui/fonts.js
import { Lusitana } from 'next/font/google';

export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700'],  // tu peux choisir les poids nécessaires
  variable: '--font-lusitana', // optionnel si tu veux CSS variable
});
