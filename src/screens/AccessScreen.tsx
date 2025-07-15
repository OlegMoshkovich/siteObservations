import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';

import Dialog from '../components/UI/Dialog';
import { format, parse } from 'date-fns';   
import PhotoItem from '../features/PhotoItem';    
import Button from '../components/UI/Button';
import { useUserStore } from '../state/slices/userSlice';
import { useObservationStore } from '../state/slices/observationSlice';

export default function AccessScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const { observationDates, photos } = useObservationStore();

  return (
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
            {photos?.map((photo: any) => (
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
