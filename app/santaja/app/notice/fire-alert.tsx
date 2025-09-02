import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function FireAlertScreen() {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url =
      'https://apis.data.go.kr/1400377/forestPoint/forestPointListGeongugSearch?ServiceKey=7ooLPPdFZ2ZEDM25YljrP8W5SDSc2hhHtTnS74BpO%2BGThF63j%2BsqU%2FbinGz9ZscIyvvEh4JfNpLCaEqabaMfCg%3D%3D&pageNo=1&numOfRows=1&_type=json';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const result = data?.response?.body?.items?.item;
        setItem(result ?? null);
      })
      .catch(err => {
        console.error('API 오류:', err);
        setItem(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const getDangerLevel = (item: any): string => {
    if (!item) return '정보 없음';
    if (item.d4 > 0) return '매우 높음';
    if (item.d3 > 0) return '높음';
    if (item.d2 > 0) return '보통';
    return '낮음';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>데이터를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>산불위험 예보 (전국)</Text>
        <View style={styles.card}>
          <Text style={styles.level}>위험등급: {getDangerLevel(item)}</Text>
          <Text>예보일: {item.analdate}</Text>
          <Text>낮음 (d1): {item.d1}%</Text>
          <Text>보통 (d2): {item.d2}%</Text>
          <Text>높음 (d3): {item.d3}%</Text>
          <Text>매우 높음 (d4): {item.d4}%</Text>
          <Text>평균지수: {item.meanavg}</Text>
          <Text>최고/최저: {item.maxi} / {item.mini}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
  },
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 10,
  },
  backText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    padding: 14,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    gap: 4,
  },
  level: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

