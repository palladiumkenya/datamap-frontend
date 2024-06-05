import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

// material-ui
import {Grid, Stack, Typography,Button, Divider,Box,IconButton,Tooltip, Fab,Alert } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { CheckCircleFilled,EditOutlined,DownCircleFilled,CloseCircleFilled,CloudUploadOutlined,
    FileSyncOutlined,RightCircleFilled } from '@ant-design/icons';

import MainCard from 'components/MainCard';

import {API_URL} from "../../constants"
import axios from "axios";
import { useQuery, QueryClient, QueryClientProvider  } from '@tanstack/react-query'
import {fetchBaseSchemas} from "../../actions";
// ==============================|| SAMPLE PAGE ||============================== //



//
// const queryClient = new QueryClient()
//
// export default function IndicatorsSection() {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <Indicators />
//         </QueryClientProvider>
//     )
// }


const DictionaryConfigs = () =>{

    // const { isLoading, isPending, data, error } = useQuery({
    //     queryKey: ['base_schemas'],
    //     queryFn: ()=> fetch(API_URL+"/indicator_selector/base-schemas").then((res) =>
    //         res.json(),
    //     ),
    // })
    //
    // if (isLoading) return 'Loading...'
    // if (isPending) return 'Pending...'
    //
    // if (error) return 'An error has occurred: ' + error.message

    const el = useRef(null)

    const [txcurr, settxcurr] = useState({"indicator_value":"-","indicator_date":"-"});
    const [spinner, setSpinner] = useState(null);
    const [uploadSpinner, setUploadSpinner] = useState(null);
    const [importSpinner, setImportSpinner] = useState(null);
    const [successSpinner, setSuccessSpinner] = useState(null);

    const [baseSchemas, setBaseSchemas] = useState([]);
    const [isExpanded,setIsExpanded] = useState(false);
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')


    const getBaseSchemas = async() => {
        await axios.get(API_URL+"/indicator_selector/base_schema_variables/"+baselookup).then(res => {
            setBaseSchemas(res.data);
        });
    };

    const generateIndicator = async (indicator) =>{
        setSpinner(true)
        await axios.get(API_URL+"/indicator_selector/tx_curr_generate-indicator", {
            params: { indicator }
        }).then((res)=> {settxcurr(res.data.indicators[0]); setSpinner(false)})
    }

    const uploadConfig = async (baseSchema) =>{
        setUploadSpinner(true);
        await axios.get(API_URL+"/indicator_selector/generate_config", {
            params: { baseSchema }
        }).then((res)=> { setTimeout(setUploadSpinner(false), 300)})
    }

    const importConfig = async (baseSchema) =>{
        setImportSpinner(true);
        await axios.get(API_URL+"/indicator_selector/import_config", {
            params: { baseSchema }
        }).then((res)=> {setImportSpinner(false); getBaseSchemas()})
    }



    useEffect(() => {
        // getDatabaseColumns()
        getBaseSchemas()
    }, []);

    return(
        < >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: 0.5, sm: 0.5 } }}>
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
                                        <NavLink to={`/Schema/config?baselookup=${base.schema}`} exact activeClassName="active-link">
                                            <RightCircleFilled  onClick={(e)=>{setIsExpanded(!isExpanded)}} />
                                        </NavLink>
                                    </Tooltip>
                                </Typography>

                                    <MainCard sx={{ width: '100%'}} ref={el}>
                                        <Box sx={{ p: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                <Button variant="contained" color="info" onClick={()=>generateIndicator("tx_curr")}>
                                                    Generate / Load
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
                                            <Typography variant="h6">Date: <b style={{"color":"#13c2c2"}}>{txcurr.indicator_date}</b></Typography>
                                        </Box>

                                        <Divider/>

                                        <Box sx={{ p: 2 }}>
                                            <Typography variant="h4">Base Variables
                                                <NavLink to={`/schema/selector?baselookup=${base.schema}`} exact activeClassName="active-link">
                                                    <Tooltip title="Manually map/update Variables">
                                                        <IconButton variant="outlined" color="success">
                                                            <EditOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                </NavLink>
                                                <Tooltip title="Import Config from the MarketPlace">
                                                    <Button  color="info"
                                                             onClick={()=>importConfig(base.schema)}
                                                             endIcon={importSpinner ?
                                                        <CircularProgress style={{"color":"black"}} size="1rem"/>
                                                        :
                                                        <FileSyncOutlined sx={{ marginLeft: "20px" }}/>
                                                    }>Import Config</Button>
                                                </Tooltip>
                                            </Typography>

                                            {base.base_variables.map(base => (
                                                <Button variant="outlined" color={base.matched ? "warning" : "error"} endIcon={base.matched ? <CheckCircleFilled /> : <CloseCircleFilled />} className={{backgroundColor:'rgb(82, 196, 26)'}}>{base.variable}</Button>
                                                )
                                            )}

                                        </Box>
                                        <Tooltip title="Upload Config to the MarketPlace">
                                            <Fab color="error" variant="extended" onClick={()=>uploadConfig(base.schema)}>
                                                Upload to Marketplace
                                                {uploadSpinner ?
                                                    <CircularProgress style={{"color":"black", "marginLeft":"10px"}} size="1rem"/>
                                                    :
                                                    <CloudUploadOutlined style={{ marginLeft: "10px" }}/>
                                                }
                                            </Fab>
                                        </Tooltip>
                                        {successSpinner &&
                                            <Alert color="success" onClose={() => {}}>
                                                Successfully uploaded {base.schema} config
                                            </Alert>
                                        }

                                    </MainCard>
                            </MainCard>
                        </Stack>
                    ) )}
                </Grid>
            </Grid>
        </>
    );
};

export default DictionaryConfigs;
