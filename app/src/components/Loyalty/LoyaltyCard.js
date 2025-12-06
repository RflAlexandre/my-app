import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { LoyaltyService } from '../../services/LoyaltyService';
import { useAuth } from '../../context/AuthContext';

const rewards = [
  { id: '1', name: 'Corte Grátis', points: 100, icon: 'content-cut' },
  { id: '2', name: 'Barba Grátis', points: 80, icon: 'face' },
  { id: '3', name: '10% Desconto', points: 50, icon: 'percent' },
  { id: '4', name: 'Corte + Barba', points: 150, icon: 'spa' },
];

export default function LoyaltyCard() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserPoints();
    }
  }, [user]);

  const fetchUserPoints = async () => {
    // Buscar pontos do usuário
    // Mock data
    setPoints(120);
  };

  const handleRedeem = async (reward) => {
    if (points < reward.points) {
      Alert.alert('Pontos Insuficientes', `Você precisa de ${reward.points} pontos para resgatar este prêmio.`);
      return;
    }

    setLoading(true);
    try {
      const result = await LoyaltyService.redeemPoints(
        user.uid,
        reward.id,
        reward.points
      );
      
      if (result.success) {
        setPoints(result.remainingPoints);
        Alert.alert('Sucesso!', `${reward.name} resgatado com sucesso!`);
      } else {
        Alert.alert('Erro', result.error);
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao resgatar o prêmio.');
    } finally {
      setLoading(false);
    }
  };

  const renderReward = ({ item }) => (
    <TouchableOpacity
      style={[styles.rewardCard, { backgroundColor: theme.background }]}
      onPress={() => handleRedeem(item)}
      disabled={loading || points < item.points}
    >
      <View style={styles.rewardHeader}>
        <MaterialIcons name={item.icon} size={24} color={theme.primary} />
        <Text style={[styles.rewardName, { color: theme.text }]}>{item.name}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <MaterialIcons name="loyalty" size={16} color={points >= item.points ? theme.primary : '#999'} />
        <Text style={[
          styles.pointsText,
          { color: points >= item.points ? theme.primary : '#999' }
        ]}>
          {item.points} pontos
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.redeemButton,
          { 
            backgroundColor: points >= item.points ? theme.primary : '#CCC',
            opacity: points >= item.points ? 1 : 0.5
          }
        ]}
        disabled={points < item.points || loading}
      >
        <Text style={styles.redeemText}>
          {points >= item.points ? 'Resgatar' : 'Pontos insuficientes'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho com pontos */}
      <View style={[styles.pointsHeader, { backgroundColor: theme.primary }]}>
        <MaterialIcons name="loyalty" size={32} color="#FFF" />
        <View style={styles.pointsInfo}>
          <Text style={styles.totalPoints}>{points}</Text>
          <Text style={styles.pointsLabel}>pontos acumulados</Text>
        </View>
      </View>

      {/* Regras */}
      <View style={styles.rulesSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Como funciona</Text>
        <View style={styles.ruleItem}>
          <MaterialIcons name="check-circle" size={20} color={theme.primary} />
          <Text style={[styles.ruleText, { color: theme.text }]}>
            1 corte = 10 pontos
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <MaterialIcons name="check-circle" size={20} color={theme.primary} />
          <Text style={[styles.ruleText, { color: theme.text }]}>
            1 barba = 8 pontos
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <MaterialIcons name="check-circle" size={20} color={theme.primary} />
          <Text style={[styles.ruleText, { color: theme.text }]}>
            10 cortes = 1 corte grátis
          </Text>
        </View>
      </View>

      {/* Prêmios disponíveis */}
      <View style={styles.rewardsSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Prêmios Disponíveis</Text>
        <FlatList
          data={rewards}
          renderItem={renderReward}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.rewardsGrid}
          scrollEnabled={false}
        />
      </View>

      {/* Histórico */}
      <TouchableOpacity style={styles.historyButton}>
        <Text style={[styles.historyText, { color: theme.primary }]}>
          Ver histórico de pontos
        </Text>
        <MaterialIcons name="arrow-forward" size={20} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  pointsInfo: {
    marginLeft: 15,
  },
  totalPoints: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  pointsLabel: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.9,
  },
  rulesSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleText: {
    marginLeft: 10,
    fontSize: 14,
  },
  rewardsSection: {
    marginBottom: 20,
  },
  rewardsGrid: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rewardCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rewardName: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pointsText: {
    marginLeft: 5,
    fontSize: 12,
  },
  redeemButton: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  redeemText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  historyText: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: '600',
  },
});