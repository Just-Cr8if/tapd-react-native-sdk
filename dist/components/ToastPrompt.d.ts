import React from 'react';
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
declare const ToastPrompt: React.FC<ToastPromptProps>;
export default ToastPrompt;
