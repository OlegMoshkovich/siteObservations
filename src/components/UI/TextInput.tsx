import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TextInputProps } from '../../types/types';
import theme from '../theme';

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text style={{ fontSize: 18, color: '#888', paddingHorizontal: 8 }}>
    {visible ? '😳' : '😑'}
  </Text>
);

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  password = false,
}) => {
  const [secure, setSecure] = useState(password);

  const showEye = password && !multiline;

  return (
    <View>
      {label && label.length > 0 && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <RNTextInput
          style={[styles.input, showEye && { paddingRight: 40 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical="top"
          secureTextEntry={showEye ? secure : false}
          autoCapitalize="none"
        />
        {showEye && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setSecure((s) => !s)}
            accessible
            accessibilityLabel={secure ? "Show password" : "Hide password"}
          >
            <EyeIcon visible={!secure} />
          </TouchableOpacity>
        )}
      </View>
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
  inputWrapper: {
    position: 'relative',
    width: 300,
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.borderRadius,
    width: 300,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    paddingRight: 12,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
    zIndex: 1,
  },
});

export default TextInput;