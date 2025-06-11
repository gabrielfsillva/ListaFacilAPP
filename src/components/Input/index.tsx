import React, { forwardRef } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TextStyle,
  StyleProp,
  TextInput as RNTextInput,
} from "react-native";

import { style } from "./styles";

import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
  IconLeft?: IconComponent;
  IconRight?: IconComponent;
  IconLeftName?: string;
  IconRightName?: string;
  Title?: string;
  onIconLeftPress?: () => void;
  onIconRightPress?: () => void;
  height?: number;
  labelStyle?: StyleProp<TextStyle>;
};

export const Input = forwardRef<RNTextInput, Props>((props, ref) => {
  const {
    IconLeft,
    IconRight,
    IconLeftName,
    IconRightName,
    Title,
    onIconLeftPress,
    onIconRightPress,
    labelStyle,
    height,
    ...rest
  } = props;

  const calculateSizeWidth = () => {
    if (IconLeft && IconRight) {
      return "80%";
    } else if (IconLeft || IconRight) {
      return "90%";
    } else {
      return "100%";
    }
  };

  const calculateSizePadding = () => {
    if (IconLeft && IconRight) {
      return 0;
    } else if (IconLeft || IconRight) {
      return 10;
    } else {
      return 20;
    }
  };

  return (
    <>
      {Title && <Text style={[style.titleInput, labelStyle]}>{Title}</Text>}
      <View
        style={[
          style.boxInput,
          { paddingLeft: calculateSizePadding(), height: height || 40, padding: 5 },
        ]}
      >
        {IconLeft && IconLeftName && (
          <TouchableOpacity onPress={onIconLeftPress} style={style.Button}>
            <IconLeft
              name={IconLeftName as any}
              size={20}
              color={themes.Colors.gray}
              style={style.Icon}
            />
          </TouchableOpacity>
        )}
        <TextInput
          ref={ref}
          style={[style.input, { width: calculateSizeWidth(), height: "100%" }]}
          {...rest}
        />
        {IconRight && IconRightName && (
          <TouchableOpacity onPress={onIconRightPress} style={style.Button}>
            <IconRight
              name={IconRightName as any}
              size={20}
              color={themes.Colors.gray}
              style={style.Icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
});
