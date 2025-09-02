import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import profileImg from '../../assets/images/profile.jpg';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');


export default function ProfileScreen() {
  const [tab, setTab] = useState<'tracking' | 'profile'>('tracking');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();


  useEffect(() => {
    const check = async () => {
      setIsLoggedIn(false);
    };
    check();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={styles.center}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={styles.loginPrompt}>로그인이 필요합니다</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')}>
          <Text style={styles.loginButtonText}>로그인 하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const trackingStats = [
    { label: '다녀온 산', value: '20개' },
    { label: '누적고도', value: '48.7KM' },
    { label: '누적시간', value: '43시간' },
  ];

  const savedCourses = [
    {
      title: '도봉산',
      image: require('../../assets/images/dobongsan.jpg'),
      difficulty: '보통',
      time: '1시간 30분',
      distance: '3.3km',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>마이페이지</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setTab('tracking')} style={[styles.tabButton, tab === 'tracking' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'tracking' && styles.tabTextActive]}>마이 트래킹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('profile')} style={[styles.tabButton, tab === 'profile' && styles.tabActive]}>
          <Text style={[styles.tabText, tab === 'profile' && styles.tabTextActive]}>프로필</Text>
        </TouchableOpacity>
      </View>

      {tab === 'tracking' ? (
        <FlatList
          ListHeaderComponent={() => (
            <>
              <View style={styles.statsContainer}>
                {trackingStats.map((item, i) => (
                  <View key={i} style={styles.statBox}>
                    <Text style={styles.statLabel}>{item.label}</Text>
                    <Text style={styles.statValue}>{item.value}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>저장한 등산 코스</Text>
                <TouchableOpacity><Text style={styles.moreText}>더보기 &gt;</Text></TouchableOpacity>
              </View>
            </>
          )}
          data={savedCourses}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <View style={styles.courseCard}>
              <Image source={item.image} style={styles.courseImage} />
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{item.title}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.metaText}>{item.difficulty}</Text>
                  <Text style={styles.metaText}>&#183; {item.time}</Text>
                  <Text style={styles.metaText}>&#183; {item.distance}</Text>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.rankingBox}>
              <Text style={styles.rankingText}>나의 랭킹</Text>
              <Text style={styles.rankingValue}>31위 · 777pt</Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            <Image source={profileImg} style={styles.avatar} />
            <View style={styles.profileText}>
              <Text style={styles.username}>줍스_JUPS</Text>
              <Text style={styles.userId}>아이디: JUPS23</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>변경</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.menuList}>
            {[
              { icon: 'megaphone-outline', label: '공지사항' },
              { icon: 'settings-outline', label: '설정' },
              { icon: 'mail-outline', label: '문의하기' },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuItem}>
                <Ionicons name={item.icon as any} size={20} style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} style={styles.menuArrow} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity><Text style={styles.footerText}>로그아웃</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerText}>회원탈퇴</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginPrompt: { fontSize: 16, marginBottom: 12 },
  loginButton: { backgroundColor: '#007AFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 6 },
  loginButtonText: { color: '#fff', fontSize: 16 },
  header: { position: 'relative', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginTop: 25 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', marginHorizontal: 16 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#000' },
  tabText: { color: '#888' },
  tabTextActive: { color: '#000', fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  statBox: { width: (width - 64) / 3, height: 150, backgroundColor: '#f3e8ff', padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  statLabel: { fontSize: 12, color: '#555' },
  statValue: { fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 23 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  moreText: { fontSize: 14, color: '#a06cff' },
  courseCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 16, borderRadius: 8, elevation: 2, overflow: 'hidden' },
  courseImage: { width: 100, height: 80 },
  courseInfo: { flex: 1, padding: 12 },
  courseTitle: { fontSize: 14, fontWeight: '600' },
  courseMeta: { flexDirection: 'row', marginTop: 8 },
  metaText: { fontSize: 12, color: '#555', marginRight: 8 },
  rankingBox: { margin: 16, padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center' },
  rankingText: { fontSize: 14, color: '#555' },
  rankingValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  profileContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 32, alignItems: 'center' },
  profileInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, width: '100%' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  profileText: { flex: 1 },
  username: { fontSize: 16, fontWeight: '600' },
  userId: { fontSize: 12, color: '#888', marginTop: 4 },
  editButton: { backgroundColor: '#a06cff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  editButtonText: { color: '#fff', fontSize: 12 },
  separator: { height: 1, backgroundColor: '#ddd', marginBottom: 24, width: '100%' },
  menuList: { width: '100%' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 20 },
  menuIcon: { left: 15, marginRight: 17, color: '#555', marginTop: 5 },
  menuLabel: { left: 15, flex: 1, fontSize: 14, color: '#333' },
  menuArrow: { right: 15, color: '#888' },
  footerActions: { marginTop: 40, paddingHorizontal: 16, width: '100%' },
  footerText: { fontSize: 12, color: '#bbb', marginBottom: 12 },
});