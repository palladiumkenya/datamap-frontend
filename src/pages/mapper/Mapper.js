// material-ui
import {Grid, Stack, Typography} from '@mui/material';

// project import
import SelectorForm from "./selector-form/SelectorForm";

// ==============================|| SAMPLE PAGE ||============================== //

const Mapper = () => (
    <Grid container spacing={3}>
        <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>

            </Stack>
        </Grid>
        <Grid item xs={12}>
            <SelectorForm />
        </Grid>
    </Grid>
);

export default Mapper;
