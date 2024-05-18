// ManaText.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const manaIcons: { [key: string]: any } = {
  '{W}': require('../../assets/white.png'),
  '{U}': require('../../assets/blue.png'),
  '{B}': require('../../assets/black.png'),
  '{R}': require('../../assets/red.png'),
  '{G}': require('../../assets/green.png'),
  '{C}': require('../../assets/colorless.png'),
  
};

interface ManaTextProps {
  text: string;
}

const ManaText: React.FC<ManaTextProps> = ({ text }) => {
  const parts = text.split(/(\{[^}]+\})/g).filter(part => part);

  return (
    <View style={styles.container}>
      {parts.map((part, index) => (
        manaIcons[part] ? (
          <Image key={index} source={manaIcons[part]} style={styles.manaIcon} />
        ) : (
          <Text key={index} style={styles.text}>{part}</Text>
        )
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  manaIcon: {
    width: 15,
    height: 15,
    marginHorizontal: 1
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ManaText;
