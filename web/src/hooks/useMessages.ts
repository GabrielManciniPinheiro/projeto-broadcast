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

export interface MessageData {
  id: string;
  text: string;
  contactIds: string[];
  status: "agendado" | "enviado";
  scheduledFor: string;
  connectionId: string;
  userId: string;
}

export function useMessages(connectionId: string | undefined) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !connectionId) return;

    const q = query(
      collection(db, "messages"),
      where("userId", "==", user.uid),
      where("connectionId", "==", connectionId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageData[];

      data.sort(
        (a, b) =>
          new Date(b.scheduledFor).getTime() -
          new Date(a.scheduledFor).getTime(),
      );

      setMessages(data);
    });

    return () => unsubscribe();
  }, [user, connectionId]);

  const addMessage = async (
    text: string,
    contactIds: string[],
    scheduledFor: string,
  ) => {
    if (!user || !connectionId) return;
    await addDoc(collection(db, "messages"), {
      text,
      contactIds,
      status: "agendado",
      scheduledFor,
      connectionId,
      userId: user.uid,
    });
  };

  const removeMessage = async (id: string) => {
    await deleteDoc(doc(db, "messages", id));
  };

  const updateMessage = async (
    id: string,
    text: string,
    scheduledFor: string,
  ) => {
    await updateDoc(doc(db, "messages", id), { text, scheduledFor });
  };

  return { messages, addMessage, removeMessage, updateMessage };
}
