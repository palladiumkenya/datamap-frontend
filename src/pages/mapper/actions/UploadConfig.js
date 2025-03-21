import { useState } from 'react';

import {Alert, Button, Grid, Skeleton, Tooltip, Typography} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import CircularProgress from "@mui/material/CircularProgress";
import {CloudUploadOutlined} from "@ant-design/icons";
import {API_URL} from "../../../constants";
import {useGetConfigCreation, useGetFetchSourceSystemInfo} from "../../../store/mapper/queries";




const UploadConfig = ({baselookup}) =>{
    const [uploadSpinner, setUploadSpinner] = useState(null);
    const [successAlert, setSuccessAlert] = useState(null);
    const [message, setMessage] = useState(null);
    const uploadConfig = async (baselookup) =>{
        setUploadSpinner(true);
        setSuccessAlert(false);

        const response = await fetch(`${API_URL}/mappings_config/generate_config/${baselookup}`);

        if (!response.ok) {
            const errorData = await response.json(); // Parse JSON error response
            setUploadSpinner(false);
            setSuccessAlert(true);
            setMessage("Successfully uploaded "+baselookup+" config")
        }
             setUploadSpinner(false);
            setSuccessAlert(true);
            setMessage("Successfully uploaded "+baselookup+" config")
    }

return(
    < >
        <Tooltip title="Upload Mappings Config to the MarketPlace">
            <Button  color="success"
                     onClick={()=>uploadConfig(baselookup)}
                     endIcon={uploadSpinner ?
                         <CircularProgress style={{"color":"black"}} size="1rem"/>
                         :
                         <CloudUploadOutlined size="1rem"/>
                     }>Upload Mappings</Button>
        </Tooltip>
        {successAlert &&
            <Alert color="success" onClose={() => { }}>
                {message}
            </Alert>
        }
    </>
    );
};

export default UploadConfig;
