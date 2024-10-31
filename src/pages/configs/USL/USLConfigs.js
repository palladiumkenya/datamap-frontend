import * as React from 'react';

// material-ui
import { Box, Grid } from '@mui/material';

import MainCard from 'components/MainCard';
import USLConfigsTabs from "./USLConfigsTabs";


const USLConfigs = () => {

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="center" justifyContent="space-between">
                <Grid item xs={12}>
                    <MainCard sx={{ mt: 2 }} content={true}>
                        <USLConfigsTabs/>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default USLConfigs;
