// app/signup_2.tsx
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';

export default function SignupStep2() {
  const router = useRouter();
  const { loginId, email, password } = useLocalSearchParams<{
    loginId: string; email: string; password: string;
  }>();

  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthYear, setBirthYear] = useState<string>('2004');
  const years = Array.from({ length: 80 }, (_, i) => 2025 - i);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // 닉네임 중복 확인
  const onCheckName = async () => {
  if (!nickname) return Alert.alert('닉네임을 입력해주세요.');
  
  // 백엔드 연결용 코드, 안드로이드 기기에서 테스트할떈 더미데이터 추가해야함 ~
  try {
    // const response = await fetch('http://10.0.2.2:8082/users/check-name', {
    //   method: 'POST',
    //   body: JSON.stringify({ name: nickname }),
      
    // });

    // const data = await response.json();

    // // 버그 확인용
    // console.log('서버 응답:', data);

    // Alert.alert(data.message);

    // if (data.status === true) {
    //   console.log('사용 가능');
    // } else {
    //   console.log('중복 닉네임');
    // }
  } catch (error) {
    console.error('닉네임 중복 확인 오류:', error);
    Alert.alert('닉네임 확인 중 오류가 발생했습니다.');
  }
};

  const onSubmit = async () => {
    if (!nickname) return Alert.alert('모든 필드를 입력해주세요.');

    const form = new FormData();
    form.append('loginId', loginId!);
    form.append('email', email!);
    form.append('password', password!);
    form.append('nickname', nickname);
    form.append('gender', gender);
    form.append('birthYear', birthYear);
    form.append('nickname', encodeURIComponent(nickname));

    if (avatar) {
      const fileExt = avatar.split('.').pop() ?? 'jpg';
      form.append('profileImage', {
        uri: avatar,
        name: `avatar.${fileExt}`,
        type: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
      } as any);
    }

    try {
      const response = await fetch('http://10.0.2.2:8082/users/signup', {
      method: 'POST',
      body: form, 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '회원가입 실패');
      }

      Alert.alert('회원가입 완료!', '로그인 화면으로 이동합니다.');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('회원가입 실패', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>회원가입</Text>
      </View>

      <Text style={styles.label}>프로필 사진</Text>
      <TouchableOpacity onPress={pickImage} style={styles.avatarBox}>
        {avatar
          ? <Image source={{ uri: avatar }} style={styles.avatar} />
          : <View style={styles.avatarPlaceholder}><Text>+</Text></View>
        }
      </TouchableOpacity>

      <Text style={styles.label}>닉네임</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="닉네임을 입력해 주세요."
        />
        <TouchableOpacity style={styles.btn} onPress={onCheckName}>
          <Text style={styles.btnText}>중복확인</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>성별</Text>
      <View style={styles.genderRow}>
        {['M', 'F'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.genderBtn, gender === g && styles.genderSelected]}
            onPress={() => setGender(g as any)}
          >
            <Text>{g === 'M' ? '남자' : '여자'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>출생년도</Text>
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={birthYear}
          onValueChange={setBirthYear}
        >
          {years.map((y) => (  <Picker.Item key={y} label={`${y}`} value={y} />))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
        <Text style={styles.submitText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 30, backgroundColor: '#fff' },
  header: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 8,
    height: '100%',
    justifyContent: 'center',
  },
  back: {
    fontSize: 24,
    color: '#333',
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    color: '#333'
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    marginRight: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ddd',
    borderRadius: 4
  },
  btnText: { fontSize: 12 },
  genderRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  genderBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
  },
  genderSelected: {
    borderColor: '#a28cff',
    backgroundColor: '#f3e8ff'
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: '#e0c3ff',
    padding: 12,
    borderRadius: 4
  },
  submitText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
});