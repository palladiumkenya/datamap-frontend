import React from "react";
import {Autocomplete, Box, TextField, Typography} from "@mui/material";



const RestApiDataForm = ({setAPIData, apiData, apiFormError}) => {

    const methods = [
        'GET',
        'POST'
    ];

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue) {
            setAPIData((prevData) => ({...prevData, method: newValue}))
        } else {
            setAPIData({
                ...apiData,
                method: ''
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAPIData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };




    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    type="text"
                    name="endpoint"
                    label="Endpoint"
                    variant="outlined"
                    value={`${apiData.endpoint}`}
                    onChange={handleChange}
                    required
                    error={apiFormError.endpoint}
                    helperText={apiFormError.endpoint ? "Endpoint is required" : ""}
                />
                <Typography variant="body2" color="textSecondary">Enter the endpoint url</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Autocomplete
                    id="method"
                    fullWidth
                    options={methods}
                    autoHighlight
                    size="small"
                    getOptionLabel={(option) => option}
                    renderOption={({ key, ...props }, option) => (
                        <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            {option}
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Choose a database service"
                            label="HTTP Method"
                            variant="outlined"
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'off'
                            }}
                            required
                            error={apiFormError.method}
                            helperText={apiFormError.method ? "Http method is required" : ""}
                        />
                    )}
                    onChange={handleAutocompleteChange}
                />

            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    type="text"
                    name="dataPath"
                    label="JSON key containing data"
                    variant="outlined"
                    autoComplete="off"
                    value={apiData.dataPath}
                    onChange={handleChange}
                />
                <Typography variant="body2" color="textSecondary">Enter the key containing the data array, or leave it blank if the array is the only thing returned</Typography>
            </Box>
        </>
    )
}

export default RestApiDataForm
