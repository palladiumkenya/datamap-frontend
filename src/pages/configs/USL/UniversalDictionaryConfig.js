import React, {useEffect, useState} from "react";
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Button,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {API_URL} from "../../../constants";
import {
    useAddUniversalDictionaryConfig,
    useTestUniversalDictionaryConfig,
    useUpdateUniversalDictionaryConfig
} from "../../../store/configs/mutations";
import {useGetUniversalDictionaryConfig} from "../../../store/configs/queries";
import Loader from "../../../components/Loader";
import {EditOutlined} from "@ant-design/icons";


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
    const [disabled, setDisabled] = useState(false)
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [testLoader, setTestLoader] = useState(false);
    const addUniversalDictConf = useAddUniversalDictionaryConfig()
    const testUniversalDictConf = useTestUniversalDictionaryConfig()
    const {isLoading, data: universalDictConf} = useGetUniversalDictionaryConfig()

    useEffect(() => {
        if (universalDictConf && !isLoading) {
            setDisabled(true);
            setFormData(universalDictConf);
        }
    }, [universalDictConf, isLoading]);

    const handleClick = (event) => {
        event.preventDefault();
        if (handleValidation()) {
            addUniversalDictConf.mutate(formData)
        }

        if (addUniversalDictConf.isSuccess){
            setDisabled(true)
        }

    }

    const handleConnectionTest = async (event) => {
        if (handleValidation()) {
            setTestLoader(true)
            event.preventDefault();

            const apiRequest = {
                universal_dictionary_url: formData.universal_dictionary_url,
                universal_dictionary_jwt: formData.universal_dictionary_jwt
            };

            // Call your API to test the connection
            try {
                await testUniversalDictConf.mutate(apiRequest, {
                    onSuccess: (data) => {
                        const {responseData, response} = data;

                        if (!response.ok) {
                            setAlertType('error')
                            setAlertMessage(`Connection failed! ${responseData.detail}`)
                        } else {
                            setAlertType('success')
                            setAlertMessage(responseData.detail)
                        }
                    },
                    // onError: (error) => {
                    //     setAlertType('error')
                    //     setAlertMessage(error.detail || "An error occurred")
                    // },
                    onSettled: () => {
                        setTestLoader(false)
                    }
                })

            } catch (error) {
                setAlertType('error')
                setAlertMessage(error.detail)
                setTestLoader(false)
            }
        }
    };

    const handleEditClick = async () => {
        setDisabled(false)
    }
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setFormErrors((prevData) => ({
            ...prevData,
            [name]: false
        }))
    };
    const handleAutocompleteChange = (event, newValue) => {
        if (newValue) {
            setFormData((prevData) => ({
                ...prevData,
                universal_dictionary_update_frequency: newValue
            }))
            setFormErrors((prevData) => ({
                ...prevData,
                universal_dictionary_update_frequency: false
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

        // Check if any required fields are empty
        if (!formData.universal_dictionary_update_frequency.trim()) {
            newErrors.universal_dictionary_update_frequency = true;
            valid = false;
        }
        if (!formData.universal_dictionary_jwt.trim()) {
            newErrors.universal_dictionary_jwt = true;
            valid = false;
        }
        if (!formData.universal_dictionary_url.trim()) {
            newErrors.universal_dictionary_url = true;
            valid = false;
        }

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

    if (isLoading) {
      return (
          <Loader />
      )
    }


    return(
        <>
            <Box sx={{width:'100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2}}>
                {/*<Box sx={{flex: 'auto'}}/>*/}
                <Stack direction="row" spacing={2}>
                    <Typography variant="h5" mb={2.5}>Universal Dictionary Details</Typography>
                    <Box sx={{flex: 'auto'}}/>
                    <Tooltip title={`Edit`}>
                        <IconButton disabled={!disabled} aria-label="Edit" onClick={handleEditClick}>
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
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
                            disabled={disabled}
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
                            disabled={disabled}
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
                            value={formData.universal_dictionary_update_frequency}
                            options={frequency}
                            disabled={disabled}
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
                            disabled={disabled}
                        >
                            Save
                        </Button>
                        <Button
                            type={'reset'}
                            variant="contained"
                            color="error"
                            disabled={disabled}
                        >
                            Cancel
                        </Button>
                    </Stack>
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
        </>
    )
}

export default UniversalDictionaryConfig
