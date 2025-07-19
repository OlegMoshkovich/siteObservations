import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase, uploadPhoto } from '../utils/supabase';
import Dialog from '../components/UI/Dialog';
import Button from '../components/UI/Button';
import { exifDateToPostgres } from '../utils/dateUtils';
import CreateObservationWidget from '../features/CreateObservationWidget';
import { useUserStore } from '../state/slices/userSlice';
import { useObservationStore } from '../state/slices/observationSlice';
import { askForLibraryPermission, askForCameraPermission, askForLocationPermission } from '../utils/permissions';
import { compressImage } from '../utils/imageUtils';

export default function AddScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [pendingNote, setPendingNote] = useState('');
  const [pendingUpload, setPendingUpload] = useState(false);
  const [dialogMode, setDialogMode] = useState<'photo' | 'note' | null>(null);
  const [photoLocation, setPhotoLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pendingTakenAt, setPendingTakenAt] = useState<string | null>(null);
  const { observations, setObservations, photos, setPhotos } = useObservationStore();

  const { user } = useUserStore();
  
  function resetState() {
    setPendingImageUri(null);
    setDialogVisible(false);
    setPendingNote('');
    setPendingUpload(false);
    setPhotoLocation(null);
    setPendingTakenAt(null);
    setDialogMode(null);
  }

  function setPickedImageState(imageUri: string, takenAt: string | null) {
    setPendingImageUri(imageUri);
    setDialogVisible(true);
    setPendingNote('');
    setPendingUpload(false);
    setPendingTakenAt(takenAt);
    setDialogMode('photo');
  }

  const handlePickAndUpload = async () => {
    setDialogMode('photo');
    const hasPermission = await askForLibraryPermission();
    if (!hasPermission) return;

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
      setPickedImageState(image.uri, takenAt);
      const hasLocPermission = await askForLocationPermission();
      if (hasLocPermission) {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setPhotoLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (e) {
          setPhotoLocation(null);
        }
      } else {
        setPhotoLocation(null);
      }
    }
  };

  const handlePickCamera = async () => {
    setDialogMode('photo');
    const hasPermission = await askForCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const image = result.assets[0];
      setPickedImageState(image.uri, null);
      const hasLocPermission = await askForLocationPermission();
      if (hasLocPermission) {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setPhotoLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (e) {
          setPhotoLocation(null);
        }
      } else {
        setPhotoLocation(null);
      }
    }
  };
  
  const handleUpload = async ({ anchor, labels }: { anchor: { x: number; y: number } | null; labels: string[] }) => {
    if (!pendingImageUri) return;
    setPendingUpload(true);
    try {
      const { blob: compressedBlob, size: compressedSize, uri: compressedUri } = await compressImage(pendingImageUri);
      const arraybuffer = await blobToArrayBuffer(compressedBlob);
      const fileExt = compressedUri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const filename = `${Date.now()}.${fileExt}`;
      let photoUrl;

      try {
        photoUrl = await uploadPhoto(arraybuffer, filename);

      } catch (uploadError: any) {
        Alert.alert('Upload failed', uploadError.message || String(uploadError));
        return;
      }

      if (!photoUrl) {
        Alert.alert('Upload failed', 'No photo URL returned');
        return;
      }

      if (!user) {
        Alert.alert('Upload failed', 'User not authenticated');
        return;
      }

      // Insert the new observation into the database and also update the local observations state
      const { data: insertedData, error: insertError } = await supabase.from('observations').insert([
        {
          user_id: user.id,
          note: pendingNote,
          gps_lat: photoLocation ? photoLocation.latitude : null,
          gps_lng: photoLocation ? photoLocation.longitude : null,
          photo_url: photoUrl,
          plan_url: null,
          plan_anchor: anchor ? { x: anchor.x, y: anchor.y } : null,
          photo_date: pendingTakenAt ? pendingTakenAt.split('T')[0] : null, // expects date (YYYY-MM-DD)
        },
      ]).select();

      if (insertedData && insertedData.length > 0) {
        // Add the new observation to the local observations state immediately
  
        setObservations([...(observations ?? []), insertedData[0]]);
      }

      if (insertError) {
        Alert.alert('DB insert failed', insertError.message);
      } else {
        Alert.alert('Photo uploaded and record created!');
      }
    } catch (err: any) {
      Alert.alert('Upload failed', err.message || 'Unknown error');
    } finally {
      resetState();
    }
  };
  
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
        onClose={resetState}
        headerProps={{
          title: 'Create observation',
          style: { paddingHorizontal: 16 },
          rightActionFontSize: 15,
          bottomBorder: false,
          titleStyle: { color: 'black' },
          rightActionElement: 'Close',
          onRightAction: resetState,
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
        <Button title="upload photo" onPress={handlePickAndUpload} />
        <Button title="snap photo" onPress={handlePickCamera} />
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