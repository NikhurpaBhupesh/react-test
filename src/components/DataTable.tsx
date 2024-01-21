import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import { Button, Typography } from "@mui/material";
import { deleteItemFromFireStore } from "../services/firebaseService";
import { FormValuesWithId } from "./ResponsiveForm";

const DataTable: React.FC<{
    rows: FormValuesWithId[];
    editFormHandler: (data: FormValuesWithId) => void;
}> = ({ rows, editFormHandler }) => {
    return (
        <>
            <Typography variant="h5" mb={4} fontWeight={700}>
                Submitted Details
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Selector</TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>Agrees to Term</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.selector}</TableCell>
                                <TableCell>{row.agreesToTerm ? "True" : "False"}</TableCell>
                                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                                    <Button
                                        variant="outlined"
                                        sx={{ marginRight: 2 }}
                                        onClick={() => editFormHandler(row)}
                                    >
                                        Edit
                                    </Button>
                                    <Button variant="outlined" onClick={() => deleteItemFromFireStore("data", row.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default DataTable;
