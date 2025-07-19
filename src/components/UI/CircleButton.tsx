import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';

export interface CircleButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
  children?: React.ReactNode;
}

const CircleButton: React.FC<CircleButtonProps> = ({
  onPress,
  color,
  size = 20,
  style,
  disabled = false,
  children,
}) => {
  const theme = useTheme();
  const buttonColor = color || theme.colors.primary;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: buttonColor,
          width: size,
          height: size,
          borderRadius: theme.borderRadius,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  disabled: {
    opacity: 0.5,
  },
});

export default CircleButton; 