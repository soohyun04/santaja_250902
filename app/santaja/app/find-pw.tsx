import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FindPasswordScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyUser = async () => {
  if (!userId.trim()) {
    Alert.alert('입력 오류', '이메일을 입력해주세요.');
    return;
  }

  try {
    const response = await fetch('http://10.0.2.2:8082/users/find-pw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userId }),
    });

    const result = await response.json();

    if (response.ok && result.exists) {
      setIsVerified(true);
      Alert.alert('인증번호 발송', '입력하신 이메일로 인증번호가 전송되었습니다.');
    } else {
      Alert.alert('확인 실패', '존재하지 않는 이메일입니다.');
    }
  } catch (error: any) {
    console.error('오류 발생:', error.message);
    throw new Error(`서버 오류: ${error.message}`);
  }
};

  const handleSubmitAuthCode = () => {
    if (authCode.trim().length === 0) {
      Alert.alert('오류', '인증번호를 입력해주세요.');
      return;
    }

    Alert.alert('인증 성공', '비밀번호 재설정 페이지로 이동합니다.');
    router.push('/find-pw_2');
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호 찾기</Text>
      </View>

      {/* 이메일 입력 + 인증 버튼 */}
      <View style={styles.row}>
        <TextInput
          style={styles.emailInput}
          value={userId}
          onChangeText={setUserId}
          placeholder="이메일"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyUser}>
          <Text style={styles.verifyButtonText}>인증</Text>
        </TouchableOpacity>
      </View>

      {/* 인증번호 입력 */}
      <TextInput
        style={styles.input}
        value={authCode}
        onChangeText={setAuthCode}
        placeholder="인증번호"
        keyboardType="number-pad"
      />

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleSubmitAuthCode}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>

      {/* LINKS */}
      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>로그인</Text>
        </TouchableOpacity>
        <Text style={styles.linkDivider}>|</Text>
        <TouchableOpacity onPress={() => router.push('/find-id')}>
          <Text style={styles.linkText}>아이디 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! : 60,
    backgroundColor: '#fff',
  },

  // HEADER
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 24,
    position: 'relative',
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // FORM
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
  },
  emailInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  verifyButton: {
    backgroundColor: '#e5c4f3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#e5c4f3',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // LINKS
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  linkText: {
    fontSize: 12,
    color: '#555',
    marginHorizontal: 8,
  },
  linkDivider: {
    fontSize: 12,
    color: '#aaa',
  },
});