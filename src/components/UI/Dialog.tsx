import React from "react";
import {
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import DialogHeader from "./DialogHeader";
import { DialogProps, DialogHeaderProps } from "../../types/types";

const Dialog: React.FC<DialogProps> = ({
  visible = false,
  onClose,
  children,
  height = 100,
  showCloseButton = true,
  headerProps,
  enableCloseOnBackgroundPress = true,
  animationType = 'slide',
}) => {
  const pan = React.useRef(new Animated.ValueXY()).current;

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        {enableCloseOnBackgroundPress && (
          <TouchableOpacity
            style={{
              flex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
            
            activeOpacity={1}
            onPress={onClose}
          />
        )}
        <Animated.View
          style={[
            styles.container,
            {
              height: typeof height === "number" ? `${height}%` : height,
              transform: [{ translateY: pan.y }],
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderColor: 'colors.primary',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            {headerProps && <DialogHeader {...headerProps} />}
            <View style={[styles.content]}>{children}</View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    paddingTop: 0,
    paddingHorizontal: 3,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonLine: {
    position: "absolute",
    width: 20,
    height: 2,
    backgroundColor: "#666",
    borderRadius: 1,
  },
  closeButtonLineRotated: {
    transform: [{ rotate: "45deg" }],
  },
  content: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    backgroundColor: 'white',
  },
});

export default Dialog;
