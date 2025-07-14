import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import TextInput from '../components/TextInput';
import { useState } from 'react';
import Checkbox from '../components/Checkbox';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import PlanWidget from '../components/PlanWidget';

export default function DetailScreen() {
  const [description, setDescription] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.componentContainer}>
        <TextInput label="TextInput" value={description} onChangeText={setDescription} />
        <Dropdown label="Dropdown" options={[{label: 'Option 1', value: 'option1'}, {label: 'Option 2', value: 'option2'}, {label: 'Option 3', value: 'option3'}]} selectedValue={selectedOption} onSelect={setSelectedOption} />
       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '50%' }}>
          <Button title="Button" onPress={() => {}} />
          <IconButton iconName="close" size={20} variant="outlined" onPress={() => {}} />
          <Checkbox label="Checkbox"   checked={checked} onToggle={() => setChecked(!checked)} /> 
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', width: '90%' }}>
           <PlanWidget onAnchorChange={() => {}} />
        </View>
    
      </View>
      <StatusBar style="auto" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  componentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70%',
  },
});
