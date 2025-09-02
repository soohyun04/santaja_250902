import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

export default function CourseDetail() {
  const webviewRef = useRef<WebView>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const sendToWebView = useCallback((lat: number, lng: number) => {
    if (isWebViewReady && webviewRef.current) {
      const message = JSON.stringify({ type: 'gps', lat, lng });
      webviewRef.current.postMessage(message);
    }
  }, [isWebViewReady]);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한이 필요합니다.');
        return;
      }

      const firstLoc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });
      sendToWebView(firstLoc.coords.latitude, firstLoc.coords.longitude);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          sendToWebView(loc.coords.latitude, loc.coords.longitude);
        }
      );
    })();

    return () => subscription?.remove();
  }, [sendToWebView]);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Course Map</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>html, body, #map { margin: 0; height: 100%; }</style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([37.6891, 127.0469], 13);

        L.tileLayer('http://xdworld.vworld.kr:8080/2d/Base/201802/{z}/{x}/{y}.png', {
          crossOrigin: 'anonymous'
        }).addTo(map);

        L.tileLayer.wms('http://192.168.219.101:8080/geoserver/finaltest/wms?', {
          layers: 'finaltest:NEW_WG_MT_WAY',
          format: 'image/png',
          transparent: true,
          CQL_FILTER: "MNTN_NM='도봉산_자운봉'"
        }).addTo(map);

        let gpsDot = null;

        document.addEventListener('message', function (event) {
          const data = JSON.parse(event.data);
          if (data.type === 'gps') {
            const latlng = [data.lat, data.lng];

            if (!gpsDot) {
              gpsDot = L.circleMarker(latlng, {
                radius: 7,
                color: 'white',
                weight:1,
                fillColor: 'red',
                fillOpacity: 1.0
              }).addTo(map);
            } else {
              gpsDot.setLatLng(latlng);
            }

            map.flyTo(latlng, 17);
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={() => setIsWebViewReady(true)}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

//OpenStreetMaps
// import React, { useEffect, useRef, useState } from 'react';
// import { View, StyleSheet, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import * as Location from 'expo-location';

// export default function App() {
//   const webviewRef = useRef<WebView>(null);
//   const [isWebViewReady, setIsWebViewReady] = useState(false);

//   useEffect(() => {
//     let subscription: Location.LocationSubscription;

//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('위치 권한이 필요합니다.');
//         return;
//       }

//       subscription = await Location.watchPositionAsync(
//         {
//           accuracy: Location.Accuracy.Balanced, // 빠르고 충분한 정확도
//           timeInterval: 2000,
//           distanceInterval: 1,
//         },
//         (loc) => {
//           const { latitude, longitude } = loc.coords;
//           console.log('📍 위치 수신:', latitude, longitude);

//           if (isWebViewReady && webviewRef.current) {
//             const message = JSON.stringify({
//               type: 'gps',
//               lat: latitude,
//               lng: longitude,
//             });
//             webviewRef.current.postMessage(message);
//           }
//         }
//       );
//     })();

//     return () => subscription?.remove();
//   }, [isWebViewReady]);

//   const mapHtml = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <title>GPS Test</title>
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <style>html, body, #map { height: 100%; margin: 0; }</style>
//       <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
//       <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
//     </head>
//     <body>
//       <div id="map"></div>
//       <script>
//         const map = L.map('map').setView([37.5665, 126.9780], 13);
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: '© OpenStreetMap contributors'
//         }).addTo(map);

//         let gpsDot = null;

//         document.addEventListener('message', function (event) {
//           const data = JSON.parse(event.data);
//           if (data.type === 'gps') {
//             const latlng = [data.lat, data.lng];
//             if (!gpsDot) {
//               gpsDot = L.circleMarker(latlng, {
//                 radius: 6,
//                 color: 'red',
//                 fillColor: 'red',
//                 fillOpacity: 1.0
//               }).addTo(map);
//             } else {
//               gpsDot.setLatLng(latlng);
//             }
//             map.flyTo(latlng, 17);
//           }
//         });
//       </script>
//     </body>
//     </html>
//   `;

//   return (
//     <View style={styles.container}>
//       <WebView
//         ref={webviewRef}
//         originWhitelist={['*']}
//         source={{ html: mapHtml }}
//         javaScriptEnabled
//         domStorageEnabled
//         onLoadEnd={() => setIsWebViewReady(true)}
//         style={{ flex: 1 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });


