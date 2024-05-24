import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Define a mapping of mana symbols to their corresponding image assets
const manaIcons: { [key: string]: any } = {
  '{W}': require('../../assets/white.png'),
  '{U}': require('../../assets/blue.png'),
  '{B}': require('../../assets/black.png'),
  '{R}': require('../../assets/red.png'),
  '{G}': require('../../assets/green.png'),
  '{C}': require('../../assets/colorless.png'),
  '{0}': require('../../assets/0.png'),
  '{1}': require('../../assets/1.png'),
  '{2}': require('../../assets/2.png'),
  '{3}': require('../../assets/3.png'),
  '{4}': require('../../assets/4.png'),
  '{T}': require('../../assets/T.png'),
  '{X}': require('../../assets/X.png'),
};

// Define the props for the ManaText component
interface ManaTextProps {
  text: string; // The text containing mana symbols
}

// ManaText component to display mana symbols and text
const ManaText: React.FC<ManaTextProps> = ({ text }) => {
  // Split the text into parts, separating mana symbols from other text
  const parts = text.split(/(\{[^}]+\})/g).filter(part => part);

  return (
    <View style={styles.container}>
      {parts.map((part, index) => (
        manaIcons[part] ? (
          // Render an image if the part is a recognized mana symbol
          <Image key={index} source={manaIcons[part]} style={styles.manaIcon} />
        ) : (
          // Render text for other parts
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
    marginHorizontal: 1,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ManaText;
