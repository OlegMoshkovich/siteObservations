import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import Dialog from '../components/UI/Dialog';
import { format, parse } from 'date-fns';   
import PhotoItem from '../features/PhotoItem';    
import Button from '../components/UI/Button';
import { useObservationStore } from '../state/slices/observationSlice';
import { useUIStore } from '../state/slices/uiSlice';
import { formatObservationDate } from '../utils/dateUtils';
import { downloadPhoto, fetchObservationDates, fetchUserObservations } from '../utils/supabase';
import { useUserStore } from '../state/slices/userSlice';

export default function AccessScreen() {
  const { selectedDate, setSelectedDate } = useUIStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const { observationDates, photos, setObservationDates, setPhotos, setObservations } = useObservationStore();
  const { user } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
        const uniqueSortedDates = await fetchObservationDates(user.id);
        const observations= await fetchUserObservations(user?.id || ''  );
        const photosWithDataUrl = await Promise.all(
          (observations ?? []).map(async (photo: any) => {
            try {
              if (!photo.photo_url) {
                return { ...photo, dataUrl: null };
              }
              const fileData = await downloadPhoto(photo.photo_url);
              const fr = new FileReader();
              return await new Promise<any>((resolve) => {
                fr.onload = () => {
                  resolve({ ...photo, dataUrl: fr.result as string });
                };
                fr.readAsDataURL(fileData);
              });
            } catch (e) {
              return { ...photo, dataUrl: null };
            }
          })
        );
        setObservationDates(uniqueSortedDates as string[]);
        setObservations(observations);
        setPhotos(photosWithDataUrl);
    } catch (e) {
      // Optionally handle error
    } finally {
      setRefreshing(false);
    }
  };

  console.log('selectedDate', selectedDate);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.dateListContainer}>
          <Text style={styles.selectDateText}>Select a date to view observations</Text>
          {observationDates === null ? (
            <ActivityIndicator />
          ) : observationDates === undefined ? (
            <Text style={styles.noDatesText}>No dates available.</Text>
          ) : (
            observationDates.map((date) => (
              <Button
                key={date + 'date'}
                title={formatObservationDate(date)}
                variant="outlined"
                onPress={() => {
                  setSelectedDate(date);
                  setDialogVisible(true);
                }}
              />
            ))
          )}
        </View>
        <Dialog
          visible={dialogVisible}
          height={92}
          headerProps={{
            title: 'Observations',
            rightActionFontSize: 15,
            style: { paddingHorizontal: 16 },
            titleStyle: { color: 'black' },
            rightActionElement: 'Close',
            bottomBorder: false,
            onRightAction: () => setDialogVisible(false),
          }}
          onClose={() => setDialogVisible(false)}
        >
          <View style={styles.dialogContent}>
            <ScrollView style={{ width: '100%' }}>
              {photos
                ?.filter((photo: any) => photo.created_at.split('T')[0] === selectedDate)
                .map((photo: any) => (
                  <PhotoItem
                    key={photo.id}
                    id={photo.id}
                    dataUrl={photo.dataUrl || ''}
                    note={photo.note}
                    timestamp={photo.created_at ? format(new Date(photo.created_at), 'PPpp') : undefined}
                    anchor={photo.plan_anchor}
                    labels={photo.labels}
                    checked={false}
                    onCheck={() => {}}
                  />
                ))}
            </ScrollView>
          </View>
        </Dialog>

      </View>

    </ScrollView>
    <View style={{ bottom: 20, alignSelf:'center' }} >
          <Text>pull to refresh</Text>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 80,
  },
  dateListContainer: {
    marginTop: 100,
    gap: 10,
    width: '70%',
  },
  selectDateText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  noDatesText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 16,
  },
  dialogContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
