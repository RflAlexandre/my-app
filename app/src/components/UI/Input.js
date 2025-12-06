import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const Input = ({ label, error, ...props }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { 
            borderColor: error ? '#FF3B30' : theme.primary,
            color: theme.text,
            backgroundColor: theme.background === '#FFF' ? '#F5F5F5' : '#333',
          }
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Input;