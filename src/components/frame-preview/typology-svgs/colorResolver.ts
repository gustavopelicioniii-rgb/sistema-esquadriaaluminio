import type { AluminumColor } from './colors';

export type { AluminumColor };

// Default color fallback for safety
export const DEFAULT_ALUMINUM_COLOR: AluminumColor = {
  id: 'natural',
  name: 'Natural',
  hex: '#C0C0C0',
  frameColor: '#B8B8B8',
  frameDark: '#8A8A8A',
  frameLight: '#D4D4D4',
  glassColor: '#B8D4E8',
  glassOpacity: 0.35,
};
