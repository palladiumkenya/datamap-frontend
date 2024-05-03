import { useEffect, useState } from 'react';

// material-ui
import {Grid, Stack, Typography,Button} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

// project import
import MainCard from 'components/MainCard';
import {Link} from "react-router-dom";
import SelectorForm from "./forms/SelectorForm";
import {API_URL} from "../../constants"
import axios from "axios";
// ==============================|| SAMPLE PAGE ||============================== //

const Indicators = () => {
    const [txcurr, settxcurr] = useState({"indicator_value":"-","indicator_date":"-"});
    const [spinner, setSpinner] = useState(false);

    const generateIndicator = async (indicator) =>{
        setSpinner(true)
        await axios.get(API_URL+"/indicator_selector/tx_curr_generate_indicator", {
            params: { indicator }
        }).then((res)=> {settxcurr(res.data.indicators[0]); setSpinner(false)})
    }

    useEffect(() => {
        // getDatabaseColumns()
    }, []);
    return(
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">Indicators</Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <MainCard border={false} boxShadow  sx={{ width: '100%' }}>

                            <Typography variant="h6">TX_CURR</Typography>

                            <MainCard sx={{ width: '100%' }}>

                                <Typography variant="caption" color="text.secondary">
                                    <Button variant="contained" color="info" onClick={()=>generateIndicator("tx_curr")}>
                                        Generate indicator
                                        {spinner ?
                                            <CircularProgress style={{"color":"black"}} size="1rem"/>
                                            :
                                            <></>
                                        }
                                    </Button>
                                </Typography>
                                <Typography variant="h6">TX_CURR : <b  style={{"color":"#13c2c2"}}>{txcurr.indicator_value}</b></Typography>
                                <Typography variant="h6">TX_CURR Date: <b style={{"color":"#13c2c2"}}>{txcurr.indicator_date}</b></Typography>


                            </MainCard>
                        </MainCard>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default Indicators;
