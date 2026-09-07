import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import type { Quote, ProfessionalInfo } from "../types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyChZK3FcoQT-Rlz3x-U_pOiH2A-Wq8zHaE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gerador-pro.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gerador-pro",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gerador-pro.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "115532758928",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:115532758928:web:ef826e66fe38a6c4e83d15",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-6PKZ8H5NXF",
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Inicia autenticação anônima automaticamente caso o usuário não tenha feito login
export const initAnonymousAuth = async () => {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (e) {
    // Se o login anônimo não estiver ativo no console do Firebase, continua normalmente
    console.warn("Autenticação anônima indisponível ou desativada no Firebase:", e);
  }
};

// Listeners e funções de Autenticação
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signInWithEmail = async (email: string, pass: string) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

export const signUpWithEmail = async (email: string, pass: string) => {
  return createUserWithEmailAndPassword(auth, email, pass);
};

export const logoutUser = async () => {
  return signOut(auth);
};

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// Salva o orçamento no Firestore em múltiplos pontos seguros
export const saveQuoteToFirestore = async (
  quote: Quote,
  userId?: string | null,
  deviceId?: string
) => {
  const timestamp = new Date().toISOString();
  const payload = {
    ...quote,
    userId: userId || "",
    deviceId: deviceId || "",
    updatedAt: timestamp,
  };

  // 1. Salva na coleção global de orçamentos (garante persistência independente de login)
  try {
    const globalDoc = doc(db, "quotes", String(quote.id));
    await setDoc(globalDoc, payload, { merge: true });
  } catch (err) {
    console.warn("Aviso ao salvar na coleção global de orçamentos:", err);
  }

  // 2. Se houver usuário ou dispositivo identificado, salva também na coleção do usuário
  const ownerId = userId || deviceId;
  if (ownerId) {
    try {
      const userQuoteDoc = doc(db, "users", ownerId, "quotes", String(quote.id));
      await setDoc(userQuoteDoc, payload, { merge: true });
    } catch (err) {
      console.warn("Aviso ao salvar orçamento no perfil:", err);
    }
  }
};

// Exclui o orçamento do Firestore
export const deleteQuoteFromFirestore = async (
  quoteId: number,
  userId?: string | null,
  deviceId?: string
) => {
  try {
    const globalDoc = doc(db, "quotes", String(quoteId));
    await deleteDoc(globalDoc);
  } catch (err) {
    console.warn("Aviso ao excluir orçamento global:", err);
  }

  const ownerId = userId || deviceId;
  if (ownerId) {
    try {
      const userQuoteDoc = doc(db, "users", ownerId, "quotes", String(quoteId));
      await deleteDoc(userQuoteDoc);
    } catch (err) {
      console.warn("Aviso ao excluir orçamento do perfil:", err);
    }
  }
};

// Atualiza o status do orçamento no Firestore
export const updateQuoteStatusInFirestore = async (
  quoteId: number,
  status: "aprovado" | "pendente" | "cancelado",
  userId?: string | null,
  deviceId?: string
) => {
  const updatePayload = {
    status,
    updatedAt: new Date().toISOString(),
  };

  try {
    const globalDoc = doc(db, "quotes", String(quoteId));
    await updateDoc(globalDoc, updatePayload);
  } catch (err) {
    console.warn("Aviso ao atualizar status global:", err);
  }

  const ownerId = userId || deviceId;
  if (ownerId) {
    try {
      const userQuoteDoc = doc(db, "users", ownerId, "quotes", String(quoteId));
      await updateDoc(userQuoteDoc, updatePayload);
    } catch (err) {
      console.warn("Aviso ao atualizar status no perfil:", err);
    }
  }
};

// Sincronização em tempo real dos orçamentos
export const subscribeToQuotes = (
  identifier: string,
  onUpdate: (quotes: Quote[]) => void,
  onError?: (err: any) => void
) => {
  const quotesRef = collection(db, "users", identifier, "quotes");
  return onSnapshot(
    quotesRef,
    (snapshot) => {
      const quotes: Quote[] = [];
      snapshot.forEach((docSnap) => {
        quotes.push(docSnap.data() as Quote);
      });
      quotes.sort((a, b) => b.id - a.id);
      onUpdate(quotes);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
};

// Salva todos os dados do perfil profissional e preferências no Firestore
export const saveUserProfileAndSettings = async (
  identifier: string,
  data: {
    profInfo?: ProfessionalInfo;
    warranty?: string;
    favorites?: string[];
    isPremium?: boolean;
    deviceId?: string;
  }
) => {
  if (!identifier) return;
  try {
    const userDocRef = doc(db, "users", identifier);
    await setDoc(
      userDocRef,
      {
        ...data.profInfo,
        warranty: data.warranty || "",
        favorites: data.favorites || [],
        isPremium: !!data.isPremium,
        deviceId: data.deviceId || "",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Aviso ao salvar perfil no Firestore:", err);
  }
};

// Carrega os dados do perfil e configurações do Firestore
export const getUserProfileAndSettings = async (identifier: string) => {
  if (!identifier) return null;
  try {
    const userDocRef = doc(db, "users", identifier);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (e) {
    console.warn("Aviso ao carregar dados do usuário do Firestore:", e);
    return null;
  }
};

export const testFirestoreConnection = async () => {
  try {
    const testDoc = doc(db, "test", "connection");
    await getDoc(testDoc);
    return true;
  } catch (e) {
    console.warn("Verificação de conexão Firestore:", e);
    return false;
  }
};
