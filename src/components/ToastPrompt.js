"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const COLORS = {
    black: { background: 'rgba(0, 0, 0, 0.9)', text: '#000' },
    green: { background: 'rgba(200, 255, 200, 0.9)', text: '#2e7d32' },
    blue: { background: 'rgba(200, 230, 255, 0.9)', text: '#1565c0' },
    red: { background: 'rgba(255, 200, 200, 0.9)', text: '#c62828' },
    gold: { background: 'rgba(255, 235, 150, 0.9)', text: '#b28704' },
    brown: { background: 'rgba(205, 133, 63, 0.15)', text: '#8B4513' },
};
const BUTTON_COLORS = {
    black: '#000',
    green: '#00C853',
    blue: '#1565C0',
    mobylmenu: '#00A6FF',
    purple: '#7E57C2',
    white: '#fff',
};
const ToastPrompt = ({ message, ctaText, price, onPress, theme = 'light', position = 'right', verticalPosition = 'bottom', sideColor = 'blue', buttonColor = 'black', }) => {
    const [visible, setVisible] = (0, react_1.useState)(false);
    const translateAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(position === 'left' ? -300 : 300)).current;
    (0, react_1.useEffect)(() => {
        const timeout = setTimeout(() => {
            setVisible(true);
            react_native_1.Animated.timing(translateAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }, 100);
        return () => clearTimeout(timeout);
    }, []);
    const wrapperPositionStyle = {
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
    const containerStyle = {
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
        padding: 16,
        maxWidth: 380,
        width: '100%',
    };
    const buttonTextColor = buttonColor === 'white' ? '#000' : '#fff';
    return visible ? (<react_native_1.Animated.View style={wrapperPositionStyle}>
      <react_native_1.View style={{
            width: 10,
            backgroundColor: COLORS[sideColor]?.text || COLORS.blue.text,
        }}/>
      <react_native_1.View style={containerStyle}>
        <react_native_1.Text style={{
            marginBottom: 12,
            fontSize: 14,
            fontWeight: '600',
            color: theme === 'dark' ? '#f1f1f1' : '#000',
        }}>
          {message}
        </react_native_1.Text>
        <react_native_1.TouchableOpacity style={{
            backgroundColor: BUTTON_COLORS[buttonColor],
            padding: 12,
            borderRadius: 6,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }} activeOpacity={0.8} onPress={onPress}>
          <react_native_1.Text style={{ fontWeight: '600', color: buttonTextColor }}>{ctaText}</react_native_1.Text>
          <react_native_1.Text style={{
            fontWeight: '600',
            fontSize: 13,
            color: buttonTextColor,
            marginLeft: 10,
        }}>
            {price}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.Animated.View>) : null;
};
exports.default = ToastPrompt;
