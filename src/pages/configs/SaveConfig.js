import React, { useState } from 'react';
import { Box, TextField, Typography, Button, CircularProgress } from "@mui/material";

const SaveConfig = ({ conn_string }) => {
    const [formData, setFormData] = useState({
        connectionName: '',
        systemName: '',
        systemVersion: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const connectionData = {
            conn_string: conn_string,
            name: formData.connectionName,
            system: formData.systemName,
            version: formData.systemVersion
        };

        try {
            const response = await fetch('http://localhost:8000/api/db_access/add_connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(connectionData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setSubmitSuccess(true);
        } catch (error) {
            setSubmitError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5">Final Step: Add Connection Name</Typography>
            <form onSubmit={handleSubmit} autoComplete="off">
                <TextField
                    label="Connection Name"
                    variant="outlined"
                    name={'connectionName'}
                    value={formData.connectionName}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="System Name"
                    variant="outlined"
                    name={'systemName'}
                    value={formData.systemName}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="System Version"
                    variant="outlined"
                    name={'systemVersion'}
                    value={formData.systemVersion}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
                {submitSuccess && <Typography variant="body1" color="success">Connection added successfully!</Typography>}
                {submitError && <Typography variant="body1" color="error">Error: {submitError}</Typography>}
            </form>
        </Box>
    );
};

export default SaveConfig;
