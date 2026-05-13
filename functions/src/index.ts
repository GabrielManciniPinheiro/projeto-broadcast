import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const processarDisparos = onSchedule("every 1 minutes", async () => {
  const snapshot = await db
    .collection("messages")
    .where("status", "==", "agendado")
    .get();

  if (snapshot.empty) {
    console.log("Nenhuma mensagem agendada no momento.");
    return;
  }

  const batch = db.batch();
  const agoraMs = Date.now(); // Pega o milissegundo exato de agora no mundo todo
  let quantidadeDisparada = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();

    // CORREÇÃO DO FUSO HORÁRIO:
    // Forçamos o servidor a entender que a data do frontend é do horário de Brasília (UTC-3)
    const dataStringComFuso = `${data.scheduledFor}-03:00`;
    const horarioAgendadoMs = new Date(dataStringComFuso).getTime();

    if (agoraMs >= horarioAgendadoMs) {
      batch.update(doc.ref, { status: "enviado" });
      quantidadeDisparada++;
    }
  });

  if (quantidadeDisparada > 0) {
    await batch.commit();
    console.log(
      `Sucesso: ${quantidadeDisparada} mensagens mudaram para ENVIADO.`,
    );
  }
});
