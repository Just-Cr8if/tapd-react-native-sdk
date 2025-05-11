import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Theme = 'light' | 'dark';
type Position = 'left' | 'right';
type VerticalPosition = 'top' | 'bottom';
type SideColor = 'green' | 'blue' | 'red' | 'gold' | 'brown';
type ButtonColor = 'black' | 'green' | 'blue' | 'mobylmenu' | 'purple' | 'white';

type ToastPromptProps = {
  message: string;
  ctaText: string;
  price: string;
  onPress: () => void;
  theme?: Theme;
  position?: Position;
  verticalPosition?: VerticalPosition;
  sideColor?: SideColor;
  buttonColor?: ButtonColor;
};

const COLORS = {
  black: { background: 'rgba(0, 0, 0, 0.9)', text: '#000' },
  green: { background: 'rgba(200, 255, 200, 0.9)', text: '#2e7d32' },
  blue: { background: 'rgba(200, 230, 255, 0.9)', text: '#1565c0' },
  red: { background: 'rgba(255, 200, 200, 0.9)', text: '#c62828' },
  gold: { background: 'rgba(255, 235, 150, 0.9)', text: '#b28704' },
  brown: { background: 'rgba(205, 133, 63, 0.15)', text: '#8B4513' },
};

const BUTTON_COLORS: Record<ButtonColor, string> = {
  black: '#000',
  green: '#00C853',
  blue: '#1565C0',
  mobylmenu: '#00A6FF',
  purple: '#7E57C2',
  white: '#fff',
};

const ToastPrompt: React.FC<ToastPromptProps> = ({
  message,
  ctaText,
  price,
  onPress,
  theme = 'light',
  position = 'right',
  verticalPosition = 'bottom',
  sideColor = 'blue',
  buttonColor = 'black',
}) => {
  const [visible, setVisible] = useState(false);
  const translateAnim = useRef(new Animated.Value(position === 'left' ? -300 : 300)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const wrapperPositionStyle: ViewStyle = {
    position: 'absolute',
    [position]: 20,
    [verticalPosition]: 40,
    zIndex: 9999,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: theme === 'dark' ? '#fff' : '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    transform: [{ translateX: translateAnim }],
  };

  const containerStyle: ViewStyle = {
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    padding: 16,
    maxWidth: 350,
    width: '100%'
  };

  const buttonTextColor = buttonColor === 'white' ? '#000' : '#fff';

  return visible ? (
    <Animated.View style={wrapperPositionStyle}>
      <View
        style={{
          width: 15,
          backgroundColor: COLORS[sideColor]?.text || COLORS.blue.text,
        }}
      />
      <View style={containerStyle}>
        <Text
          style={{
            marginBottom: 12,
            fontSize: 14,
            fontWeight: '600',
            color: theme === 'dark' ? '#f1f1f1' : '#000',
          }}
        >
          {message}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: BUTTON_COLORS[buttonColor],
            padding: 12,
            borderRadius: 6,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          activeOpacity={0.8}
          onPress={onPress}
        >
          <Text style={{ fontWeight: '600', color: buttonTextColor }}>{ctaText}</Text>
          <Text
            style={{
              fontWeight: '600',
              fontSize: 13,
              color: buttonTextColor,
              marginLeft: 10,
            }}
          >
            {price}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  ) : null;
};

export default ToastPrompt;