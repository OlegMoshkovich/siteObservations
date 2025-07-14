import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Image } from 'react-native';
import { StepNavigationButtons } from './StepNavigation';
import PlanWidget from '../components/PlanWidget';

interface CreateObservationWidgetProps {
  visible: boolean;
  imageUri: string | null;
  note: string;
  uploading: boolean;
  onNoteChange: (text: string) => void;
  onUpload: (data: { anchor: { x: number; y: number } | null; labels: string[] }) => void;
  onClose: () => void;
}


const CreateObservationWidget: React.FC<CreateObservationWidgetProps> = ({
  visible,
  imageUri,
  note,
  uploading,
  onNoteChange,
  onUpload,
  onClose,
}) => {
  // Steps: 1 = photo, 2 = note, 3 = plan, 4 = labels
  const [step, setStep] = useState(1);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  // Pills data
  const roomLabels = ['Room 1', 'Room 2', 'Room 3', 'Room 4'];
  const statusLabels = ['Delivered', 'Installed', 'Demolished', 'Fastened'];
  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  // Reset step, anchor, and labels when dialog is closed
  useEffect(() => {
    if (!visible) {
      setStep(1);
      setAnchor(null);
      setSelectedLabels([]);
    }
  }, [visible]);

  if (!visible || !imageUri) return null;
  // Determine button props for each step
  let onBack, onNext, backDisabled, nextDisabled, nextLabel, showBack, showNext;
  if (step === 1) {
    onBack = undefined;
    onNext = () => setStep(2);
    showBack = false;
    showNext = true;
    nextDisabled = uploading;
    nextLabel = 'Next';
  } else if (step === 2) {
    onBack = () => setStep(1);
    onNext = () => setStep(3);
    showBack = true;
    showNext = true;
    backDisabled = uploading;
    nextDisabled = uploading;
    nextLabel = 'Next';
  } else if (step === 3) {
    onBack = () => setStep(2);
    onNext = () => setStep(4);
    showBack = true;
    showNext = true;
    backDisabled = uploading;
    nextDisabled = uploading;
    nextLabel = 'Next';
  } else if (step === 4) {
    onBack = () => setStep(3);
    onNext = () => onUpload({ anchor, labels: selectedLabels });
    showBack = true;
    showNext = true;
    backDisabled = uploading;
    nextDisabled = uploading;
    nextLabel = uploading ? '' : 'Done';
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ alignItems: 'center', justifyContent: 'flex-start', flex: 1, width: '100%' }}>
        {step === 1 && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '90%', height: 300, borderRadius: 0, marginBottom: 10 }}
            resizeMode="cover"
          />
        )}
        {step === 2 && (
          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', width: '90%' }}>
            <PlanWidget onAnchorChange={setAnchor} />
          </View>
        )}
        {step === 3 && (
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            marginTop: 60, 
            borderRadius: 4, 
            paddingBottom: 50,  
            width: '90%', 
            alignSelf: 'center'  
            }}
            >
            {roomLabels.map((label) => (
              <TouchableOpacity
                key={label}
                onPress={() => toggleLabel(label)}
                style={{
                  backgroundColor: selectedLabels.includes(label) ? 'black' : 'white',
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 0,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  margin: 4,
                }}
              >
                <Text style={{ color: selectedLabels.includes(label) ? 'white' : 'black', fontWeight: 'bold' }}>{label}</Text>
              </TouchableOpacity>
            ))}
            {statusLabels.map((label) => (
              <TouchableOpacity
                key={label}
                onPress={() => toggleLabel(label)}
                style={{
                  backgroundColor: selectedLabels.includes(label) ? 'red' : 'white',
                  borderColor: 'red',
                  borderWidth: 1,
                  borderRadius: 0,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  margin: 4,
                }}
              >
                <Text style={{ color: selectedLabels.includes(label) ? 'white' : 'red', fontWeight: 'bold' }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {step === 4 && (
          <TextInput
            placeholder="Add a note (optional)"
            value={note}
            onChangeText={onNoteChange}
            multiline={true}
            style={{
              width: '90%',
              minHeight: 300,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              paddingHorizontal: 12,
              marginBottom: 16,
              fontSize: 16,
              backgroundColor: '#fafafa',
            }}
            editable={!uploading}
          />
        )}
        <View style={{ 
            position: 'absolute',
            top: 320,
            left: 0,
            right: 0,
            alignSelf: 'center',
        }}
        >
        <StepNavigationButtons
            onBack={onBack}
            onNext={onNext}
            backDisabled={backDisabled}
            nextDisabled={nextDisabled}
            showBack={showBack}
            showNext={showNext}
            nextLabel={nextLabel}
            style={{ marginTop: 10, marginBottom: 4 }}
        />
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateObservationWidget; 