
import {Button, Tooltip} from '@mui/material';

// project import

import {EditOutlined} from "@ant-design/icons";

import {NavLink} from "react-router-dom";
import {useGetFetchSourceSystemInfo} from "../../../store/mapper/queries";




const EditMappings = ({baselookup}) =>{

    const {data:sourceSystemData, isLoading:isSourceSystemLoading, error:sourceSystemError } = useGetFetchSourceSystemInfo()

    return(
    < >
        {!isSourceSystemLoading &&
                (sourceSystemData.conn_type.toLowerCase()==="csv" || sourceSystemData.conn_type.toLowerCase()==="api" ?(
                    <NavLink to={`/schema/CsvApiMapper?baselookup=${baselookup}`} exact activeClassName="active-link">
                        <Tooltip title="Manually map/update Variable Mappings">
                                        <Button  color="success"
                                                 endIcon={<EditOutlined sx={{ marginLeft: "20px" }}/>}
                                        >Edit Mappings</Button>
                        </Tooltip>
                    </NavLink>
                    ):(
                    <NavLink to={`/schema/DBmapper?baselookup=${baselookup}`} exact activeClassName="active-link">
                        <Tooltip title="Manually map/update Variable Mappings">
                                        <Button  color="success"
                                                 endIcon={<EditOutlined sx={{ marginLeft: "20px" }}/>}
                                        >Edit Mappings</Button>
                        </Tooltip>
                    </NavLink>
                )
            )
        }
    </>
    );
};

export default EditMappings;
