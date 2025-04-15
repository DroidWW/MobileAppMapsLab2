import React, { useState, useCallback } from 'react';
import { View, Button, Alert } from 'react-native';
import { MarkerData } from '@/types';
import 'react-native-get-random-values';
import { useRouter, useFocusEffect } from 'expo-router';
import Map from '../components/Map';
import { useDatabase } from '@/contexts/DatabaseContext';

export default function Index() {
  const {addMarker, getMarkers, deleteMarker} = useDatabase();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const router = useRouter();

  useFocusEffect(useCallback(() => {
    const loadData = async () => {
      const loadedMarkers = await getMarkers();
      setMarkers(loadedMarkers);
    };
    loadData();
  }, [getMarkers]));

  const pressingMap = (event: any) => {
    const {coordinate} = event.nativeEvent;
    addMarkerHere(coordinate.latitude, coordinate.longitude);
  };

  const addMarkerHere = async (latitude: number, longitude: number) => {
    await addMarker(latitude, longitude);
    const updatedMarkers = await getMarkers();
    setMarkers(updatedMarkers);
  };

  const tappingMarker = (marker: MarkerData) => {
    try {
      router.push({
        pathname: '/marker/[id]',
        params: {
          id: marker.id,
          marker: JSON.stringify(marker)
        }
      });
    }catch(error){
      console.error("Ошибка навигации: ", error);
      Alert.alert("Ошибка", "Ошибка навигации к маркеру");
    }
  };

  const clearMarkers = async () => {{
      const markersToDelete = [...markers];
      setMarkers([]);
      for (const marker of markersToDelete){
        await deleteMarker(marker.id);
      }
      console.log(markers);
    }
  };

  return (
    <View style={{flex: 1}}>      
      <Map
        markers={markers}
        pressingMap={pressingMap}
        tappingMarker={tappingMarker}
      />
      <View style={{position: 'absolute', padding: 10, paddingTop: 60}}>
        <Button
          title='clear'
          onPress={clearMarkers}
          color = '#FF3B30'
        />
      </View>
    </View>
  );
}


