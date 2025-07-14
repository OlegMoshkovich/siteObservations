import React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native';

interface TextInputProps {
  label?: string;
  value: string;
  multiline?: boolean;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline=false,
}) => {
  return (
    <View>
      {label && label.length > 0 && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    width: 300,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default TextInput;