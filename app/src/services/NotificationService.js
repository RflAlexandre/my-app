import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  // Solicitar permissões
  async registerForPushNotifications() {
    let token;
    
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Falha ao obter permissão para notificações push!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);
      
      // Salvar token no AsyncStorage
      await AsyncStorage.setItem('@push_token', token);
    } else {
      alert('Notificações push só funcionam em dispositivos físicos!');
    }

    return token;
  },
  
  // Agendar lembrete de agendamento
  async scheduleAppointmentReminder(appointmentDate, appointmentTime, barberName) {
    const reminderDate = new Date(appointmentDate);
    const [hours, minutes] = appointmentTime.split(':');
    reminderDate.setHours(hours, minutes, 0);
    
    // Agendar 2 horas antes
    reminderDate.setHours(reminderDate.getHours() - 2);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete de Agendamento',
        body: `Você tem um horário com ${barberName} em 2 horas!`,
        data: { type: 'appointment_reminder' },
      },
      trigger: { date: reminderDate },
    });
    
    // Agendar para 10 minutos antes
    const reminder10min = new Date(appointmentDate);
    reminder10min.setHours(hours, minutes - 10, 0);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Seu horário está chegando!',
        body: `Seu agendamento com ${barberName} começa em 10 minutos.`,
        data: { type: 'appointment_soon' },
      },
      trigger: { date: reminder10min },
    });
  },
  
  // Agendar lembrete de avaliação
  async scheduleRatingReminder(appointmentDate, barberName) {
    const reminderDate = new Date(appointmentDate);
    
    // Agendar para 1 hora após o agendamento
    reminderDate.setHours(reminderDate.getHours() + 1);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Avalie seu atendimento',
        body: `Como foi seu corte com ${barberName}?`,
        data: { type: 'rating_reminder' },
      },
      trigger: { date: reminderDate },
    });
  },
  
  // Notificação de promoção
  async sendPromotionNotification(promotionTitle, promotionDescription, expiryDate) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nova Promoção! 🎉',
        body: `${promotionTitle}: ${promotionDescription}`,
        data: { type: 'new_promotion' },
      },
      trigger: { seconds: 5 }, // Enviar após 5 segundos (para teste)
    });
    
    // Notificação de expiração (1 dia antes)
    if (expiryDate) {
      const expiryReminder = new Date(expiryDate);
      expiryReminder.setDate(expiryReminder.getDate() - 1);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Promoção acabando! ⏰',
          body: `${promotionTitle} expira amanhã!`,
          data: { type: 'promotion_expiring' },
        },
        trigger: { date: expiryReminder },
      });
    }
  },
  
  // Cancelar todas as notificações
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
  
  // Verificar permissões
  async checkPermissions() {
    const settings = await Notifications.getPermissionsAsync();
    return settings;
  }
};