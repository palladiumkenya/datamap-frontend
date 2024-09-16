import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography,
    CircularProgress, Button, Grid
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {API_URL} from "../../constants";

const headCells = [
    {
        id: 'status',
        align: 'left',
        disablePadding: true,
        label: 'Status'
    },
    {
        id: 'column',
        align: 'left',
        disablePadding: true,
        label: 'Column'
    },
    {
        id: 'data_type',
        align: 'left',
        disablePadding: true,
        label: 'data_type'
    },
    {
        id: 'is_required',
        align: 'left',
        disablePadding: true,
        label: 'is_required'
    },
    {
        id: 'description',
        align: 'left',
        disablePadding: false,
        label: 'Description'
    },
    {
        id: 'expected_values',
        align: 'left',
        disablePadding: false,
        label: 'Expected Values'
    },
];

const ValidateDataDictionaryFile = ({file, onFinish, dictionary}) => {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [validRows, setValidRows] = useState([]);
    const { dictionaryName } = useParams();

    useEffect(() => {
        // Validate the file when it changes
        validateFile(file);
    }, [file]);

    const validateFile = (data) => {
        setLoading(true);
        // Validate each row in the file
        const errors = data.map(row => checkErrors(row));
        setErrors(errors);
        const validRows = data.filter((_, index) => errors[index].length === 0);
        setValidRows(validRows);
        setLoading(false);
    };

    const checkErrors = (row) => {
        const errors = [];

        // Check if column field is not null
        if (!row?.column) {
            errors.push("Column field cannot be empty");
        }

        // Check if data type is not null
        if (!row?.data_type) {
            errors.push("Data Type field cannot be empty");
        }

        if (row.is_required) {
            // Check if is_required is 'yes' or 'no' (case insensitive)
            const isRequiredLowerCase = row?.is_required.toLowerCase();
            if (isRequiredLowerCase !== 'yes' && isRequiredLowerCase !== 'no') {
                errors.push("Is Required field must be 'Yes' or 'No'");
            }
        } else {
            errors.push("Is Required field must be 'Yes' or 'No'");
        }

        // TODO: Convert expected_values to a narrative of the regex if present (assuming there's a regex field)
        // Implement your logic here to convert expected_values to a narrative

        return errors;
    };

    const summary = () => {
        const validRows = file.filter(row => checkErrors(row).length === 0);
        const invalidRows = file.filter(row => checkErrors(row).length > 0);

        return (
            <Typography>
                Successful rows: <span style={{ color: 'green' }}>{validRows.length}</span>,
                Failed rows: <span style={{ color: 'red' }}>{invalidRows.length}</span>
            </Typography>
        );
    };

    const renderStatusCell = (row) => {
        const errors = checkErrors(row);
        if (errors.length === 0) {
            return <span style={{ color: 'green' }}>Valid</span>;
        } else {
            return <span style={{ color: 'red' }}>Invalid: {errors.join(", ")}</span>;
        }
    };

    const handlePostValidRows = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/data_dictionary/add_data_dictionary_terms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({"data": validRows, "dictionary": dictionaryName}),
            });
            console.log("Response:", response.data);
            onFinish()
        } catch (error) {
            console.error("Error posting valid rows: ", error);
        } finally {
            setLoading(false)
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Grid container spacing={4} justifyContent="space-between">
                <Grid item >
                    {summary()}
                </Grid>
                <Grid item xs>
                    <Button variant="contained" color="primary" onClick={handlePostValidRows}>
                        Upload Valid Rows
                    </Button>
                </Grid>
            </Grid>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={headCell.align}
                                    padding={headCell.disablePadding ? 'none' : 'normal'}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(file || []).map((row, index) => {

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    tabIndex={-1}
                                    key={row.name || index}
                                >
                                    <TableCell component="th" align="left" style={{ wordWrap: 'break-word' }}>{renderStatusCell(row)}</TableCell>
                                    <TableCell align="left">{row?.column}</TableCell>
                                    <TableCell align="left">{row?.data_type}</TableCell>
                                    <TableCell align="left">{row?.is_required}</TableCell>
                                    <TableCell align="left" style={{ wordWrap: 'break-word' }}>{row?.description}</TableCell>
                                    <TableCell align="left">{row?.expected_values}</TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default ValidateDataDictionaryFile
