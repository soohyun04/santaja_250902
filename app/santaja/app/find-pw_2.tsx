import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email] = useState('test@example.com'); // 테스트용 임시 이메일

  const handleChangePassword = async () => {
    if (newPassword.length < 4) {
      Alert.alert('오류', '비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8082/users/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        Alert.alert('성공', '비밀번호가 변경되었습니다.');
        router.replace('/login');
      } else {
        Alert.alert('실패', '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>비밀번호 변경</Text>
      </View>

      {/* FORM */}
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="새 비밀번호"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="비밀번호 확인"
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
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
});