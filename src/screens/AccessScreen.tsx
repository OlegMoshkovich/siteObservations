import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { supabase } from '../utils/supabase';
import Dialog from '../components/UI/Dialog';
import { format, parse } from 'date-fns';   
import PhotoItem from '../features/PhotoItem';    
import Button from '../components/UI/Button';

export default function AccessScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [dateOptions, setDateOptions] = useState<string[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      setDatesLoading(true);
      const { data } = await supabase.from('observations').select('photo_date');
      const uniqueSortedDates = Array.from(
        new Set(
          (data ?? [])
            .map((item: any) => item.photo_date)
            .filter((d: string | null | undefined) => !!d)
        )
      ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      setDateOptions(uniqueSortedDates);
      setDatesLoading(false);
    };
    fetchDates();
  }, []);

  // Helper to get date range for selectedDate (in UTC)
  const getDateRange = (selectedDate: string) => {
    if (!selectedDate) return {};
    const date = parse(selectedDate, 'MMMM d, yyyy', new Date());
    const from = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    const to = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));
    return {
      from: from.toISOString(),
      to: to.toISOString(),
    };
  };

  useEffect(() => {
    if (!dialogVisible || !selectedDate) return;
    const fetchPhotos = async () => {
      setPhotosLoading(true);
      setPhotos([]);
      const { data } = await supabase.from('observations').select('*');
      const photosWithDataUrl = await Promise.all(
        (data ?? []).map(async (photo: any) => {
          try {
            if (!photo.photo_url) {
              return { ...photo, dataUrl: null };
            }
            const { data: fileData, error: fileError } = await supabase.storage.from('photos').download(photo.photo_url);
            if (fileError || !fileData) {
              return { ...photo, dataUrl: null };
            }
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
      setPhotos(photosWithDataUrl);
      setPhotosLoading(false);
    };
    fetchPhotos();
  }, [selectedDate, dialogVisible]);

  useEffect(() => {
    if (!dialogVisible) {
      setPhotos([]);
    }
  }, [dialogVisible]);

  return (
    <View style={styles.container}>
      <View style={styles.dateListContainer}>
        <Text style={styles.selectDateText}>Select a date to view observations</Text>
        {datesLoading ? (
          <ActivityIndicator />
        ) : dateOptions.length === 0 ? (
          <Text style={styles.noDatesText}>No dates available.</Text>
        ) : (
          dateOptions.map((date) => (
            <Button
              key={date + 'date'}
              title={date}
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
            {photos.map((photo) => (
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
    textAlign: 'left',
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
