import {
    Chip, Grid, Skeleton
} from '@mui/material';

import {useGetFetchSourceSystemInfo} from "../../../store/mapper/queries";


const SourceSystemInfo = () =>{
    const {data, isPending, error } = useGetFetchSourceSystemInfo()

    if (isPending) return <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
    if (error) return <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

    return(
    < >
        {data &&
        <Chip label={"SYSTEM : "+data.system + " Version "+ data.system_version } variant="light" color="primary" />
        }
    </>
);
};

export default SourceSystemInfo;
