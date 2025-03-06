import React, {useState} from 'react';
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Button,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {API_URL} from "../../../constants";
import {ReloadOutlined} from "@ant-design/icons";
import {useDropzone} from "react-dropzone";
import "./FileUpload.css";
import {parseCSV} from "../../../helpers/parseCSV";
import RestApiDataForm from "./RestApiDataForm";



const ConnectionDetails = ({ onNextStep }) => {
    const [formData, setFormData] = useState({
        host_port: '',
        username: '',
        password: '',
        database: '',
        db_type: '',
        conn_type: ''
    });
    const [apiFormData, setApiFormData] = useState({
        endpoint: '',
        method: 'GET',
        auth: false,
        dataPath: '',
        body: undefined
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
    const [apiFormErrors, setAPIFormErrors] = useState({
        endpoint: false,
        method: false,
        auth: false,
        dataPath: false
    });
    const [selectedFile, setSelectedFile] = useState(null);

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

    const handleValidationAPI = () => {
        let valid = true;
        const newErrors = { ...formErrors };

        // Check if any required fields are empty
        if (!apiFormData.endpoint.trim()) {
            newErrors.endpoint = true;
            valid = false;
        }
        if (!apiFormData.method.trim()) {
            newErrors.method = true;
            valid = false;
        }

        setAPIFormErrors(newErrors);
        return valid;
    };

    const handleClick = async () => {
        if (handleValidation() && formData.db_type !== 'api') {
            let conn_str = `${formData.db_type}://${formData.username}:${formData.password}@${formData.host_port}/${formData.database}`
            onNextStep({conn_str, conn_type: formData.conn_type});
        } else if(handleValidationAPI() && formData.db_type === 'api'){
            try {
                const response = await fetch(apiFormData.endpoint, {
                    method: apiFormData.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // body: JSON.stringify(formData.body), // TODO: add json body for post requests
                });
                const responseData = await response.json();
                if (!response.ok) {
                    setAlertType('error')
                    setAlertMessage(`API connection failed! ${responseData}`)
                } else {
                    if (responseData.hasOwnProperty(apiFormData.dataPath) || apiFormData.dataPath === '') {
                        onNextStep({
                            conn_str: apiFormData.endpoint,
                            conn_type: formData.conn_type,
                            db: formData.db_type,
                            data: responseData[apiFormData.dataPath] ?? responseData
                        })
                    } else {
                        setAlertType('error')
                        setAlertMessage('Data does not contain JSON key in result')
                    }
                }
                setTestLoader(false)
            } catch (error) {
                setAlertType('error')
                console.error('Error testing API connection:', JSON.stringify(error));
                setAlertMessage(error)
                setTestLoader(false)
            }
        }
    };

    const handleAutocompleteChange = (event, newValue) => {
        if (newValue) {
            setFormData((prevData) => ({...prevData, db_type: newValue.driver, conn_type: newValue.title.toLowerCase()}))
        } else {
            setFormData({
                ...formData,
                db_type: '',
                conn_type: ''
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
        setTestLoader(true)
        event.preventDefault();
        if (handleValidation() && formData.db_type !== 'api') {
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
        } else if (handleValidationAPI()){
            try {
                const response = await fetch(apiFormData.endpoint, {
                    method: apiFormData.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // body: JSON.stringify(formData.body), // TODO: add json body for post requests
                });
                const responseData = await response.json();
                if (!response.ok) {
                    setAlertType('error')
                    setAlertMessage(`API connection failed! ${responseData}`)
                } else {
                    if (responseData.hasOwnProperty(apiFormData.dataPath) || apiFormData.dataPath === '') {
                        setAlertType('success')
                        setAlertMessage('Successfully connected to API')
                    } else {
                        setAlertType('error')
                        setAlertMessage('Data does not contain JSON key in result')
                    }
                }
            } catch (error) {
                setAlertType('error')
                console.error('Error testing API connection:', JSON.stringify(error));
                setAlertMessage(error)
                setTestLoader(false)
            } finally {
                setTestLoader(false)
            }
        }
        setTestLoader(false)
    };

    const images = [
        {
            url: '/data_sources/mysql.png',
            title: 'MySQL',
            driver: 'mysql'
        },
        {
            url: '/data_sources/mssql.png',
            title: 'MSSQL',
            driver: 'mssql+pymssql'
        },
        {
            url: '/data_sources/pgsql.png',
            title: 'Postgres',
            driver: 'postgresql'
        },
        {
            url: '/data_sources/sqlite.png',
            title: 'SQLite',
            driver: 'sqlite'
        },
        {
            url: '/data_sources/mongo.png',
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
            url: '/data_sources/csv.png',
            title: 'CSV',
            driver: 'csv',
            disabled: false
        },
        {
            url: '/data_sources/rest-api.png',
            title: 'RESTful APIs',
            driver: 'api',
            disabled: false
        },
        {
            url: '/data_sources/snowflake.png',
            title: 'Snowflake',
            driver: 'snow',
            disabled: true
        },
    ];

    const onDrop = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
        const reader = new FileReader();
        reader.onload = () => {
            const data = reader.result;
            let parsedData = parseCSV(data);
            onNextStep({db: formData.db_type, data: parsedData || [], conn_type: formData.conn_type})
        };
        reader.readAsText(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: ".csv", });

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
                    {['mysql', 'mssql+pymssql', 'postgresql'].includes(formData.db_type) &&
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
                        </>
                    }
                    {
                        formData.db_type === 'csv' &&
                        <Box sx={{width: '100%'}}>
                            <Typography sx={{mb: '25px'}}>
                                Add csv file with data
                            </Typography>
                            <div>
                                <div className="dropzone-container">
                                    <div {...getRootProps()} className="dropzone">
                                        <input {...getInputProps()} />
                                        <p>Drag & drop a CSV file here or click to select a file</p>
                                    </div>
                                    {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                                </div>
                            </div>
                        </Box>
                    }
                    {
                        formData.db_type === 'api' &&
                        <RestApiDataForm setAPIData={setApiFormData} apiData={apiFormData} apiFormError={apiFormErrors}/>
                    }

                </Box>
                {
                    formData.db_type !== 'csv' &&
                    <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
                        <Box sx={{flex: '1 1 auto'}}/>
                        <Stack direction="row" spacing={2}>
                            <LoadingButton
                                loading={testLoader}
                                loadingPosition="start"
                                startIcon={<ReloadOutlined />}
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
                }
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
