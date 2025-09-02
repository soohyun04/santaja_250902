// app/find-id.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FindIdScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState<string | null>(null);

  const handleFindId = async () => {
    if (!email || !email.includes('@')) {
      alert('유효한 이메일을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:8082/users/find-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Response:', data);
        setFoundId(data.loginId);
      } else {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        setFoundId(null);
        alert('아이디를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setFoundId(null);
      alert('서버 연결에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>아이디 찾기</Text>
      </View>

      {/* BODY */}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="이메일을 입력하세요"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleFindId}>
        <Text style={styles.buttonText}>아이디 찾기</Text>
      </TouchableOpacity>

      {foundId && (
        <Text style={styles.resultText}>
          입력하신 이메일의 아이디는 {'< ' + foundId + ' >'}입니다
        </Text>
      )}

      <View style={styles.linkRow}>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>로그인</Text>
        </TouchableOpacity>
        <Text style={styles.linkDivider}>|</Text>
        <TouchableOpacity onPress={() => router.push('/find-pw')}>
          <Text style={styles.linkText}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  back: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e0c3ff',
    height: 45,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultText: {
    fontSize: 16,
    color: '#888',
    marginTop: 22,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    alignItems: 'center',
  },
  linkText: {
    color: '#555',
    fontSize: 12,
    marginHorizontal: 8,
  },
  linkDivider: {
    fontSize: 12,
    color: '#aaa',
  },
});