import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
const auth = getAuth();

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authCompleted, setAuthCompleted] = useState(false);

  useEffect(() => {
    const unsubscribeFromAuthStateChanged = onAuthStateChanged(auth, async (user) => {
      console.log('User state changed:', user);
      user ? setUser(user) : setUser(null);
      setAuthCompleted(true);
    });
    return unsubscribeFromAuthStateChanged;
  }, []);

  const firestore = getFirestore();

  const fetchUserData = async () => {
    try {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          console.log('Informações adicionais do usuário:', userData);
          setUserData(userData);
        } else {
          console.log('Usuário não encontrado na coleção "users"');
        }
      }
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
    }
  };

  useEffect(() => {
    if (authCompleted) {
      fetchUserData();
    }
  }, [authCompleted, user]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log(auth)
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };



  return { user, userData, authCompleted, signOut };
}
