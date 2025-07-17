import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { IconButtonProps } from '../../types/types';

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  variant,
  onPress,
  size = 24,
}) => {
  // Simple icon mapping - in a real app, you'd use a proper icon library
  const getIcon = (name: string) => {
    const icons: { [key: string]: string } = {
      heart: '♥',
      star: '★',
      plus: '+',
      minus: '-',
      check: '✓',
      close: '✕',
    };
    return icons[name] || '?';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'filled' ? styles.filled : styles.outlined,
        { width: size + 16, height: size + 16 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          variant === 'filled' ? styles.filledIcon : styles.outlinedIcon,
          { fontSize: size },
        ]}
      >
        {getIcon(iconName)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: '#007AFF',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  filledIcon: {
    color: '#fff',
  },
  outlinedIcon: {
    color: '#007AFF',
  },
});

export default IconButton;