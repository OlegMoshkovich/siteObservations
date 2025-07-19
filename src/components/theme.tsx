import { useUIStore } from '../state/slices/uiSlice';

export const colors = {
  primary: '#000000',
  secondary: '#FFFFFF',
}

const baseTheme = {
  colors,
  borderRadius: 0,
  fontSize: 16,
  fontWeight: 'normal',
}

// Hook to get theme with dynamic primary color
export const useTheme = () => {
  const { primaryColor, borderRadius } = useUIStore();
  
  return {
    ...baseTheme,
    colors: {
      ...colors,
      primary: primaryColor,
    },
    borderRadius,
  };
};

// Default theme for components that don't use the hook
const theme = baseTheme;

export default theme;