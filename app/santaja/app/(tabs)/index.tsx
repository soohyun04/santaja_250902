import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import dobongImg from '../../assets/images/dobongsan.jpg';
import bukhansanImg from '../../assets/images/bukhansan.jpg';
import suraksanImg from '../../assets/images/suraksan.jpg';

export default function HomeScreen() {
  const router = useRouter();
  const [noticeText, setNoticeText] = useState('불러오는 중...');

  useEffect(() => {
    const URL = 'http://192.168.219.104:3001/api/knps-notices'; // ⚠️ 실제 IP로 교체

    fetch(URL)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((item: any) => item.status === '부분통제');
        const uniqueParks = Array.from(new Set(filtered.map((i: any) => i.park)));

        if (uniqueParks.length === 0) {
          setNoticeText('현재 통제 중인 국립공원이 없습니다');
        } else {
          const show = uniqueParks.slice(0, 2).join(', ');
          const rest = uniqueParks.length - 2;
          const text =
            uniqueParks.length > 2
              ? `통제 중: ${show} 외 ${rest}곳`
              : `통제 중: ${show}`;
          setNoticeText(text);
        }
      })
      .catch(err => {
        console.error('공지사항 오류:', err);
        setNoticeText('공지사항을 불러오지 못했습니다');
      });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logo}>산타자</Text>

        <TouchableOpacity
          style={styles.alertContainer}
          onPress={() => router.push('/notice/notice-webview')}
        >
          <Text numberOfLines={1} style={styles.alertText}>
            <Text style={styles.alertBadge}>알림</Text>
            {'  '}
            {noticeText}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={wp('4.5%')} color="#999" />
        <TextInput placeholder="검색" style={styles.searchInput} />
      </View>

      <Text style={styles.sectionTitle}>오늘의 추천 코스</Text>
      <Text style={styles.sectionSubtitle}>이번 주에는 여기 어떠세요?</Text>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push('../[name].tsx')}
      >
        <Image source={dobongImg} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>도봉산</Text>
          <View style={styles.row}>
            <Text style={styles.level}>보통</Text>
            <Text style={styles.info}>1시간 30분</Text>
            <Text style={styles.info}>3.3km</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>주변엔 이런 산이 있어요!</Text>
      <View style={styles.nearList}>
        {[
          { name: '북한산', height: '836m', region: '서울·경기', source: bukhansanImg },
          { name: '수락산', height: '637m', region: '서울', source: suraksanImg },
        ].map((item) => (
          <View key={item.name} style={styles.smallCard}>
            <Image source={item.source} style={styles.smallImage} />
            <View style={styles.smallInfo}>
              <Text style={styles.smallTitle}>{item.name}</Text>
              <Text style={styles.smallText}>{item.height}</Text>
              <Text style={styles.smallText}>{item.region}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>이달의 트래커</Text>
      <View style={styles.trackerGrid}>
        {Array.from({ length: 9 }).map((_, i) => (
          <View key={i} style={styles.trackerCell}>
            <Text style={styles.rank}>{i + 1}등</Text>
            <Text style={styles.name}>OOO님</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: wp('4%'),
    paddingBottom: hp('10%'),
  },

  header: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
    gap: hp('1%')
  },
  logo: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: wp('2%'),
    width: '100%',
    height: hp('5%')
  },
  alertBadge: {
    backgroundColor: '#ff6f61',
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('1%'),
    marginRight: wp('1%'),
  },
  alertText: {
    fontSize: wp('3%'),
    color: '#d9534f',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
    padding: wp('2%'),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    height: hp('6%')
  },
  searchInput: {
    marginLeft: wp('2%'),
    flex: 1,
    height: hp('4.5%'),
    fontSize: wp('3.5%'),
    color: '#000000'
  },

  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginTop: hp('3%'),
  },
  sectionSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('1.5%'),
  },

  card: {
    borderRadius: wp('2%'),
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  cardImage: {
    width: '100%',
    height: hp('25%'),
  },
  cardContent: {
    padding: wp('3%'),
  },
  cardTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginTop: hp('1%'),
    justifyContent: 'space-between',
  },
  level: {
    fontSize: wp('3%'),
    color: '#ff8c00',
  },
  info: {
    fontSize: wp('3%'),
    color: '#333',
  },

  nearList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  smallCard: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    borderRadius: wp('2%'),
    overflow: 'hidden',
  },
  smallImage: {
    width: '100%',
    height: hp('13%'),
  },
  smallInfo: {
    padding: wp('2%'),
  },
  smallTitle: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
  },
  smallText: {
    fontSize: wp('3%'),
    color: '#555',
  },

  trackerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp('1.5%'),
  },
  trackerCell: {
    width: '33%',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  rank: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  name: {
    fontSize: wp('3.5%'),
    color: '#333',
  },
});


