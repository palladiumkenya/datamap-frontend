import * as React from 'react';

// material-ui
import { Box, Grid } from '@mui/material';
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import ManageHistoryRoundedIcon from '@mui/icons-material/ManageHistoryRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded';

import MainCard from 'components/MainCard';
import ConfigCard from "../../components/cards/ConfigCard";


const Configs = () => {

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="center" justifyContent="space-between">
                <Grid item xs={12}>
                    <MainCard sx={{ mt: 2 }} content={true}>
                        <Grid container rowSpacing={2.5} columnSpacing={2.75} alignItems="center" justifyContent="space-between" direction={'row'}>
                            <Grid item xs={4}>
                                <ConfigCard title={'Data Access Configurations'} icon={<KeyRoundedIcon sx={{ fontSize: 40 }}/>} action={'/configs/db/list'}/>
                            </Grid>
                            <Grid item xs={4}>
                                <ConfigCard title={'USL Configurations'} icon={<DatasetRoundedIcon sx={{ fontSize: 40 }}/>} action={'/configs/usl'}/>
                            </Grid>
                            <Grid item xs={4}>
                                <ConfigCard title={'Scheduling Configurations'} icon={<ManageHistoryRoundedIcon sx={{ fontSize: 40 }}/>} action={'/configs/scheduling'}/>
                            </Grid>
                            <Grid item xs={4}>
                                {/*<ConfigCard title={'Site Configurations'}/>*/}
                            </Grid>
                            <Grid item xs={4}>
                                <ConfigCard title={'Site Configurations'} icon={<CorporateFareRoundedIcon sx={{ fontSize: 40 }}/>} action={'/configs/site'}/>
                            </Grid>
                            <Grid item xs={4}>
                                {/*<ConfigCard title={'Site Configurations'}/>*/}
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Configs;
