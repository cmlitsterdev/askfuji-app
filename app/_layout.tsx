import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { requestPermissionsAndSchedule } from '../lib/notifications';

export default function RootLayout() {
  useEffect(() => {
    requestPermissionsAndSchedule();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
