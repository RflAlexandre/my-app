import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const Button = ({ title, onPress, variant = 'primary', loading = false, style, textStyle }) => {
  const { theme } = useTheme();
  
  const getBackgroundColor = () => {
    if (variant === 'primary') return theme.primary;
    if (variant === 'secondary') return theme.secondary;
    if (variant === 'accent') return theme.accent;
    return theme.primary;
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        style
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;