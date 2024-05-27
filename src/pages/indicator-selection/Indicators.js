import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// material-ui
import {Grid, Stack, Typography,Button, Divider,Box,IconButton,Tooltip, Fab } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { CheckCircleFilled,EditOutlined,DownCircleFilled,CloseCircleFilled,CloudUploadOutlined   } from '@ant-design/icons';
// import LoadingButton from '@mui/lab/LoadingButton';
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
    const [baseSchemas, setBaseSchemas] = useState([]);
    const [isExpanded,setIsExpanded] = useState(false);
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')


    const getBaseSchemas = async() => {
        console.log()
        await axios.get(API_URL+"/indicator_selector/base_schemas").then(res => {
            setBaseSchemas(res.data);
            console.log(res.data)

        });
    };

    const generateIndicator = async (indicator) =>{
        setSpinner(true)
        await axios.get(API_URL+"/indicator_selector/tx_curr_generate_indicator", {
            params: { indicator }
        }).then((res)=> {settxcurr(res.data.indicators[0]); setSpinner(false)})
    }

    useEffect(() => {
        // getDatabaseColumns()
        getBaseSchemas()
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

                    {baseSchemas.map( (base) => (
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                            <MainCard border={false} boxShadow  sx={{ width: '100%' }}>
                                <Typography variant="h6">
                                    {base.schema}
                                    <Tooltip title="Expand/Hide">
                                        <DownCircleFilled onClick={()=>setIsExpanded(!isExpanded)} />
                                    </Tooltip>
                                </Typography>
                                {isExpanded && (
                                    <MainCard sx={{ width: '100%' }}>
                                        <Box sx={{ p: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                <Button variant="contained" color="info" onClick={()=>generateIndicator("tx_curr")}>
                                                    Generate indicator
                                                    {spinner ?
                                                        <CircularProgress style={{"color":"black"}} size="1rem"/>
                                                        :
                                                        <></>
                                                    }
                                                </Button>
                                                {/*<LoadingButton loading color="secondary" variant="outlined" loadingPosition="end" endIcon={<Checkbox />}>*/}

                                                {/*    Edit*/}

                                                {/*</LoadingButton>*/}
                                            </Typography>
                                            <Typography variant="h6">{base.schema} : <b  style={{"color":"#13c2c2"}}>{txcurr.indicator_value}</b></Typography>
                                            <Typography variant="h6">Indicator Date: <b style={{"color":"#13c2c2"}}>{txcurr.indicator_date}</b></Typography>
                                        </Box>

                                        <Divider/>

                                        <Box sx={{ p: 2 }}>
                                            <Typography variant="h4">Base Variables
                                                <NavLink to={`/selector?baselookup=${base.schema}`} exact activeClassName="active-link">
                                                    <Tooltip title="Update Variables">
                                                        <IconButton variant="outlined" color="success">
                                                            <EditOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                </NavLink>
                                            </Typography>

                                            {base.base_variables.map(base => (
                                                <Button variant="outlined" color={base.matched ? "warning" : "error"} endIcon={base.matched ? <CheckCircleFilled /> : <CloseCircleFilled />} className={{backgroundColor:'rgb(82, 196, 26)'}}>{base.variable}</Button>
                                                )
                                            )}
                                        </Box>
                                        <Tooltip title="Upload Config to the MarketPlace">
                                            <Fab color="error" variant="extended">
                                                Upload <CloudUploadOutlined sx={{ marginLeft: "20px" }}/>
                                            </Fab>
                                        </Tooltip>

                                    </MainCard>
                                )}
                            </MainCard>
                        </Stack>
                    ) )}
                </Grid>
            </Grid>
        </>
    );
};

export default Indicators;
