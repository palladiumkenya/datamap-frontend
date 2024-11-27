import MainCard from "../../../components/MainCard";
import {Alert, AlertTitle, Autocomplete, Box, Button, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";
import { useNavigate } from "react-router-dom";

import * as React from "react";
import {API_URL} from "../../../constants";
import "../../../ToggleButton..css";



const AddSiteConfigs = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        site_name: '',
        site_code: '',
        primary_system: '',
        is_active:false

    });

    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [formErrors, setFormErrors] = useState({
        site_name: false,
        site_code: false,
        primary_system: false
    });
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        setIsOn(!isOn);
        // setFormErrors({...formErrors, "is_active":!isOn});
        setFormData((prevData) => ({
            ...prevData,
            ["is_active"]: !isOn,
        }));
    };

    const handleValidation = () => {
        let valid = true;
        const newErrors = { ...formErrors };

        // Check if any required fields are empty
        if (!formData.site_name.trim()) {
            newErrors.site_name = true;
            valid = false;
        }
        if (!formData.site_code.trim()) {
            newErrors.site_code = true;
            valid = false;
        }
        if (!formData.primary_system.trim()) {
            newErrors.primary_system = true;
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };



    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async (event) => {
        if (handleValidation()) {
            event.preventDefault();
            // Construct the API request with the driver and form data
            const apiRequest = {
                ...formData,
            };
            // Call your API to test the connection
            try {
                const response = await fetch(`${API_URL}/site_config/add_site_config`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiRequest),
                });
                const responseData = await response.json();
                console.log("response ==>",response)
                console.log("response.ok ==>",response.ok)

                if (!response.ok) {
                    setAlertType('error')
                    setAlertMessage(`Save Site config failed! ${responseData.detail}`)
                } else if(response.ok) {
                    console.log("set alert ==>",response.ok)

                    setAlertType('success')
                    setAlertMessage(responseData.status)
                    navigate('/configs/site');

                }
            } catch (error) {
                setAlertType('error'+ JSON.stringify(error))
                console.error('Error saving site config:', JSON.stringify(error));
                setAlertMessage(error.detail)
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" mb={2.5}>Site Configuration</Typography>
            <form autoComplete="off" onSubmit={handleSave}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/*<Typography variant="subtitle1">Host & Port</Typography>*/}
                        <TextField
                            type="text"
                            name="site_name"
                            label="Site Name"
                            variant="outlined"
                            value={`${formData.site_name}`}
                            onChange={handleChange}
                            required
                            error={formErrors.site_name}
                            helperText={formErrors.site_name ? "Site Name is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the Site Name</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/*<Typography variant="subtitle1">Username</Typography>*/}
                        <TextField
                            type="text"
                            name="site_code"
                            label="Site Code"
                            variant="outlined"
                            value={formData.site_code}
                            onChange={handleChange}
                            required
                            error={formErrors.site_code}
                            helperText={formErrors.site_code ? "Site code is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the Site Code</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/*<Typography variant="subtitle1">Password</Typography>*/}
                        <TextField
                            type="text"
                            name="primary_system"
                            label="Primary System"
                            variant="outlined"
                            value={formData.primary_system}
                            onChange={handleChange}
                            required
                            error={formErrors.primary_system}
                            helperText={formErrors.primary_system ? "Primary System Name is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the rimary System Name</Typography>
                    </Box>
                    <Box>
                        <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={handleToggle}>
                            <div className={`slider ${isOn ? 'on' : 'off'}`} />
                        </div>
                        <Typography variant="body2" color="textSecondary">Set this site as default: {isOn ? 'YES' : 'NO'}</Typography>

                    </Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                    <Box sx={{flex: '1 1 auto'}}/>
                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
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
    )
}

export default AddSiteConfigs
