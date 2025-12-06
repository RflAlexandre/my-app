import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Importar telas
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import PromotionsScreen from '../screens/PromotionsScreen';
import BarbersScreen from '../screens/BarbersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Agenda') {
            iconName = 'calendar-today';
          } else if (route.name === 'Promoções') {
            iconName = 'local-offer';
          } else if (route.name === 'Barbeiros') {
            iconName = 'content-cut';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }
          
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: '#E0E0E0',
        },
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: '#FFF',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Agenda" component={ScheduleScreen} />
      <Tab.Screen name="Promoções" component={PromotionsScreen} />
      <Tab.Screen name="Barbeiros" component={BarbersScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar se usuário está logado
    const checkLogin = async () => {
      // Simular verificação
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    
    checkLogin();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}