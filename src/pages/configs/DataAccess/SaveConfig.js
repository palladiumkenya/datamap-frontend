import React, {useEffect, useState} from 'react';
import {Box, TextField, Typography, Button, CircularProgress, Alert, AlertTitle, Autocomplete, LinearProgress} from "@mui/material";
import {API_URL} from "../../../constants";
import {useGetSystems} from "../../../store/access_configurations/queries";
import {useCreateAccessConfig} from "../../../store/access_configurations/mutations";
import axios from "axios";

const SaveConfig = ({ connString, onFinish }) => {
    const [formData, setFormData] = useState({
        connectionName: '',
        system_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [loader, setLoader] = useState(false);
    const {data: systems, isLoading} = useGetSystems()
    const createConfig = useCreateAccessConfig()


    if (isLoading){
        return (
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        )
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue) {
            setFormData((prevData) => ({...prevData, system_id: newValue.id}))
        } else {
            setFormData({
                ...formData,
                system_id: ''
            });
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const connectionData = {
            conn_string: connString?.db === 'csv' ? 'csv' : connString?.conn_str,
            conn_type: connString?.conn_type,
            name: formData.connectionName,
            system_id: formData.system_id
        };

        try {
            await createConfig.mutateAsync(connectionData);
            if (connString?.db === 'csv') {
                try {
                    const response = await axios.post(`${API_URL}/db_access/upload_csv`, {
                        data: connString?.csvData,
                        name: formData.connectionName
                    })
                } catch (error) {
                    console.error(error?.response?.data?.detail || error.message)
                }
            }

            onFinish();
        } catch (error) {
            setAlertType('error')
            setAlertMessage(error.message || error.detail || 'An unexpected error occurred')
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
                <Autocomplete
                    fullWidth
                    options={systems}
                    autoHighlight
                    size="small"
                    getOptionLabel={(option) => option.name}
                    renderOption={({ key, ...props }, option) => (
                        <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option.name}
                        </Box>
                    )}
                    required
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Choose a system"
                            label="System *"
                            variant="outlined"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                            }}
                        />
                    )}
                    onChange={handleAutocompleteChange}
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
