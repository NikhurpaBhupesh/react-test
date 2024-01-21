import { db } from "../../firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    CollectionReference,
    DocumentData,
    QuerySnapshot,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";

export const checkIfCollectionIsEmpty = async () => {
    try {
        const collectionRef = await getDocs(collection(db, "selectors"));
        return collectionRef.size === 0 ? true : false;
    } catch (error) {
        console.error("Error checking collection:", error);
        return false;
    }
};

export const addToFireStore = async (collectionName: string, data: { [x: string]: unknown }): Promise<void> => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document written with ID:", docRef.id);
    } catch (error) {
        console.error("Error adding document:", error);
    }
};

export const deleteItemFromFireStore = async (collectionName: string, documentId: string) => {
    try {
        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
    } catch (error) {
        console.error("Error deleting document:", error);
    }
};

export const getDataFromFireStore = async (collectionName: string): Promise<DocumentData[]> => {
    try {
        const collectionRef: CollectionReference<DocumentData> = collection(db, collectionName);
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(collectionRef);

        const data: DocumentData[] = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        return data;
    } catch (error) {
        console.error("Error getting collection data:", error);
        throw error;
    }
};

export const editItemInFireStore = async (collectionName: string, documentId: string, newData: DocumentData) => {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, newData);
        console.log("Document successfully updated!");
    } catch (error) {
        console.error("Error updating document:", error);
    }
};
