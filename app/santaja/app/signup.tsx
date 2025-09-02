// app/signup.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';

// POST 방식 API 함수 수정: 모두 JSON 객체 반환 가정
async function checkIdDuplicate(id: string) {
  try {
    const response = await fetch('http://10.0.2.2:8082/users/check-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: id }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    // JSON 형태로 반환된다고 가정
    const data = await response.json();
    return data; // { message: string, status: boolean }
  } catch (error: any) {
    console.error('오류 발생:', error.message);
    throw new Error('서버 오류: ${error.message}');
  }
}

async function checkEmailDuplicate(email: string) {
  try {
    const response = await fetch('http://10.0.2.2:8082/users/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    return data; // { message: string, status: boolean }
  } catch (error: any) {
    console.error('오류 발생:', error.message);
    throw new Error('서버 오류: ${error.message}');
  }
}

async function signupUser(data: {loginId: string; email: string; password: string}) {
  const response = await fetch('http://10.0.2.2:8082/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('회원가입 실패');
  return response.json();
}

export default function SignupStep1() {
  const router = useRouter();
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const onCheckId = async () => {
    if (!loginId) return Alert.alert('아이디를 입력해주세요.');
    try {
      const res = await checkIdDuplicate(loginId); // 객체로 받음
      Alert.alert(res.message);
    } catch (e: any) {
      console.error('아이디 중복 확인 오류:', e.message);
      Alert.alert('아이디 확인 중 오류가 발생했습니다.');
    }
  };

  const onCheckEmail = async () => {
    if (!email) return Alert.alert('이메일을 입력해주세요.');

    try {
      const res = await checkEmailDuplicate(email);
      Alert.alert(res.message);
    } catch (e: any) {
      console.error('이메일 중복 확인 오류:', e.message);
      Alert.alert('이메일 확인 중 오류가 발생했습니다.');
    }
  };

  const onNext = () => {
    if (!loginId || !email || !password || !confirmPw)
      return Alert.alert('모든 필드를 입력해주세요.');
    if (password !== confirmPw)
      return Alert.alert('비밀번호가 일치하지 않습니다.');
    router.push({ pathname: '/signup_2', params: { loginId, email, password } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>회원가입</Text>
      </View>

      <Text style={styles.label}>아이디</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={loginId}
          onChangeText={setLoginId}
          placeholder="아이디를 입력해 주세요."
        />
        <TouchableOpacity style={styles.btn} onPress={onCheckId}>
          <Text style={styles.btnText}>중복확인</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>이메일</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="이메일을 입력해 주세요."
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.btn} onPress={onCheckEmail}>
          <Text style={styles.btnText}>중복확인</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>비밀번호</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호를 입력해 주세요."
          secureTextEntry
        />
      </View>

      <Text style={styles.label}>비밀번호 확인</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={confirmPw}
          onChangeText={setConfirmPw}
          placeholder="비밀번호를 다시 입력해 주세요."
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
        <Text style={styles.nextText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff' 
  },

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
    color: '#333' 
  },

  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center',
  },
    
  label: { 
    marginTop: 20, 
    marginBottom: 8, 
    fontSize: 14, 
    color: '#333' 
  },

  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 4, 
  },

  input: {
    flex: 1, 
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: Platform.OS === 'ios' ? 6 : 2,
    marginRight: 8,
  },

  btn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    backgroundColor: '#ddd', 
    borderRadius: 4,
  },

  btnText: { 
    fontSize: 12,
  },

  nextBtn: { 
    marginTop: 24, 
    backgroundColor: '#e0c3ff', 
    padding: 12, 
    borderRadius: 4,
  },

  nextText: { 
    textAlign: 'center', 
    color: '#fff', 
    fontWeight: 'bold',
  },
});