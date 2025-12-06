import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const AuthService = {
  // Registrar novo usuário
  async register(email, password, userData) {
    try {
      // Criar usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        points: 100, // Pontos iniciais
        role: 'client',
        photoURL: null,
        isActive: true
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Login
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Recuperar senha
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Logout
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Monitorar estado de autenticação
  onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
  },
  
  // Buscar dados do usuário
  async getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      }
      return { success: false, error: 'Usuário não encontrado' };
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Atualizar perfil
  async updateProfile(userId, data) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { success: false, error: error.message };
    }
  }
};