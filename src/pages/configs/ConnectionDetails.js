import React, {useState} from 'react';
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Button, Stack,
    TextField,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";



const ConnectionDetails = ({ onNextStep }) => {

    const [formData, setFormData] = useState({
        host_port: '',
        username: '',
        password: '',
        database: '',
        db_type: ''
    });
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [testLoader, setTestLoader] = useState(false);
    const [formErrors, setFormErrors] = useState({
        host_port: false,
        username: false,
        password: false,
        database: false,
        db_type: false
    });

    const handleValidation = () => {
        let valid = true;
        const newErrors = { ...formErrors };

        // Check if any required fields are empty
        if (!formData.host_port.trim()) {
            newErrors.host_port = true;
            valid = false;
        }
        if (!formData.username.trim()) {
            newErrors.username = true;
            valid = false;
        }
        if (!formData.password.trim()) {
            newErrors.password = true;
            valid = false;
        }
        if (!formData.database.trim()) {
            newErrors.database = true;
            valid = false;
        }
        if (!formData.db_type.trim()) {
            newErrors.db_type = true;
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleClick = () => {
        if (handleValidation()) {
            let conn_str = `${formData.db_type}://${formData.user}:${formData.password}@${formData.host_port}/${formData.database}`
            onNextStep(conn_str);
        }
    };

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue) {
            setFormData((prevData) => ({...prevData, db_type: newValue.driver}))
        } else {
            setFormData({
                ...formData,
                db_type: ''
            });
        }
    };

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
                const response = await fetch('http://localhost:8000/api/db_access/test_db_connection', {
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


    const images = [
        {
            url: 'https://data.kenyahmis.org:8082/service-icon-sql.png',
            title: 'MySQL',
            driver: 'mysql'
        },
        {
            url: 'https://data.kenyahmis.org:8082/service-icon-mssql.png',
            title: 'MSSQL',
            driver: 'mssql'
        },
        {
            url: 'https://data.kenyahmis.org:8082/service-icon-post.png',
            title: 'Postgres',
            driver: 'pgsql'
        },
        {
            url: 'https://data.kenyahmis.org:8082/service-icon-sqlite.png',
            title: 'SQLite',
            driver: 'sqlite'
        },
        {
            url: 'data:image/png;base64,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',
            title: 'Mongo DB',
            driver: 'mongo',
            disabled: true
        },
        {
            url: '',
            title: 'FHIR',
            driver: 'fhir',
            disabled: true
        },
        {
            url: '',
            title: 'CSV',
            driver: 'flatfile',
            disabled: true
        },
        {
            url: '',
            title: 'APIs/Web',
            driver: 'api',
            disabled: true
        },
        {
            url: 'https://data.kenyahmis.org:8082/service-icon-snowflakes.png',
            title: 'Snowflake',
            driver: 'snow',
            disabled: true
        },
    ];
    return (
        <Box>
            <Typography variant="h5" mb={2.5}>Connection Details</Typography>
            <form autoComplete="of" onSubmit={handleClick}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Autocomplete
                            id="db-select"
                            fullWidth
                            options={images}
                            autoHighlight
                            size="small"
                            getOptionLabel={(option) => option.title}
                            getOptionDisabled={(option) => option?.disabled}
                            renderOption={({ key, ...props }, option) => (
                                <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    <img
                                        loading="lazy"
                                        width="20"
                                        src={option.url}
                                        srcSet={`${option.url} 2x`}
                                        alt=""
                                    />
                                    {option.title}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Choose a database service"
                                    label="Database Service"
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password'
                                    }}
                                    error={formErrors.db_type}
                                    helperText={formErrors.db_type ? "Data source service is required" : ""}
                                />
                            )}
                            onChange={handleAutocompleteChange}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/*<Typography variant="subtitle1">Host & Port</Typography>*/}
                        <TextField
                            type="text"
                            name="host_port"
                            label="Host and Port"
                            variant="outlined"
                            value={`${formData.host_port}`}
                            onChange={handleChange}
                            required
                            error={formErrors.host_port}
                            helperText={formErrors.host_port ? "Host and Port is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the host address and port</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/*<Typography variant="subtitle1">Username</Typography>*/}
                        <TextField
                            type="text"
                            name="username"
                            label="DB Username"
                            variant="outlined"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            error={formErrors.username}
                            helperText={formErrors.username ? "Username is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the username</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/*<Typography variant="subtitle1">Password</Typography>*/}
                        <TextField
                            type="password"
                            name="password"
                            label="DB Password"
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            error={formErrors.password}
                            helperText={formErrors.password ? "Password is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the password</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/*<Typography variant="subtitle1">Database</Typography>*/}
                        <TextField
                            type="text"
                            name="database"
                            label="Database"
                            variant="outlined"
                            value={formData.database}
                            onChange={handleChange}
                            required
                            error={formErrors.database}
                            helperText={formErrors.database ? "Database is required" : ""}
                        />
                        <Typography variant="body2" color="textSecondary">Enter the database name</Typography>
                    </Box>
                </Box>
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
}
export default ConnectionDetails;
