import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'outlined' | 'default' | 'text';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  disabled,
  variant = 'default',
}) => {
  const isOutlined = variant === 'outlined';
  const isText = variant === 'text';

  return (
    <TouchableOpacity
      style={[
        !isText && styles.button,
        isOutlined && styles.outlined,
        disabled && (
          isText
            ? styles.textDisabled
            : isOutlined
              ? styles.outlinedDisabled
              : styles.disabled
        ),
        isText && styles.textButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          isOutlined && styles.outlinedText,
          isText && styles.textVariant,
          disabled && (
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
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
    backgroundColor: '#ccc',
  },
  outlinedDisabled: {
    borderColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlinedText: {
    color: '#000',
  },
  disabledText: {
    color: '#999',
  },
  outlinedDisabledText: {
    color: '#ccc',
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
    fontWeight: '600',
  },
  textVariantDisabled: {
    color: '#ccc',
  },
  textDisabled: {
    // For disabled text button container, no background
    backgroundColor: 'transparent',
  },
});

export default Button;