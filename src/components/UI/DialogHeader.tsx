import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DialogHeaderProps } from "../../types/types";

const DialogHeader: React.FC<DialogHeaderProps> = ({
  title,
  backAction = false,
  onBackAction,
  titleButtonComponent,
  rightActionElement,
  onRightAction,
  style,
  titleStyle,
  headerAsButton,
  onHeaderPress,
  bottomBorder = true,
  titleFontSize = 16,
  rightActionFontSize = 16,
}) => {
  return (
    <>
      <View style={[styles.container, style]}>
        <View style={styles.left}>
          {typeof title === "string" ? (
            <Text
              style={[styles.title, titleStyle, { fontSize: titleFontSize }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : (
            title
          )}
        </View>
        <View style={styles.right}>
          {rightActionElement &&
            (typeof rightActionElement === "string" ? (
              <TouchableOpacity
                onPress={onRightAction}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text
                  style={[
                    styles.rightActionText,
                    {
                      fontSize: rightActionFontSize,
                    },
                  ]}
                >
                  {rightActionElement}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={onRightAction}
                disabled={!onRightAction}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {rightActionElement}
              </TouchableOpacity>
            ))}
        </View>
      </View>
      {bottomBorder && <View style={styles.bottomBorder} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: "transparent",
    minHeight: 50,
    width: "100%",
    alignSelf: "center",
  },
  left: {
    minWidth: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  backButton: {
    paddingRight: 8,
  },
  center: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 40,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400",
    textAlign: "left",
    flexShrink: 1,
    fontFamily: 'Inter-Regular',
    
  },
  titleButton: {
    marginLeft: 8,
  },
  right: {
    minWidth: 32,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rightActionText: {
    color: "colors.primary",
    fontSize: 18,
    fontWeight: "400",
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  bottomBorder: {
    width: "90%",
    alignSelf: "center",
    borderBottomWidth: .5,
  },
});

export default DialogHeader;
