import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useAuth";

export interface Connection {
  id: string;
  name: string;
  userId: string;
}

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // A mágica do SaaS: filtramos para buscar APENAS onde userId é igual ao uid do usuário logado!
    const q = query(
      collection(db, "connections"),
      where("userId", "==", user.uid),
    );

    // onSnapshot fica "escutando" o banco em tempo real
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Connection[];

      setConnections(data);
    });

    return () => unsubscribe();
  }, [user]);

  const addConnection = async (name: string) => {
    if (!user) return;
    await addDoc(collection(db, "connections"), {
      name,
      userId: user.uid,
    });
  };

  const removeConnection = async (id: string) => {
    await deleteDoc(doc(db, "connections", id));
  };

  const updateConnection = async (id: string, newName: string) => {
    await updateDoc(doc(db, "connections", id), { name: newName });
  };

  return { connections, addConnection, removeConnection, updateConnection };
}
