import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '../theme/ThemeContext';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

const loginSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
});

const registerSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Senhas não conferem')
    .required('Confirme sua senha'),
});

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onLogin = async (data) => {
    setLoading(true);
    try {
      console.log('Login data:', data);
      // Implementar login com Firebase
      navigation.replace('Main');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data) => {
    setLoading(true);
    try {
      console.log('Register data:', data);
      // Implementar registro com Firebase
      navigation.replace('Main');
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.primary }]}>
            BarberShop
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {isLogin ? 'Faça login para continuar' : 'Crie sua conta'}
          </Text>
        </View>

        {isLogin ? (
          <View style={styles.form}>
            <Input
              control={loginControl}
              name="email"
              label="Email"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={loginErrors.email?.message}
            />
            <Input
              control={loginControl}
              name="password"
              label="Senha"
              placeholder="••••••"
              secureTextEntry
              error={loginErrors.password?.message}
            />
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={{ color: theme.primary }}>Esqueci minha senha</Text>
            </TouchableOpacity>

            <Button
              title="Entrar"
              onPress={handleLoginSubmit(onLogin)}
              loading={loading}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Input
              control={registerControl}
              name="name"
              label="Nome Completo"
              placeholder="João Silva"
              error={registerErrors.name?.message}
            />
            <Input
              control={registerControl}
              name="email"
              label="Email"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={registerErrors.email?.message}
            />
            <Input
              control={registerControl}
              name="phone"
              label="Telefone"
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
              error={registerErrors.phone?.message}
            />
            <Input
              control={registerControl}
              name="password"
              label="Senha"
              placeholder="••••••"
              secureTextEntry
              error={registerErrors.password?.message}
            />
            <Input
              control={registerControl}
              name="confirmPassword"
              label="Confirmar Senha"
              placeholder="••••••"
              secureTextEntry
              error={registerErrors.confirmPassword?.message}
            />

            <Button
              title="Cadastrar"
              onPress={handleRegisterSubmit(onRegister)}
              loading={loading}
            />
          </View>
        )}

        <TouchableOpacity
          style={styles.switchMode}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={{ color: theme.text }}>
            {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
            <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  switchMode: {
    alignItems: 'center',
    marginTop: 20,
  },
});