import * as React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { Box, Button, Grid, Typography } from '@mui/material';
import ConfigsList from "./ConfigsList";
import MainCard from 'components/MainCard';

const DataAccessConfigs = () => {
    const navigate = useNavigate();

    const handleNewConnectionClick = () => {
        navigate('/configs/db/add');
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="center" justifyContent="space-between">
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography  variant="h5">Database Configurations</Typography>
                        </Grid>
                        <Grid item>
                            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} onClick={handleNewConnectionClick}>
                                Add Database Configuration
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <MainCard sx={{ mt: 2 }} content={false}>
                        <ConfigsList />
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DataAccessConfigs;
