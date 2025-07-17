import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { PhotoItemProps } from '../types/types';

const PhotoItem: React.FC<PhotoItemProps> = ({ id, dataUrl, title, note, checked, latitude, longitude, onCheck, timestamp, anchor, labels, takenAt }) => {
  if (!dataUrl) return null;
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {timestamp && (
          <Text style={styles.timestamp}>{timestamp}</Text>
        )}
        {anchor && (
          <Text style={styles.anchorText}>
            x:{anchor.x.toFixed(3)}, y:{anchor.y.toFixed(3)}
          </Text>
        )}
      </View>
      <Image
        source={{ uri: dataUrl }}
        style={styles.image}
      />
      {note && (
        <View style={styles.noteRow}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    width: 300,
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: 12,
    color: '#000',
  },
  anchorText: {
    fontSize: 12,
    color: '#888',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 10,
    alignSelf: 'center',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    alignSelf: 'center',
    marginBottom: 4,
  },
  noteText: {
    width: 280,
    fontSize: 16,
    color: '#444',
    alignSelf: 'center',
    marginBottom: 4,
  },
});

export default PhotoItem; 