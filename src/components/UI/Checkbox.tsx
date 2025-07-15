import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onToggle }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(!checked)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkedCheckbox]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {/* <Text style={styles.label}>{label}</Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkedCheckbox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default Checkbox;