import {
    Chip, Grid, Skeleton
} from '@mui/material';

import {useGetActiveSiteConfig} from "../../../store/site_configurations/queries";
import {useNavigate} from "react-router-dom";


const ActiveSiteConfigInfo = () =>{
    const navigate = useNavigate();

    const {data, isPending, error } = useGetActiveSiteConfig()

    if (isPending) return <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
    if (error) return <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>


    return(
        < >
            {data && !Array.isArray(data) ?(
                <Chip label={"SITE : "+data.site_name + "("+ data.site_code+")" } variant="light" color="primary" />
                )
                :(
                    <Chip label={"SITE : undefined. Click HERE to configure a site" } variant="light" color="error"
                    onClick={()=>navigate('/configs/site')}/>
                )
            }
        </>
    );
};

export default ActiveSiteConfigInfo;
