import * as React from 'react';

// material-ui
import { Box, Button, Grid, Typography } from '@mui/material';
import SiteConfigsList from "./SiteConfigsList";
import MainCard from 'components/MainCard';
import {useNavigate} from "react-router-dom";

const ViewSiteConfigs = () => {

    const navigate = useNavigate();

    const handleNewConnectionClick = () => {
        navigate('/configs/site/add');
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="center" justifyContent="space-between">
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography  variant="h5">Site Configurations</Typography>
                        </Grid>
                        <Grid item>
                            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={handleNewConnectionClick}>
                                Add Site Configuration
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <MainCard sx={{ mt: 2 }} content={false}>
                        <SiteConfigsList />
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ViewSiteConfigs
