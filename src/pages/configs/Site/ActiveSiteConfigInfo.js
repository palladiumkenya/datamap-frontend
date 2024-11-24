import {
    Chip, Grid, Skeleton
} from '@mui/material';

import {useGetActiveSiteConfig} from "../../../store/site_configurations/queries";


const ActiveSiteConfigInfo = () =>{
    const {data, isPending, error } = useGetActiveSiteConfig()

    if (isPending) return <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
    if (error) return <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

    return(
        < >
            {data &&
                <Chip label={"SITE : "+data.site_name + "("+ data.site_code+")" } variant="light" color="primary" />
            }
        </>
    );
};

export default ActiveSiteConfigInfo;
