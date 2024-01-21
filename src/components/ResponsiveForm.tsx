import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { addToFireStore, editItemInFireStore, getDataFromFireStore } from "../services/firebaseService";
import {
    Typography,
    Grid,
    TextField,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Button,
    Container,
} from "@mui/material";

import DataTable from "./DataTable";

interface FormValues {
    name: string;
    selector: string;
    agreesToTerm: boolean;
}

export interface FormValuesWithId extends FormValues {
    id: string;
}

const ResponsiveForm: React.FC = () => {
    const [submittedFormData, setSubmittedFormData] = useState<FormValuesWithId[]>([]);
    const [selectorOptions, setSelectorOptions] = useState<{ value: string; text: string }[]>([]);
    const [editMode, setEditMode] = useState<FormValuesWithId | null>(null);
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!editMode) {
            await addToFireStore("data", { ...data });
        } else {
            await editItemInFireStore("data", editMode.id, { ...data });
        }
    };

    const getSubmittedFormData = async () => {
        const response = (await getDataFromFireStore("data")) as FormValuesWithId[];
        setSubmittedFormData(response);
    };

    useEffect(() => {
        (async () => {
            getSubmittedFormData();
            const selectors = (await getDataFromFireStore("selectors")) as { value: string; text: string }[];
            setSelectorOptions(selectors);
        })();
    }, []);

    const editFormHandler = async (data: FormValuesWithId) => {
        setEditMode(data);
        setValue("agreesToTerm", data.agreesToTerm);
        setValue("name", data.name);
        setValue("selector", data.selector);
    };

    return (
        <Grid container direction={"row"}>
            <Grid item xs={12} md={4}>
                <Container onSubmit={handleSubmit(onSubmit)} component="form" sx={{ mb: 4 }}>
                    <Typography variant="h5" mb={4} fontWeight={700}>
                        Please enter your name and pick the Sectors you are currently involved in.
                    </Typography>
                    <Grid container spacing={4} mb={4}>
                        <Grid item xs={12}>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField {...field} label="Name" fullWidth error={!!errors.name} />
                                )}
                                rules={{ required: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Select</InputLabel>
                                <Controller
                                    name="selector"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select {...field} error={!!errors.selector}>
                                            {selectorOptions.map((option) => (
                                                <MenuItem value={option.value} key={option.value}>
                                                    {option.text}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                    rules={{ required: true }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="agreesToTerm"
                                control={control}
                                defaultValue={false}
                                render={({ field }) => (
                                    <FormControlLabel
                                        name="agreesToTerm"
                                        control={<Checkbox {...field} />}
                                        label="Agree to terms"
                                    />
                                )}
                                rules={{ required: true }}
                            />
                        </Grid>
                    </Grid>
                    <Button variant="contained" type="submit" fullWidth>
                        Submit
                    </Button>
                </Container>
            </Grid>

            <Grid item xs={12} md={8}>
                <Container sx={{ mb: 4 }}>
                    {submittedFormData.length > 0 ? (
                        <DataTable rows={submittedFormData} editFormHandler={editFormHandler} />
                    ) : null}
                </Container>
            </Grid>
        </Grid>
    );
};

export default ResponsiveForm;
