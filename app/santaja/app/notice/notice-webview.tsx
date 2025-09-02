import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NoticeDetail {
  office?: string;
  status: string;
  time: string;
}

interface ParkGroup {
  park: string;
  details: NoticeDetail[];
}

export default function NoticeAuto() {
  const [data, setData] = useState<ParkGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://192.168.219.104:3001/api/knps-notices')
      .then(res => res.json())
      .then(json => {
        // details가 없는 경우 빈 배열로 대체 (안전 처리)
        const safeData = Array.isArray(json)
          ? json.map(item => ({
              ...item,
              details: Array.isArray(item.details) ? item.details : [],
            }))
          : [];
        setData(safeData);
      })
      .catch(err => {
        console.error('API 호출 실패:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#666" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>국립공원 통제 정보</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* 목록 */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.park}_${index}`}
        renderItem={({ item }) => (
          <View style={styles.groupCard}>
            <Text style={styles.parkTitle}>{item.park}</Text>
            {item.details.map((d, idx) => (
              <View key={`${item.park}_${d.office ?? idx}`} style={styles.detailItem}>
                {d.office && <Text style={styles.detailText}>사무소: {d.office}</Text>}
                <Text style={styles.detailText}>상태: {d.status}</Text>
                <Text style={styles.detailText}>기준: {d.time}</Text>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30 }}>현재 통제 정보가 없습니다.</Text>
        }
      />

      {/* 링크 */}
      <Text
        style={styles.linkText}
        onPress={() =>
          Linking.openURL(
            'https://www.knps.or.kr/front/portal/safe/acsCtrList.do?menuNo=8000340'
          )
        }
      >
        🔗 공단 통제 정보 전체 보기
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },

  groupCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  parkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailItem: {
    marginBottom: 6,
    paddingLeft: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
  },

  linkText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 24,
  },
});
