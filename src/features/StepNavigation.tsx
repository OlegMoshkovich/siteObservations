import { View } from "react-native";
import Button from "../components/UI/Button";
import { StepNavigationButtonsProps } from "../types/types";

export const StepNavigationButtons: React.FC<StepNavigationButtonsProps> = ({
  onBack = () => {},
  onNext = () => {},
  backDisabled,
  nextDisabled,
  showBack = true,
  showNext = true,
  nextLabel = 'Next',
  backLabel = 'Back',
  style,
}) => (
  <View style={[{ flexDirection: 'row', justifyContent: 'center', gap: 10, width: '100%' }, style]}>
    {showBack && (
      <Button
        title={backLabel}
        onPress={onBack}
        disabled={backDisabled}
        style={{ width: '40%' }}
      />
    )}
    {showNext && (
      <Button
        title={nextLabel}
        onPress={onNext}
        disabled={nextDisabled}
        style={{ width: '40%' }}
      />
    )}
  </View>
);