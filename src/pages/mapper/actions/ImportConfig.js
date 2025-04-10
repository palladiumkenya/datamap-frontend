import { useState } from 'react';

import {Alert, Button, Tooltip} from '@mui/material';

// project import
import CircularProgress from "@mui/material/CircularProgress";
import { FileSyncOutlined} from "@ant-design/icons";
import {API_URL} from "../../../constants";




const ImportConfig = ({baselookup, onUpdate}) =>{
    const [importSpinner, setImportSpinner] = useState(null);
    const [successAlert, setSuccessAlert] = useState(null);
    const [message, setMessage] = useState(null);

    const importConfig = async (baselookup) =>{
        setImportSpinner(true);
        setSuccessAlert(false);

        const response = await fetch(`${API_URL}/mappings_config/import_config/${baselookup}`);

        if (!response.ok) {
            const errorData = await response.json(); // Parse JSON error response
            setImportSpinner(false);
            setSuccessAlert(true);
            setMessage("Successfully uploaded "+baselookup+" config")
        }
        setImportSpinner(false);
        setMessage("Successfully imported "+baselookup+" config from the marketplace");
        setSuccessAlert(true);
        // getBaseSchemas();

    }

return(
    < >
        <Tooltip title="Import Mappings Config from the MarketPlace">
            <Button  color="info"
                     onClick={()=>importConfig(baselookup)}
                     endIcon={importSpinner ?
                         <CircularProgress style={{"color":"black"}} size="1rem"/>
                         :
                         <FileSyncOutlined sx={{ marginLeft: "20px" }}/>
                     }>Import Mappings</Button>
        </Tooltip>
        {successAlert &&
            <Alert color="success" onClose={() => { }}>
                {message}
            </Alert>
        }
    </>
    );
};

export default ImportConfig;
