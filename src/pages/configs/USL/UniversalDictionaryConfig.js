import React, {useState} from "react";
import {Autocomplete, Box, Button, Stack, TextField, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {API_URL} from "../../../constants";
import {useAddUniversalDictionaryConfig, useUpdateUniversalDictionaryConfig} from "../../../store/configs/mutations";
import {useGetUniversalDictionaryConfig} from "../../../store/configs/queries";


const UniversalDictionaryConfig = () => {
    const [formData, setFormData] = useState({
        universal_dictionary_url: '',
        universal_dictionary_jwt: '',
        universal_dictionary_update_frequency: ''
    });
    const [formErrors, setFormErrors] = useState({
        universal_dictionary_url: false,
        universal_dictionary_jwt: false,
        universal_dictionary_update_frequency: false
    });
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [testLoader, setTestLoader] = useState(false);
    const addUniversalDictConf = useAddUniversalDictionaryConfig()
    const updateUniversalDictConf = useUpdateUniversalDictionaryConfig()
    const getUniversalDictConf = useGetUniversalDictionaryConfig()

    const handleClick = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            addUniversalDictConf.mutate(formData)
        }
        if (addUniversalDictConf.isSuccess){
            setFormData({
                universal_dictionary_url: '',
                universal_dictionary_jwt: '',
                universal_dictionary_update_frequency: ''
            })
        }

    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleConnectionTest = async (event) => {
        if (handleValidation()) {
            setTestLoader(true)
            event.preventDefault();
            // Construct the API request with the driver and form data
            const apiRequest = {
                ...formData,
            };

            // Call your API to test the connection
            try {
                const response = await fetch(`${API_URL}/db_access/test_db_connection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiRequest),
                });
                const responseData = await response.json();
                if (!response.ok) {
                    setAlertType('error')
                    setAlertMessage(`Database connection failed! ${responseData.detail}`)
                    setTestLoader(false)
                } else {
                    setAlertType('success')
                    setAlertMessage(responseData.status)
                    setTestLoader(false)
                }
            } catch (error) {
                setAlertType('error')
                console.error('Error testing connection:', JSON.stringify(error));
                setAlertMessage(error.detail)
                setTestLoader(false)
            }
        }
    };

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue) {
            setFormData((prevData) => ({
                ...prevData,
                universal_dictionary_update_frequency: newValue
            }))
        } else {
            setFormData({
                ...formData,
                universal_dictionary_update_frequency: ''
            });
        }
    };

    const handleValidation = () => {
        let valid = true;
        const newErrors = { ...formErrors };
        console.log(formData)

        // Check if any required fields are empty
        if (!formData.universal_dictionary_update_frequency.trim()) {
            newErrors.universal_dictionary_update_frequency = true;
            valid = false;
        }
        console.log(formData.universal_dictionary_update_frequency.trim())
        if (!formData.universal_dictionary_jwt.trim()) {
            newErrors.universal_dictionary_jwt = true;
            valid = false;
        }
        console.log(formData.universal_dictionary_jwt.trim())
        if (!formData.universal_dictionary_url.trim()) {
            newErrors.universal_dictionary_url = true;
            valid = false;
        }
        console.log(formData.universal_dictionary_url.trim())

        setFormErrors(newErrors);
        return valid;
    };

    const frequency = [
        'Never',
        'Daily',
        'Weekly',
        'Bi-weekly',
        'Monthly'
    ];

    return(
        <>
            <Typography variant="h5" mb={2.5}>Connection Details</Typography>
            <form autoComplete="of" onSubmit={handleClick}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            type="text"
                            name="universal_dictionary_url"
                            label="Universal Data Dictionary URL"
                            variant="outlined"
                            value={`${formData.universal_dictionary_url}`}
                            onChange={handleChange}
                            required
                            error={formErrors.universal_dictionary_url}
                            helperText={formErrors.universal_dictionary_url ? "Universal Data Dictionary URL is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the Universal Data Dictionary URL</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            type="password"
                            name="universal_dictionary_jwt"
                            label="Universal Data Dictionary JWT Token"
                            variant="outlined"
                            value={formData.universal_dictionary_jwt}
                            onChange={handleChange}
                            required
                            error={formErrors.universal_dictionary_jwt}
                            helperText={formErrors.universal_dictionary_jwt ? "Universal Data Dictionary JWT Token is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the Universal Data Dictionary JWT Token</Typography>
                    </Box>


                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Autocomplete
                            id="db-select"
                            fullWidth
                            options={frequency}
                            autoHighlight
                            size="small"
                            getOptionLabel={(option) => option}
                            renderOption={({ key, ...props }, option) => (
                                <Box key={key} component="li" {...props}>
                                    {option}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Choose a database service"
                                    label="Auto Update Frequency *"
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password'
                                    }}
                                    error={formErrors.universal_dictionary_update_frequency}
                                    helperText={formErrors.universal_dictionary_update_frequency ? "The Auto Update Frequency is required" : ""}
                                />
                            )}
                            onChange={handleAutocompleteChange}
                        />
                    </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                    <Box sx={{flex: '1 1 auto'}}/>
                    <Stack direction="row" spacing={2}>
                        <LoadingButton
                            loading={testLoader}
                            loadingPosition="start"
                            variant="contained"
                            color="success"
                            onClick={handleConnectionTest}
                        >
                            Test Connection
                        </LoadingButton>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClick}
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
                </Box>
            </form>
        </>
    )
}

export default UniversalDictionaryConfig
