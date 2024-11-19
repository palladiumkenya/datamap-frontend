
import {Button, Tooltip} from '@mui/material';

// project import

import {EditOutlined} from "@ant-design/icons";

import {NavLink} from "react-router-dom";




const EditMappings = ({baselookup}) =>{

return(
    < >
        <NavLink to={`/schema/selector?baselookup=${baselookup}`} exact activeClassName="active-link">
            <Tooltip title="Manually map/update Variable Mappings">
                <Button  color="success"
                         endIcon={<EditOutlined sx={{ marginLeft: "20px" }}/>}
                >Edit Mappings</Button>
            </Tooltip>
        </NavLink>
    </>
    );
};

export default EditMappings;
