// CardPreview.tsx
import React from 'react';
import { Modal, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../styles/colors';
import ManaText from './manaText';

interface CardPreviewProps {
  visible: boolean;
  onClose: () => void;
  commander: any; // Cambia esto según tu tipo de datos
}

const CardPreview: React.FC<CardPreviewProps> = ({ visible, onClose, commander }) => {
  if (!commander) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Image
            source={{ uri: commander.image_uris.normal }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{commander.name}</Text>
            <View style={styles.typeAndCost}>
              <Text style={styles.type}>{commander.type_line}</Text>
            </View>
            <View style={styles.manaCostContainer}>
                <ManaText text={commander.mana_cost} />
              </View>
            <Text style={styles.powerToughness}>{commander.power} / {commander.toughness}</Text>
            <ScrollView style={styles.textContainer}>
              <ManaText text={commander.oracle_text} />
            </ScrollView>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    borderRadius:15,
    width: 200,
    height: 280,
    marginTop: 20,
    alignSelf:'center'
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  typeAndCost: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  type: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#fff',
  },
  manaCostContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  powerToughness: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
    marginBottom: 10,
  },
  textContainer: {
    maxHeight: 150,
  },
  closeButton: {
    padding: 10,
    backgroundColor: Colors.Gold,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CardPreview;
