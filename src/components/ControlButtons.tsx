// ControlButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ControlButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  backgroundColor: string;
};

const ControlButton: React.FC<ControlButtonProps> = ({
  title,
  onPress,
  disabled = false,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    marginTop: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ControlButton;
