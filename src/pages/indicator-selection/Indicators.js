import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

// material-ui
import {Grid, Stack, Typography, Button, Divider, Box, IconButton, Tooltip, Fab, Alert, Skeleton} from '@mui/material';
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


const Indicators = () =>{

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

    const uploadConfig = async (baseSchema) =>{
        setSpinner(true);
        await axios.get(API_URL+"/indicator_selector/generate_config", {
            params: { baseSchema }
        }).then((res)=> {setSpinner(false)})
    }

    const importConfig = async (baseSchema) =>{
        setSpinner(true);
        await axios.get(API_URL+"/indicator_selector/import_config", {
            params: { baseSchema }
        }).then((res)=> {setSpinner(false); getBaseSchemas()})
    }

    const expandEl = (isShown) => {
        console.log('isShown', isShown)
        if (el.current) {
            console.log('isShown el', el.current)
            console.log('isShown el', el.current.style)

            if (isShown==true){
                el.current.style.display = 'block';
            }else{
                el.current.style.display = 'none';

            }
            console.log('isShown el', el.current.style.display)

        }
    }

    useEffect(() => {
        // getDatabaseColumns()
        getBaseSchemas()
    }, []);

    return(
        < >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">Base Repositories</Typography>
                    </Stack>
                </Grid>

                <Grid item xs={12}>

                    {baseSchemas.length >0  ?
                        baseSchemas.map( (base) => (
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
                                {/*{isExpanded[0] && isExpanded[1]==base.schema && (*/}
                                {isExpanded && (
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
                                                             endIcon={spinner ?
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
                                                Upload
                                                {spinner ?
                                                    <CircularProgress style={{"color":"black"}} size="1rem"/>
                                                    :
                                                    <CloudUploadOutlined sx={{ marginLeft: "20px" }}/>
                                                }
                                            </Fab>
                                        </Tooltip>
                                        {!spinner &&
                                            <Alert color="success" onClose={() => {}}>
                                                Successfully uploaded {base.schema} config
                                            </Alert>
                                        }


                                    </MainCard>
                                )}
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

export default Indicators;
