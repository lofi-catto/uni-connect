import {
  getFirestore,
  collection,
  addDoc,
  where,
  query,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from 'services/firebaseConfig';

// Initialize Firebase app
const db = getFirestore(firebaseConfig);

/* USERS */
export async function addUser(displayName) {
  try {
    const usersRef = collection(db, 'users');
    let newDisplayName = displayName;
    let suffix = 1;

    // Check if the displayName already exists in the database
    let querySnapshot = await getDocs(
      query(usersRef, where('displayName', '==', newDisplayName))
    );

    while (!querySnapshot.empty) {
      // If the displayName already exists, append a unique suffix to it
      suffix++;
      newDisplayName = `${displayName}-${suffix}`;
      querySnapshot = await getDocs(
        query(usersRef, where('displayName', '==', newDisplayName))
      );
    }

    // Add a new document with an automatically generated ID to the users collection
    const docRef = await addDoc(usersRef, { displayName: newDisplayName });

    return docRef.id;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export function getUserRef(userId) {
  return doc(db, 'users', userId);
}

export async function getUserById(userId) {
  try {
    const usersRef = collection(db, 'users');
    const userDoc = await getDoc(doc(usersRef, userId));

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      console.error('No user found with ID:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function isUserDisplayNameExists(displayName) {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(
      query(usersRef, where('displayName', '==', displayName))
    );

    if (!querySnapshot.empty) {
      // If a user with the provided displayName exists, return the ID of the first document in the query snapshot
      return querySnapshot.docs[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error checking if display name exists:', error);
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const userRef = getUserRef(userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
}
