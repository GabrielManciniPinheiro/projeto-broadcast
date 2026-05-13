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

export interface Contact {
  id: string;
  name: string;
  phone: string;
  connectionId: string;
  userId: string;
}

export function useContacts(connectionId: string | undefined) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !connectionId) return;

    // Buscamos contatos que pertencem ao usuário logado E à conexão específica (Estrutura Plana / Sem subcoleção)
    const q = query(
      collection(db, "contacts"),
      where("userId", "==", user.uid),
      where("connectionId", "==", connectionId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];
      setContacts(data);
    });

    return () => unsubscribe();
  }, [user, connectionId]);

  const addContact = async (name: string, phone: string) => {
    if (!user || !connectionId) return;
    await addDoc(collection(db, "contacts"), {
      name,
      phone,
      connectionId,
      userId: user.uid,
    });
  };

  const removeContact = async (id: string) => {
    await deleteDoc(doc(db, "contacts", id));
  };

  const updateContact = async (id: string, name: string, phone: string) => {
    await updateDoc(doc(db, "contacts", id), { name, phone });
  };

  return { contacts, addContact, removeContact, updateContact };
}
