import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
];

const services = [
  { id: '1', name: 'Corte de Cabelo', duration: 30, price: 40 },
  { id: '2', name: 'Barba', duration: 20, price: 30 },
  { id: '3', name: 'Corte + Barba', duration: 50, price: 60 },
  { id: '4', name: 'Sobrancelha', duration: 10, price: 15 },
];

const barbers = [
  { id: '1', name: 'João Silva', rating: 4.8, available: true },
  { id: '2', name: 'Carlos Santos', rating: 4.9, available: true },
  { id: '3', name: 'Miguel Oliveira', rating: 4.7, available: false },
];

export default function ScheduleScreen() {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Inicializar com data atual
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime || !selectedService || !selectedBarber) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmAppointment = () => {
    // Salvar agendamento no Firebase
    console.log('Agendamento confirmado:', {
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
      barber: selectedBarber,
    });
    setShowConfirmModal(false);
    Alert.alert('Sucesso', 'Agendamento confirmado!');
  };

  const renderTimeSlot = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        selectedTime === item && { backgroundColor: theme.primary },
      ]}
      onPress={() => setSelectedTime(item)}
    >
      <Text style={[
        styles.timeText,
        selectedTime === item && { color: '#FFF' },
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.serviceItem,
        selectedService?.id === item.id && { borderColor: theme.primary, borderWidth: 2 },
      ]}
      onPress={() => setSelectedService(item)}
    >
      <Text style={[styles.serviceName, { color: theme.text }]}>{item.name}</Text>
      <Text style={[styles.serviceDuration, { color: theme.text, opacity: 0.7 }]}>
        {item.duration} min
      </Text>
      <Text style={[styles.servicePrice, { color: theme.primary }]}>
        R$ {item.price}
      </Text>
    </TouchableOpacity>
  );

  const renderBarber = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.barberItem,
        selectedBarber?.id === item.id && { borderColor: theme.primary, borderWidth: 2 },
      ]}
      onPress={() => item.available && setSelectedBarber(item)}
      disabled={!item.available}
    >
      <View style={styles.barberHeader}>
        <View style={[styles.barberAvatar, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.barberInitial, { color: theme.primary }]}>
            {item.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.barberInfo}>
          <Text style={[styles.barberName, { color: theme.text }]}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={14} color="#FFD700" />
            <Text style={[styles.rating, { color: theme.text }]}>{item.rating}</Text>
          </View>
        </View>
      </View>
      {!item.available && (
        <Text style={[styles.unavailableText, { color: '#FF3B30' }]}>Indisponível</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Calendário */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Selecione a Data</Text>
        <Calendar
          current={selectedDate}
          minDate={new Date().toISOString().split('T')[0]}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: theme.primary }
          }}
          theme={{
            backgroundColor: theme.background,
            calendarBackground: theme.background,
            textSectionTitleColor: theme.text,
            selectedDayBackgroundColor: theme.primary,
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: theme.primary,
            dayTextColor: theme.text,
            textDisabledColor: '#d9e1e8',
            dotColor: theme.primary,
            selectedDotColor: '#ffffff',
            arrowColor: theme.primary,
            monthTextColor: theme.text,
            indicatorColor: theme.primary,
          }}
        />
      </View>

      {/* Horários */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Horários Disponíveis</Text>
        <FlatList
          data={timeSlots}
          renderItem={renderTimeSlot}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeList}
        />
      </View>

      {/* Serviços */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Serviço</Text>
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.serviceList}
        />
      </View>

      {/* Barbeiros */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Barbeiro</Text>
        <FlatList
          data={barbers}
          renderItem={renderBarber}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.barberList}
        />
      </View>

      {/* Botão Agendar */}
      <View style={styles.buttonContainer}>
        <Button
          title="Confirmar Agendamento"
          onPress={handleSchedule}
        />
      </View>

      {/* Modal de Confirmação */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Confirmar Agendamento</Text>
            
            <View style={styles.confirmationDetails}>
              <Text style={[styles.detailLabel, { color: theme.text }]}>Data:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{selectedDate}</Text>
              
              <Text style={[styles.detailLabel, { color: theme.text }]}>Horário:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{selectedTime}</Text>
              
              <Text style={[styles.detailLabel, { color: theme.text }]}>Serviço:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{selectedService?.name}</Text>
              
              <Text style={[styles.detailLabel, { color: theme.text }]}>Barbeiro:</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{selectedBarber?.name}</Text>
              
              <Text style={[styles.detailLabel, { color: theme.text }]}>Valor:</Text>
              <Text style={[styles.detailValue, { color: theme.primary, fontWeight: 'bold' }]}>
                R$ {selectedService?.price}
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.primary }]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.primary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={confirmAppointment}
              >
                <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timeList: {
    paddingRight: 20,
  },
  timeSlot: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  serviceList: {
    paddingRight: 20,
  },
  serviceItem: {
    width: 150,
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceDuration: {
    fontSize: 12,
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  barberList: {
    paddingRight: 20,
  },
  barberItem: {
    width: 200,
    padding: 15,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  barberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barberInitial: {
    fontSize: 18,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    marginLeft: 5,
    fontSize: 12,
  },
  unavailableText: {
    marginTop: 10,
    fontSize: 12,
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationDetails: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});