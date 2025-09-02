import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="/[name]"
          options={{
            headerShown: true,
            title: '코스 상세',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

