import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

// Authentication helper listeners & functions
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

// Real-time Firestore sync operations
export const subscribeToQuotes = (
  userId: string,
  onUpdate: (quotes: Quote[]) => void,
  onError?: (err: any) => void
) => {
  const quotesRef = collection(db, "users", userId, "quotes");
  return onSnapshot(
    quotesRef,
    (snapshot) => {
      const quotes: Quote[] = [];
      snapshot.forEach((docSnap) => {
        quotes.push(docSnap.data() as Quote);
      });
      // Sort newest first
      quotes.sort((a, b) => b.id - a.id);
      onUpdate(quotes);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
};

export const saveQuoteToFirestore = async (userId: string, quote: Quote) => {
  const quoteDocRef = doc(db, "users", userId, "quotes", String(quote.id));
  await setDoc(quoteDocRef, {
    ...quote,
    userId,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteQuoteFromFirestore = async (userId: string, quoteId: number) => {
  const quoteDocRef = doc(db, "users", userId, "quotes", String(quoteId));
  await deleteDoc(quoteDocRef);
};

export const updateQuoteStatusInFirestore = async (
  userId: string,
  quoteId: number,
  status: "aprovado" | "pendente" | "cancelado"
) => {
  const quoteDocRef = doc(db, "users", userId, "quotes", String(quoteId));
  await updateDoc(quoteDocRef, { status });
};

export const saveUserProfile = async (
  userId: string,
  profInfo: ProfessionalInfo,
  warranty?: string
) => {
  const userDocRef = doc(db, "users", userId);
  await setDoc(
    userDocRef,
    {
      ...profInfo,
      warranty: warranty || "",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
};

export const getUserProfile = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as Partial<ProfessionalInfo> & { warranty?: string };
    }
    return null;
  } catch (e) {
    console.warn("Erro ao carregar perfil do Firestore:", e);
    return null;
  }
};

export const testFirestoreConnection = async () => {
  try {
    const testDoc = doc(db, "test", "connection");
    await getDoc(testDoc);
    return true;
  } catch (e) {
    console.warn("Firestore connection check:", e);
    return false;
  }
};
