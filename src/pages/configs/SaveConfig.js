import React, { useState } from 'react';
import {Box, TextField, Typography, Button, CircularProgress, Alert, AlertTitle} from "@mui/material";
import {API_URL} from "../../constants";

const SaveConfig = ({ connString, onFinish }) => {
    const [formData, setFormData] = useState({
        connectionName: '',
        systemName: '',
        systemVersion: ''
    });
    const [loading, setLoading] = useState(false);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [loader, setLoader] = useState(false);

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
            conn_string: connString,
            name: formData.connectionName,
            system: formData.systemName,
            version: formData.systemVersion
        };

        try {
            const response = await fetch(`${API_URL}/db_access/add_connection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(connectionData),
            });
            const responseData = await response.json();
            if (!response.ok) {
                setAlertType('error')
                setAlertMessage(`Database connection failed! ${responseData.detail}`)
                setLoader(false)
            } else {
                setAlertType('success')
                setAlertMessage(responseData?.message)
                setLoader(false)
            }

            onFinish();
        } catch (error) {
            setAlertType('error')
            console.error('Error testing connection:', JSON.stringify(error));
            setAlertMessage(error.detail)
            setLoader(false)
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
                <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                    <Box sx={{flex: '1 1 auto'}}/>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        { loader ? <CircularProgress size={24} /> : 'Submit' }
                    </Button>
                </Box>
            </form>
            {/* Alert for success */}
            {alertType === 'success' && (
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    <Typography variant="body1">{alertMessage}</Typography>
                </Alert>
            )}

            {/* Alert for error */}
            {alertType === 'error' && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    <Typography variant="body1">{alertMessage}</Typography>
                </Alert>
            )}
        </Box>
    );
};

export default SaveConfig;
