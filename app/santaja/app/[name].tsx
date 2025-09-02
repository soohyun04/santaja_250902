import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);

  const mountainTitle = '도봉산';
  const mountainHeight = '740m';
  const mountainRegion = '서울·경기';
  const bgImage = require('../assets/images/dobongsan.jpg');

  useEffect(() => {
    setTimeout(() => {
      setWeather({
        times: ['03시', '06시', '09시', '12시', '15시', '18시', '21시'],
        temps: [7, 7, 8, 10, 11, 10, 8],
      });
      setLoading(false);
    }, 500);
  }, []);

// //geoserver
const mapHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaflet WMS Example</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        #map {
            width: 100%;
            height: 500px;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
        // 지도 초기화 - 도봉산 중심 좌표와 줌 레벨 설정
        const map = L.map('map').setView([37.6891, 127.0469], 13);

        // 브이월드 배경지도 추가
        L.tileLayer('http://xdworld.vworld.kr:8080/2d/Base/201802/{z}/{x}/{y}.png', {
            crossOrigin: 'anonymous'
        }).addTo(map);

        // GeoServer WMS 레이어 추가
        const wmsLayer = L.tileLayer.wms('http://192.168.219.101:8080/geoserver/finaltest/wms?', {
            layers: 'finaltest:NEW_WG_MT_WAY',
            format: 'image/png',
            transparent: true,
            CQL_FILTER: "MNTN_NM='도봉산_자운봉'",
        }).addTo(map);
    </script>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.backIcon}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
        scrollEnabled={scrollEnabled}
        nestedScrollEnabled={true}
      >
        <ImageBackground source={bgImage} style={styles.headerBg} />

        <View style={styles.card}>
          <Text style={styles.title}>{mountainTitle}</Text>
          <View style={styles.subRow}>
            <Text style={styles.meta}>{mountainHeight}</Text>
            <Text style={styles.meta}>|</Text>
            <Text style={styles.meta}>{mountainRegion}</Text>
          </View>
        </View>

        <View style={styles.controlCard}>
          <Text style={styles.controlTitle}>실시간 통제정보</Text>
          <View style={styles.controlTabs}>
            <Text style={styles.controlTabActive}>북한산도봉</Text>
            <Text style={styles.controlTab}>부분통제</Text>
          </View>
        </View>

        <View style={styles.weatherCard}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <View style={styles.weatherRow}>
                {weather.times.map((t: string, i: number) => (
                  <View key={i} style={styles.weatherCell}>
                    <Text style={styles.weatherTime}>{t}</Text>
                    <Text style={styles.weatherTemp}>
                      {weather.temps[i]}°C
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.sun}>일출 06:14   일몰 18:55</Text>
            </>
          )}
        </View>

        <View
          style={styles.mapContainer}
          onTouchStart={() => setScrollEnabled(false)}
          onTouchMove={() => setScrollEnabled(false)}
          onTouchEnd={() => setScrollEnabled(true)}
        >
          <WebView
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            style={styles.map}
            javaScriptEnabled
            domStorageEnabled
            mixedContentMode="always"
            allowUniversalAccessFromFileURLs
            cacheEnabled={false}
          />
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>총 6개 코스</Text>
          <Text style={styles.listSort}>
            인기순·난이도순·시간순·거리순
          </Text>
        </View>

        {[
          { name: '신선대 코스', diff: '어려움', time: '2시간', dist: '3.3km' },
          { name: '오봉 코스', diff: '보통', time: '1시간 30분', dist: '3.5km' },
          { name: '우이암 코스', diff: '쉬움', time: '1시간 30분', dist: '3.0km' },
        ].map((c, i) => (
          <TouchableOpacity
            key={i} 
            style={styles.courseCard}
            onPress={() => router.push('../course-detail')}
          >
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{c.name}</Text>
              <Text
                style={[
                  styles.courseDiff,
                  c.diff === '어려움'
                    ? { color: '#d9534f' }
                    : c.diff === '보통'
                    ? { color: '#ff8c00' }
                    : { color: '#5cb85c' },
                ]}
              >
                {c.diff}
              </Text>
            </View>
            <View style={styles.courseMeta}>
              <Text style={styles.courseMetaText}>{c.time}</Text>
              <Text style={styles.courseMetaText}>{c.dist}</Text>
            </View>
            <Text style={styles.chevron}>{'>'}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  headerBg: { width, height: 200 },
  backBtn: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.8)', padding: 6, borderRadius: 4, zIndex: 10 },
  backIcon: { fontSize: 20, color: '#333' },
  scrollContent: { paddingBottom: 16 },
  card: { marginTop: -40, marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 3 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subRow: { flexDirection: 'row', marginTop: 8 },
  meta: { marginHorizontal: 4, color: '#666' },
  controlCard: { flexDirection: 'row', margin: 16, backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center', elevation: 2 },
  controlTitle: { fontWeight: 'bold', marginRight: 12 },
  controlTabs: { flexDirection: 'row' },
  controlTab: { marginHorizontal: 8, color: '#999' },
  controlTabActive: { marginHorizontal: 8, fontWeight: 'bold' },
  weatherCard: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 8, padding: 12, elevation: 2 },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherCell: { alignItems: 'center' },
  weatherTime: { color: '#666' },
  weatherTemp: { fontWeight: 'bold' },
  sun: { textAlign: 'center', marginTop: 8, color: '#666' },
  mapContainer: { height: 250, margin: 16, borderRadius: 8, overflow: 'hidden' },
  map: { flex: 1 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 8, paddingBottom: 4 },
  listTitle: { fontWeight: 'bold' },
  listSort: { color: '#999' },
  courseCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 4, borderRadius: 8, padding: 12, alignItems: 'center', elevation: 1 },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 16 },
  courseDiff: { marginTop: 4, fontSize: 12 },
  courseMeta: { alignItems: 'flex-end', marginRight: 8 },
  courseMetaText: { fontSize: 12, color: '#666' },
  chevron: { fontSize: 18, color: '#ccc' },
});