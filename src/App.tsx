import { useEffect, useRef } from "react";
import { selectorsArray } from "./constants";
import { checkIfCollectionIsEmpty, addToFireStore } from "./services/firebaseService";
import ResponsiveForm from "./components/ResponsiveForm";

function App() {
    const addData = async () => {
        const isEmpty = (await checkIfCollectionIsEmpty()) ?? false;
        if (!isEmpty) {
            console.log("Selectors are already added to the database.");
            return;
        }        

        const batch = selectorsArray.map((data) => addToFireStore("selectors", data));

        try {
            await Promise.all(batch);
            console.log("Selectors added to FireStore successfully.");
        } catch (error) {
            console.error("Error adding selectors:", error);
        }
    };

    const hasAddedData = useRef(false);

    useEffect(() => {
        if (!hasAddedData.current) {
            addData();
            hasAddedData.current = true;
        }
    }, []);

    return (
        <>
            <ResponsiveForm />
        </>
    );
}

export default App;
