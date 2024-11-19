
import {Button, Grid, Skeleton, Tooltip} from '@mui/material';





const RepoSkeleton = () =>{

    return(
        <div>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

            <Grid container spacing={3}>
                <Grid item xs={3}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                <Grid item xs={3}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
            </Grid>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rectangular" width={600} height={100} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

            <Grid container spacing={3}>
                <Grid item xs={3}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                <Grid item xs={3}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
            </Grid>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="rectangular" width={600} height={100} />

            <Grid container spacing={3}>
                <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
            </Grid><Grid container spacing={3}>
            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
        </Grid><Grid container spacing={3}>
            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
        </Grid>
        </div>
    );
};

export default RepoSkeleton;
