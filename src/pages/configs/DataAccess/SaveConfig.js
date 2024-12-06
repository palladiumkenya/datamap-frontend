import React, { useState } from 'react';
import {Box, TextField, Typography, Button, CircularProgress, Alert, AlertTitle, Autocomplete, LinearProgress} from "@mui/material";
import {API_URL} from "../../../constants";
import {useGetSystems} from "../../../store/access_configurations/queries";
import {useCreateAccessConfig} from "../../../store/access_configurations/mutations";

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
            conn_string: connString,
            name: formData.connectionName,
            system_id: formData.system_id
        };

        try {
            const response = await createConfig.mutateAsync(connectionData);

            if (response.isError) {
                setAlertType('error')
                setAlertMessage(`Database connection failed! ${response.error.message}`)
                setLoader(false)
            } else {
                setAlertType('success')
                setAlertMessage(response.data?.message)
                setLoader(false)
                onFinish();
            }

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
                            // error={formErrors.db_type}
                            // helperText={formErrors.db_type ? "Data source service is required" : ""}
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
