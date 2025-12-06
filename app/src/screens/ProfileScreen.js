import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const menuItems = [
  { id: '1', icon: 'payment', title: 'Pagamentos', screen: 'Payments' },
  { id: '2', icon: 'history', title: 'Histórico', screen: 'History' },
  { id: '3', icon: 'star', title: 'Avaliações', screen: 'Ratings' },
  { id: '4', icon: 'notifications', title: 'Notificações', screen: 'Notifications' },
  { id: '5', icon: 'help', title: 'Ajuda', screen: 'Help' },
  { id: '6', icon: 'info', title: 'Sobre', screen: 'About' },
];

export default function ProfileScreen({ navigation }) {
  const { theme, toggleTheme, isDarkMode, toggleDarkMode } = useTheme();
  const { user, userData, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: user?.email || '',
    phone: userData?.phone || '',
  });

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Auth');
          }
        },
      ]
    );
  };

  const handleSave = async () => {
    // Implementar salvamento
    setEditing(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header do Perfil */}
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {userData?.name?.charAt(0) || 'U'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatarButton}>
            <MaterialIcons name="edit" size={16} color="#FFF" />
          </TouchableOpacity>
        </TouchableOpacity>
        
        <Text style={[styles.userName, { color: theme.text }]}>
          {userData?.name || 'Usuário'}
        </Text>
        <Text style={[styles.userEmail, { color: theme.text, opacity: 0.7 }]}>
          {user?.email}
        </Text>
      </View>

      {/* Informações do Perfil */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Informações Pessoais
          </Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <MaterialIcons 
              name={editing ? 'close' : 'edit'} 
              size={24} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        </View>

        {editing ? (
          <View style={styles.editForm}>
            <Input
              label="Nome"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Seu nome"
            />
            <Input
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              placeholder="seu@email.com"
              keyboardType="email-address"
              editable={false}
            />
            <Input
              label="Telefone"
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />
            <Button
              title="Salvar Alterações"
              onPress={handleSave}
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MaterialIcons name="person" size={20} color={theme.text} style={{ opacity: 0.7 }} />
              <Text style={[styles.infoLabel, { color: theme.text }]}>Nome</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{formData.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="email" size={20} color={theme.text} style={{ opacity: 0.7 }} />
              <Text style={[styles.infoLabel, { color: theme.text }]}>Email</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{formData.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="phone" size={20} color={theme.text} style={{ opacity: 0.7 }} />
              <Text style={[styles.infoLabel, { color: theme.text }]}>Telefone</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{formData.phone}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Configurações */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Configurações</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialIcons name="palette" size={24} color={theme.text} style={{ opacity: 0.7 }} />
            <Text style={[styles.settingText, { color: theme.text }]}>Tema da Barbearia</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme}>
            <View style={[styles.themeToggle, { backgroundColor: theme.primary }]}>
              <Text style={styles.themeText}>
                {theme === colorPalettes.urban ? 'Urbano' : 'Premium'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialIcons name="dark-mode" size={24} color={theme.text} style={{ opacity: 0.7 }} />
            <Text style={[styles.settingText, { color: theme.text }]}>Modo Escuro</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: theme.primary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <MaterialIcons name="notifications" size={24} color={theme.text} style={{ opacity: 0.7 }} />
            <Text style={[styles.settingText, { color: theme.text }]}>Notificações</Text>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: '#767577', true: theme.primary }}
          />
        </View>
      </View>

      {/* Menu */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Menu</Text>
        
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuLeft}>
              <MaterialIcons name={item.icon} size={24} color={theme.primary} />
              <Text style={[styles.menuText, { color: theme.text }]}>{item.title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão Sair */}
      <View style={styles.logoutSection}>
        <Button
          title="Sair"
          onPress={handleLogout}
          variant="accent"
          style={styles.logoutButton}
        />
        <Text style={[styles.versionText, { color: theme.text, opacity: 0.5 }]}>
          Versão 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editForm: {
    marginTop: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  themeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  themeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
  logoutSection: {
    padding: 20,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    marginBottom: 15,
  },
  versionText: {
    fontSize: 12,
  },
});