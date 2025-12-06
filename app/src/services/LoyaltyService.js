import { db } from './firebaseConfig';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  increment 
} from 'firebase/firestore';

export const LoyaltyService = {
  // Adicionar pontos
  async addPoints(userId, serviceId, points) {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Adicionar pontos
      await updateDoc(userRef, {
        points: increment(points),
        updatedAt: new Date().toISOString()
      });
      
      // Registrar na história de pontos
      const pointsHistoryRef = doc(collection(db, 'pointsHistory'));
      await updateDoc(pointsHistoryRef, {
        userId,
        serviceId,
        points,
        type: 'earned',
        date: new Date().toISOString(),
        status: 'completed'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Resgatar pontos
  async redeemPoints(userId, serviceId, pointsNeeded) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return { success: false, error: 'Usuário não encontrado' };
      }
      
      const userData = userDoc.data();
      
      if (userData.points < pointsNeeded) {
        return { success: false, error: 'Pontos insuficientes' };
      }
      
      // Subtrair pontos
      await updateDoc(userRef, {
        points: increment(-pointsNeeded),
        updatedAt: new Date().toISOString()
      });
      
      // Registrar resgate
      const redemptionRef = doc(collection(db, 'redemptions'));
      await updateDoc(redemptionRef, {
        userId,
        serviceId,
        points: pointsNeeded,
        date: new Date().toISOString(),
        status: 'redeemed'
      });
      
      return { success: true, remainingPoints: userData.points - pointsNeeded };
    } catch (error) {
      console.error('Erro ao resgatar pontos:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Buscar histórico de pontos
  async getPointsHistory(userId) {
    try {
      const q = query(
        collection(db, 'pointsHistory'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const history = [];
      
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, history };
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Buscar regras de fidelidade
  async getLoyaltyRules() {
    try {
      const rulesRef = doc(db, 'settings', 'loyaltyRules');
      const rulesDoc = await getDoc(rulesRef);
      
      if (rulesDoc.exists()) {
        return { success: true, rules: rulesDoc.data() };
      }
      
      // Regras padrão
      const defaultRules = {
        pointsPerService: {
          'corte': 10,
          'barba': 8,
          'combo': 20,
          'sobrancelha': 5
        },
        redemptionRules: {
          freeHaircut: 100, // 100 pontos = 1 corte grátis
          freeBeard: 80,    // 80 pontos = 1 barba grátis
          discount10: 50,   // 50 pontos = 10% de desconto
        },
        expirationDays: 365 // Pontos expiram em 1 ano
      };
      
      return { success: true, rules: defaultRules };
    } catch (error) {
      console.error('Erro ao buscar regras:', error);
      return { success: false, error: error.message };
    }
  }
};