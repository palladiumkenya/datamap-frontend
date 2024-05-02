import React, {useState} from 'react';
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";



const ConnectionDetails = ({driver}) => {

    const [formData, setFormData] = useState({
        host_port: '',
        username: '',
        password: '',
        database: '',
    });
    const [apiResponse, setApiResponse] = useState('');
    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Construct the API request with the driver and form data
        const apiRequest = {
            db_type: driver,
            ...formData,
        };
        console.log('API Request:', apiRequest);

        // Call your API to test the connection
        try {
            const response = await fetch('http://localhost:8000/api/db_access/test_db_connection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiRequest),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            setApiResponse(responseData);
            setOpen(true);
        } catch (error) {
            console.error('Error testing connection:', error);
            setApiResponse(error)
        }
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Box>
            <Typography variant="h5" mb={2.5}>Connection Details</Typography>
            <form onSubmit={handleSubmit} autoComplete="of">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {/*<Typography variant="subtitle1">Host & Port</Typography>*/}
                        <TextField
                            type="text"
                            name="host"
                            label="Host and Port"
                            variant="outlined"
                            value={`${formData.host}`}
                            onChange={handleChange}
                            required
                        />
                        <Typography variant="body2" color="textSecondary">Enter the host address and port</Typography>
                    </Box>
                    {/*<Box sx={{ display: 'flex', flexDirection: 'column' }}>*/}
                    {/*    <Typography variant="subtitle1">Port</Typography>*/}
                    {/*    <TextField*/}
                    {/*        type="number"*/}
                    {/*        name="port"*/}
                    {/*        variant="outlined"*/}
                    {/*        value={formData.port}*/}
                    {/*        onChange={handleChange}*/}
                    {/*        required*/}
                    {/*    />*/}
                    {/*    <Typography variant="body2" color="textSecondary">Enter the port number</Typography>*/}
                    {/*</Box>*/}
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
                        />
                        <Typography variant="body2" color="textSecondary">Enter the database name</Typography>
                    </Box>
                </Box>
                <Button type="submit" variant="contained" color="success">
                    Test Connection
                </Button>
            </form>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Connection Result</DialogTitle>
                <DialogContent>
                    <Typography>{apiResponse}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
export default ConnectionDetails;
