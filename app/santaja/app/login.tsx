// app/login.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  if (!id || !password) {
    Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해 주세요.');
    return;
  }

  try {
    const response = await fetch('http://10.0.2.2:8082/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: id, password }),
      credentials: 'include',
    });

    const result = await response.json();
    console.log('서버 응답 본문:', result);

    if (!response.ok) {
      Alert.alert('로그인 실패', result.message || '아이디 또는 비밀번호가 틀렸습니다.');
      return;
    }

    // 응답 헤더에서 Authorization 토큰 꺼내기
    const authHeader = response.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Alert.alert('로그인 실패', '토큰이 응답 헤더에 없습니다.');
      return;
    }

    const token = authHeader.substring(7);

    await AsyncStorage.setItem('accessToken', token);
    Alert.alert('로그인 성공');
    setId('');
    setPassword('');
    router.replace('/');

  } catch (err: any) {
    console.error('로그인 에러:', err.message);
    Alert.alert('서버 오류', '서버와의 연결에 문제가 있음');
  }
};

  // 토큰을 헤더에 넣어서 인증 요청 보내는 예시 함수
  const fetchWithToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('인증 실패', '토큰이 없습니다. 로그인 해주세요.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8082/protected-resource', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        Alert.alert('오류', '인증된 요청에 실패했습니다.');
        return;
      }

      const data = await response.json();
      console.log('인증된 API 응답:', data);
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* HEADER */}
      <View style={styles.loginHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>{'< '}</Text>
        </TouchableOpacity>
        <Text style={styles.loginTitle}>산타자 로그인</Text>
        <View style={styles.backPlaceholder} />
      </View>

      {/* INPUT FIELDS */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>아이디</Text>
        <TextInput
          value={id}
          onChangeText={setId}
          placeholder="아이디를 입력해 주세요."
          style={styles.input}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호를 입력해 주세요."
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* LOGIN BUTTON */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* LINKS */}
      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => router.push('../find-id')}>
          <Text style={styles.linkText}>아이디 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.linkDivider}>|</Text>
        <TouchableOpacity onPress={() => router.push('../find-pw')}>
          <Text style={styles.linkText}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.linkDivider}>|</Text>
        <TouchableOpacity onPress={() => router.push('../signup')}>
          <Text style={styles.linkText}>회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* SOCIAL LOGIN */}
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/images/kakao.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/images/naver.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/images/google.png')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>

      {/* FOOTER LOGO */}
      <View style={styles.footerLogo}>
        <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20, 
    marginBottom: 40,
  },
  backText: {
    fontSize: 24,
  },
  loginTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backPlaceholder: {
    width: 24,
  },

  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 40,
  },

  loginButton: {
    marginTop: 24,
    backgroundColor: '#e0c3ff',
    padding: 12,
    borderRadius: 4,
  },
  loginButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  linkText: {
    fontSize: 12,
    color: '#555',
  },
  linkDivider: {
    fontSize: 12,
    color: '#aaa',
    marginHorizontal: 8,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 32,
  },
  socialButton: {
    padding: 8,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },

  footerLogo: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 25,
    height: 25,
  },
});