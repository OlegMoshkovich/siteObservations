import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { supabase } from '../utils/supabase';
import Dialog from '../components/UI/Dialog';
import Button from '../components/UI/Button';
import { exifDateToPostgres } from '../utils/dateUtils';
import CreateObservationWidget from '../components/CreateObservationWidget';

export default function AddScreen() {
  // ...existing state and logic for AddScreen...
  // (You can re-add any state or handlers you need for your actual upload logic)

  // Example placeholder handlers:
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [pendingTitle, setPendingTitle] = useState('');
  const [pendingNote, setPendingNote] = useState('');
  const [pendingUpload, setPendingUpload] = useState(false);
  const [dialogMode, setDialogMode] = useState<'photo' | 'note' | null>(null);
  const [pendingNoteTitle, setPendingNoteTitle] = useState('');
  const [pendingNoteContent, setPendingNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [photoLocation, setPhotoLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pendingTakenAt, setPendingTakenAt] = useState<string | null>(null);

  const handlePickAndUpload = async () => {
    console.log('Photo icon pressed');
    setDialogMode('photo');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Media library permission status:', status);
    if (status !== 'granted') {
      Alert.alert('Permission required to access media library!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      exif: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      const takenAtRaw = image.exif?.DateTimeOriginal || image.exif?.DateTime || null;
      const takenAt = exifDateToPostgres(takenAtRaw);
      setPendingTakenAt(takenAt);
      setPendingImageUri(image.uri);
      setDialogVisible(true);
      setPendingTitle('');
      setPendingNote('');
      setPendingUpload(false);
      // Get location permission and current location
      try {
        const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
        if (locStatus === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setPhotoLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          setPhotoLocation(null);
        }
      } catch (e) {
        setPhotoLocation(null);
      }
    }
  };
  const handlePickCamera = async () => {
    setDialogMode('photo');
    // Request camera permission
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission required to access camera!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      setPendingImageUri(image.uri);
      setDialogVisible(true);
      setPendingTitle('');
      setPendingNote('');
      setPendingUpload(false);
      // Get location permission and current location
      try {
        const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
        if (locStatus === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setPhotoLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          setPhotoLocation(null);
        }
      } catch (e) {
        setPhotoLocation(null);
      }
    }
  };
  // Update handleUpload to accept anchor and labels
  const handleUpload = async ({ anchor, labels }: { anchor: { x: number; y: number } | null; labels: string[] }) => {
    if (!pendingImageUri) return;
    // setUploading(true);
    setPendingUpload(true);
    try {
      // Get original image size
      const originalResponse = await fetch(pendingImageUri);
      const originalBlob = await originalResponse.blob();
      const originalSize = originalBlob.size;
      console.log('Original image size:', (originalSize / 1024).toFixed(2), 'KB');

      // Compress the image
      const compressed = await ImageManipulator.manipulateAsync(
        pendingImageUri,
        [],
        { compress: 0.05, format: ImageManipulator.SaveFormat.JPEG }
      );
      // Get compressed image size
      const compressedResponse = await fetch(compressed.uri);
      const compressedBlob = await compressedResponse.blob();
      const compressedSize = compressedBlob.size;
      console.log('Compressed image size:', (compressedSize / 1024).toFixed(2), 'KB');

      // Use FileReader to get ArrayBuffer
      const arraybuffer = await blobToArrayBuffer(compressedBlob);
      const fileExt = compressed.uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const filename = `${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filename, arraybuffer, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        Alert.alert('Upload failed', uploadError.message);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Upload failed', 'User not authenticated');
        return;
      }

      console.log('anchor', anchor);
      console.log('labels', labels);
      console.log('pendingNote', pendingNote);
      console.log('photoLocation', photoLocation);
      console.log('pendingTitle', pendingTitle);
      console.log('pendingUpload', pendingUpload);
      // console.log('uploading', uploading);
      const { error: insertError } = await supabase.from('photos').insert([
        {
          project_id: null,
          user_id: user.id,
          url: uploadData?.path,
          note: pendingNote,
          latitude: photoLocation ? photoLocation.latitude : null,
          longitude: photoLocation ? photoLocation.longitude : null,
          anchor: anchor ? { x: anchor.x, y: anchor.y } : null,
          labels: labels,
          taken_at: pendingTakenAt,
        },
      ]);

      

      if (insertError) {
        Alert.alert('DB insert failed', insertError.message);
      } else {
        Alert.alert('Photo uploaded and record created!');
      }
    } catch (err: any) {
      Alert.alert('Upload failed', err.message || 'Unknown error');
    } finally {
      // setUploading(false);
      setPendingImageUri(null);
      setDialogVisible(false);
      setPendingTitle('');
      setPendingNote('');
      setPendingUpload(false);
      setPhotoLocation(null);
      setPendingTakenAt(null);
    }
  };
  // Helper to convert Blob to ArrayBuffer using FileReader
function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
  return (
    <View style={styles.container}>
      <Dialog
        visible={dialogVisible}
        height={90}
        onClose={() => {
          setDialogVisible(false);
          setPendingImageUri(null);
          setPendingTitle('');
          setPendingNote('');
          setPendingUpload(false);
          setDialogMode(null);
          setPendingNoteTitle('');
          setPendingNoteContent('');
          setSavingNote(false);
        }}
        headerProps={{
          title: 'Observation widget',
          style: { paddingHorizontal: 16 },
          rightActionFontSize: 15,
          bottomBorder: false,
          titleStyle: { color: 'black' },
          rightActionElement: 'Close',
          onRightAction: () => {
            setDialogVisible(false);
            setPendingImageUri(null);
            setPendingTitle('');
            setPendingNote('');
            setPendingUpload(false);
            setDialogMode(null);
            setPendingNoteTitle('');
            setPendingNoteContent('');
            setSavingNote(false);
          },
        }}
      >
         {dialogMode === 'photo' ? (
          <CreateObservationWidget
            visible={dialogVisible && dialogMode === 'photo'}
            imageUri={pendingImageUri}
            note={pendingNote}
            uploading={pendingUpload}
            onNoteChange={setPendingNote}
            onUpload={handleUpload}
            onClose={() => setDialogVisible(false)}
          />
        )  : (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text>No photo selected.</Text>
          </View>
        )}
      </Dialog>
      <View style={{ width: '86%', flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
        <Button title="Upload photo" onPress={handlePickAndUpload} />
        <Button title="Take photo" onPress={handlePickCamera} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingTop: 80,
  },
});