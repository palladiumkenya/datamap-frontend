// material-ui
import {Grid, Stack, Typography} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import {Link} from "react-router-dom";
import SelectorForm from "./forms/SelectorForm";

// ==============================|| SAMPLE PAGE ||============================== //

const Selector = () => (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                {/*<Typography variant="h3">Indicator Selector</Typography>*/}

            </Stack>
        </Grid>
        <Grid item xs={12}>
            <SelectorForm />
        </Grid>
    </Grid>
);

export default Selector;
