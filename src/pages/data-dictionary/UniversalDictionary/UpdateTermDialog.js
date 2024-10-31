import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    CircularProgress, Box, Autocomplete,
} from "@mui/material";

const UpdateTermDialog = ({ open, handleClose, handleUpdate, termData }) => {
    const [formValues, setFormValues] = useState({
        term: "",
        data_type: "",
        is_required: "",
        term_description: "",
        expected_values: "",
    });

    useEffect(() => {
        if (termData) {
            setFormValues({
                term: termData.term,
                data_type: termData.data_type,
                is_required: termData.is_required ? 'yes': 'no',
                term_description: termData.term_description,
                expected_values: termData.expected_values,
            });
        }
    }, [termData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleAutocompleteChange = (e, value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            is_required: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdate({
            ...formValues,
            is_required: formValues.is_required === "Yes",
        });
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Update Dictionary Term</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="dense"
                        label="Term"
                        name="term"
                        value={formValues.term}
                        onChange={handleChange}
                        fullWidth
                        disabled
                    />
                    <TextField
                        margin="dense"
                        label="Data Type"
                        name="data_type"
                        value={formValues.data_type}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Autocomplete
                        options={["Yes", "No"]}
                        getOptionLabel={(option) => option}
                        value={formValues.is_required}
                        onChange={handleAutocompleteChange}

                        renderInput={(params) => (
                            <TextField
                                {...params}
                                margin="dense"
                                label="Is Required"
                                fullWidth
                            />
                        )}
                    />

                    <TextField
                        margin="dense"
                        label="Description"
                        name="term_description"
                        value={formValues.term_description}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Expected Values"
                        name="expected_values"
                        value={formValues.expected_values}
                        onChange={handleChange}
                        fullWidth
                    />
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateTermDialog;
