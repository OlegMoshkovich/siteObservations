import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ButtonProps } from '../../types/types';
import { useTheme } from '../theme';

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  disabled,
  loading = false,
  variant = 'default',
}) => {
  const theme = useTheme();
  const isOutlined = variant === 'outlined';
  const isText = variant === 'text';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        !isText && { ...styles.button, backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius },
        isOutlined && { ...styles.outlined, borderColor: theme.colors.primary },
        isDisabled && (
          isText
            ? styles.textDisabled
            : isOutlined
              ? styles.outlinedDisabled
              : { ...styles.disabled, backgroundColor: theme.colors.primary }
        ),
        isText && styles.textButton,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={isText ? '#000' : '#fff'} 
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutlined && styles.outlinedText,
            isText && styles.textVariant,
            isDisabled && (
              isText
                ? styles.textVariantDisabled
                : isOutlined
                  ? styles.outlinedDisabledText
                  : styles.disabledText
            ),
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
  },
  disabled: {
    // backgroundColor will be set dynamically
    opacity: 0.5,
  },
  outlinedDisabled: {
    borderColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  outlinedText: {
    color: '#000',
  },
  disabledText: {
    color: '#000000',
  },
  outlinedDisabledText: {
    color: '#000000',
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // No border, no background
  },
  textVariant: {
    color: '#000',
  },
  textVariantDisabled: {
    color: '#000000',
  },
  textDisabled: {
    backgroundColor: 'transparent',
  },
});

export default Button;