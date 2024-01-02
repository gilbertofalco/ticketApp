const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.assignRole = functions.https.onCall(async (data, context) => {
  // Verifique se o usuário solicitante tem permissões para atribuir funções
  if (!context.auth.token.admin) {
    return {error: "Permissão negada!"};
  }

  const {uid, role} = data;

  // Atribua a função ao usuário
  await admin.auth().setCustomUserClaims(uid, {role});

  return {success: `Função ${role} atribuída ao usuário ${uid}.`};
});
