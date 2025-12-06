import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import Button from '../components/UI/Button';

const services = [
  { id: '1', name: 'Corte de Cabelo', price: 'R$ 40', time: '30 min', icon: 'content-cut' },
  { id: '2', name: 'Barba', price: 'R$ 30', time: '20 min', icon: 'face' },
  { id: '3', name: 'Corte + Barba', price: 'R$ 60', time: '50 min', icon: 'spa' },
  { id: '4', name: 'Sobrancelha', price: 'R$ 15', time: '10 min', icon: 'remove-red-eye' },
];

const featuredBarbers = [
  { id: '1', name: 'João Silva', rating: 4.8, specialty: 'Corte Moderno' },
  { id: '2', name: 'Carlos Santos', rating: 4.9, specialty: 'Barba' },
  { id: '3', name: 'Miguel Oliveira', rating: 4.7, specialty: 'Navalha' },
];

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [nextAppointment, setNextAppointment] = useState(null);
  const [points, setPoints] = useState(120);

  useEffect(() => {
    // Buscar próximo agendamento
    // Mock data
    setNextAppointment({
      date: '2024-12-20',
      time: '14:30',
      barber: 'João Silva',
      service: 'Corte + Barba',
    });
  }, []);

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={[styles.serviceCard, { backgroundColor: theme.background, borderColor: theme.primary }]}
      onPress={() => navigation.navigate('Schedule')}
    >
      <MaterialIcons name={item.icon} size={30} color={theme.primary} />
      <Text style={[styles.serviceName, { color: theme.text }]}>{item.name}</Text>
      <Text style={[styles.servicePrice, { color: theme.primary }]}>{item.price}</Text>
      <Text style={[styles.serviceTime, { color: theme.text, opacity: 0.7 }]}>{item.time}</Text>
    </TouchableOpacity>
  );

  const renderBarber = ({ item }) => (
    <TouchableOpacity
      style={[styles.barberCard, { backgroundColor: theme.background }]}
      onPress={() => navigation.navigate('Barbers')}
    >
      <View style={[styles.barberAvatar, { backgroundColor: theme.primary + '20' }]}>
        <Text style={[styles.barberInitial, { color: theme.primary }]}>
          {item.name.charAt(0)}
        </Text>
      </View>
      <View style={styles.barberInfo}>
        <Text style={[styles.barberName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.barberSpecialty, { color: theme.text, opacity: 0.7 }]}>
          {item.specialty}
        </Text>
        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={16} color="#FFD700" />
          <Text style={[styles.rating, { color: theme.text }]}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header com pontos */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcome, { color: theme.text }]}>Bem-vindo,</Text>
          <Text style={[styles.userName, { color: theme.primary }]}>Cliente</Text>
        </View>
        <TouchableOpacity
          style={[styles.pointsCard, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <MaterialIcons name="loyalty" size={24} color="#FFF" />
          <Text style={styles.pointsText}>{points} pts</Text>
        </TouchableOpacity>
      </View>

      {/* Próximo agendamento */}
      {nextAppointment && (
        <TouchableOpacity
          style={[styles.appointmentCard, { backgroundColor: theme.primary + '20' }]}
          onPress={() => navigation.navigate('Agenda')}
        >
          <View style={styles.appointmentHeader}>
            <MaterialIcons name="event" size={24} color={theme.primary} />
            <Text style={[styles.appointmentTitle, { color: theme.primary }]}>
              Próximo Agendamento
            </Text>
          </View>
          <Text style={[styles.appointmentDetail, { color: theme.text }]}>
            {nextAppointment.date} • {nextAppointment.time}
          </Text>
          <Text style={[styles.appointmentDetail, { color: theme.text }]}>
            {nextAppointment.barber} • {nextAppointment.service}
          </Text>
        </TouchableOpacity>
      )}

      {/* Serviços */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Serviços</Text>
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.servicesList}
        />
      </View>

      {/* Barbeiros em Destaque */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Barbeiros em Destaque</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Barbers')}>
            <Text style={{ color: theme.primary }}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredBarbers}
          renderItem={renderBarber}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.barbersList}
        />
      </View>

      {/* Botão Agendar */}
      <View style={styles.section}>
        <Button
          title="Agendar Horário"
          onPress={() => navigation.navigate('Schedule')}
          style={styles.scheduleButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 14,
    opacity: 0.7,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointsText: {
    color: '#FFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  appointmentCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  appointmentTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicesList: {
    paddingLeft: 20,
  },
  barbersList: {
    paddingLeft: 20,
  },
  serviceCard: {
    width: 120,
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 1,
    alignItems: 'center',
  },
  serviceName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  serviceTime: {
    fontSize: 12,
    marginTop: 5,
  },
  barberCard: {
    width: 160,
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  barberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barberInitial: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  barberInfo: {
    marginLeft: 10,
    flex: 1,
  },
  barberName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  barberSpecialty: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 12,
  },
  scheduleButton: {
    marginHorizontal: 20,
  },
});