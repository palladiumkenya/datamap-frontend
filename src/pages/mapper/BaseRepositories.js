import { NavLink } from 'react-router-dom';

// material-ui
import {Grid, Stack, Typography, Tooltip, Skeleton} from '@mui/material';
import { RightCircleFilled } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import { useQuery } from '@tanstack/react-query'
import {fetchBaseRepositories} from "../../actions";
// import {fetchBaseRepositories} from "../../actions";




const BaseRepositories = () =>{

    const {isPending, error, data } = useQuery({
        queryKey: ['base_schemas'],
        queryFn: ()=> fetchBaseRepositories(),
    })

    if (isPending) return (<div>
            <Typography variant="caption" color="text.secondary">Loading ...</Typography>
            <Skeleton variant="rectangular" width={600} height={100} />
            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

            <Skeleton variant="rectangular" width={600} height={100} />
            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

            <Skeleton variant="rectangular" width={600} height={100} />
            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

            <Skeleton variant="rectangular" width={600} height={100} />
            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
        </div>)

    if (error) return (<Typography variant="caption" color="text.error">'An error has occurred: ' + error.message + "
        Check your source DB/API source connection configuration"</Typography>)


    return(
        < >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">Base Repositories</Typography>
                    </Stack>
                </Grid>

                <Grid item xs={12}>

                    {data.length >0  ?
                        data.map( (base) => (
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                            <MainCard border={false} boxShadow  sx={{ width: '100%' }}>
                                <Typography variant="h6">
                                    {base.schema}
                                    <Tooltip title="Expand/Hide">
                                        <NavLink to={`/schema/config?baselookup=${base.schema}`} exact activeClassName="active-link">
                                            <RightCircleFilled
                                                // onClick={(e)=>{setIsExpanded(!isExpanded)}}
                                            />
                                        </NavLink>
                                    </Tooltip>
                                </Typography>

                            </MainCard>
                        </Stack>
                        ) ) :
                        (
                        <div>
                            <Skeleton variant="rectangular" width={600} height={100} />
                            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

                            <Skeleton variant="rectangular" width={600} height={100} />
                            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

                            <Skeleton variant="rectangular" width={600} height={100} />
                            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

                            <Skeleton variant="rectangular" width={600} height={100} />
                            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

                        </div>
                        )
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default BaseRepositories;
