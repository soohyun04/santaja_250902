//import { Platform } from 'react-native';

// 개발할 때만 LAN IP, 운영 빌드 땐 프로덕션 도메인
const LOCAL_IP = '192.168.55.127';  // ← PC에서 ifconfig/ipconfig 로 확인한 IP
export const BASE_URL = __DEV__
  ? `http://${LOCAL_IP}:8080`
  : 'https://your.production.server.com';
