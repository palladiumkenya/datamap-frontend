import {Box, Button, Grid, Stack, TextField, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import * as React from "react";
import {useState} from "react";
import {useAddDataDictionary} from "../../store/data-dictionary/mutations";


const DataDictionaryNew = () => {
    const [formData, setFormData] = useState({
        name: ''
    });
    const [formErrors, setFormErrors] = useState({
        name: false
    });
    const addNewDictionary = useAddDataDictionary()

    const handleValidation = () => {
        let valid = true;
        const newErrors = { ...formErrors };

        // Check if any required fields are empty
        if (!formData.name.trim()) {
            newErrors.host_port = true;
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleClick = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            addNewDictionary.mutate(formData)
            console.log(addNewDictionary.isSuccess)
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Box sx={{ width: '100%' }}>
            <MainCard>
                <form autoComplete={'off'} onSubmit={handleClick}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            type="text"
                            name="name"
                            label="USL Data Dictionary Name"
                            variant="outlined"
                            value={`${formData.name}`}
                            onChange={handleChange}
                            required
                            error={formErrors.name}
                            helperText={formErrors.name ? "Provide name" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter Name od USL Data Dictionary</Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            type={'submit'}
                        >
                            Save
                        </Button>
                        <Button
                            type={'reset'}
                            variant="contained"
                            color="error"
                        >
                            Cancel
                        </Button>
                    </Stack>
                </form>
            </MainCard>
        </Box>
    )
}

export default DataDictionaryNew