import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

// material-ui
import {
    Skeleton,
    Grid,
    Stack,
    Typography,
    Button,
    Divider,
    Box,
    IconButton,
    Tooltip,
    Fab,
    Alert,
    LinearProgress,
    Chip
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import { CheckCircleFilled,EditOutlined,DownCircleFilled,CloseCircleFilled,CloudUploadOutlined,
    FileSyncOutlined,RightCircleFilled,InfoCircleFilled  } from '@ant-design/icons';

import MainCard from 'components/MainCard';

import {API_URL, STAGING_API} from "../../constants"
import axios from "axios";
import { useQuery, QueryClient, QueryClientProvider  } from '@tanstack/react-query'
import {fetchRepoMappings, fetchSourceSystemInfo, fetchSourceSystemTablesAndColumns} from "../../actions/queries";
import {useGetDataDictionarySyncAlert} from "../../store/alerts/queries";
import SourceSystemInfo from "./source-system/SourceSystemInfo";
import DataExtraction from "../data-extraction/DataExtraction";



const RepoConfigs = () =>{
    const [txcurr, settxcurr] = useState({"indicator_value":"-","indicator_date":"-"});

    const [uploadSpinner, setUploadSpinner] = useState(null);
    const [importSpinner, setImportSpinner] = useState(null);

    const [successAlert, setSuccessAlert] = useState(null);
    const [message, setMessage] = useState(null);


    const [progress, setProgress] = useState(0);
    // const [ws, setWs] = useState(null);

    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')

    const {isPending, error, data } = useQuery({
        queryKey: ['base_schemas', baselookup],
        queryFn: ()=> fetchRepoMappings(baselookup),
    })

    if (isPending) return 'Loading...'

    if (error) return <Alert color="error" icon={<InfoCircleFilled  />}>
    An error has occurred: Check your source DB/API connection in the Configurations page and make
        sure you can connect to it and then try again    </Alert>


    const getBaseSchemas = async() => {
        await fetch(API_URL+"/dictionary_mapper/base_schema_variables/"+baselookup).then(res => {
            setBaseSchemas(res.data);
        });
    };


    const uploadConfig = async (baseSchema) =>{
        setUploadSpinner(true);
        setSuccessAlert(false);

        await axios.get(API_URL+"/dictionary_mapper/generate_config", {
            params: { baseSchema }
        }).then((res)=> {
            setUploadSpinner(false);
            setSuccessAlert(true);

            setMessage("Successfully uploaded "+baselookup+" config")
        })
    }

    const importConfig = async (baseSchema) =>{
        setImportSpinner(true);
        setSuccessAlert(false);
        await axios.get(API_URL+"/dictionary_mapper/import_config", {
            params: { baseSchema }
        }).then((res)=> {
            setImportSpinner(false);
            setMessage("Successfully imported "+baselookup+" config from the marketplace");
            setSuccessAlert(true);
            getBaseSchemas();
        })
    }

    // const getSourceSystemInfo =  async () => {
    //     const systemInforesults = await fetch(API_URL+"/db_access/active_connection").then((res) =>
    //             res.json(),
    //
    //     );
    //
    //     if (!systemInforesults.ok){
    //         throw new Error(`Response status: ${response.status}`);
    //     }
    //     const json = await response.json();
    //     console.log("systemInforesults -->",json)
    //
    //     // setSystemName(json.data.name);
    //     // setSystemVersion(json.data.system_version);
    // };


    // useEffect(() => {
    //     // Establish WebSocket connection when component mounts
    //     const websocket = new WebSocket(`ws://${API_URL}/usl_data/ws/progress`);
    //     console.log("websocket ===>", websocket)
    //     websocket.onmessage = (event) => {
    //         console.log("message.event ==>",event)
    //
    //         const message = JSON.parse(event.data);
    //         console.log("message.message ==>",message), "done"
    //
    //         setProgress(message.progress);  // Update the progress bar with new value
    //         console.log("message.progress ==>",message.progress)
    //     };
    //
    //     websocket.onclose = () => {
    //         console.log('WebSocket connection closed');
    //     };
    //
    //     setWs(websocket);
    //
    //     // Cleanup WebSocket connection when the component unmounts
    //     return () => {
    //         websocket.close();
    //     };
    // }, []);


    return(
        < >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: 0.5, sm: 0.5 } }}>
                        <Typography variant="h3">{baselookup}
                            <SourceSystemInfo />
                        </Typography>
                    </Stack>
                </Grid>

                <Grid item xs={12}>

                    {data.length>0 ? data.map( (base) => (
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                            <MainCard border={false} boxShadow  sx={{ width: '100%' }}>

                                    <MainCard sx={{ width: '100%'}} >

                                        <Box sx={{ p: 2 }}>
                                            <Typography variant="h4">Base Variables
                                                <NavLink to={`/schema/selector?baselookup=${base.schema}`} exact activeClassName="active-link">
                                                    <Tooltip title="Manually map/update Variable Mappings">
                                                        {/*<IconButton variant="outlined" color="success">*/}
                                                        {/*     <EditOutlined />*/}
                                                        {/*</IconButton>*/}
                                                        <Button  color="success"
                                                                 // onClick={()=>importConfig(base.schema)}
                                                                 endIcon={<EditOutlined sx={{ marginLeft: "20px" }}/>}
                                                        >Edit Mappings</Button>
                                                    </Tooltip>
                                                </NavLink>
                                                <Tooltip title="Import Mappings Config from the MarketPlace">
                                                    <Button  color="info"
                                                             onClick={()=>importConfig(base.schema)}
                                                             endIcon={importSpinner ?
                                                        <CircularProgress style={{"color":"black"}} size="1rem"/>
                                                        :
                                                        <FileSyncOutlined sx={{ marginLeft: "20px" }}/>
                                                    }>Import Mappings</Button>
                                                </Tooltip>
                                                <Tooltip title="Upload Mappings Config to the MarketPlace">
                                                    <Button  color="success"
                                                             onClick={()=>uploadConfig(base.schema)}
                                                             endIcon={uploadSpinner ?
                                                                 <CircularProgress style={{"color":"black"}} size="1rem"/>
                                                                 :
                                                                 <CloudUploadOutlined size="1rem"/>
                                                             }>Upload Mappings</Button>
                                                </Tooltip>
                                            </Typography>

                                            {base.base_variables.map(base => (
                                                <Button variant="outlined" color={base.matched ? "warning" : "error"} endIcon={base.matched ? <CheckCircleFilled /> : <CloseCircleFilled />} className={{backgroundColor:'rgb(82, 196, 26)'}}>{base.variable}</Button>
                                                )
                                            )}

                                        </Box>

                                        {successAlert &&
                                            <Alert color="success" onClose={() => { }}>
                                                 {message}
                                            </Alert>
                                        }

                                        <Divider/>

                                        <DataExtraction baselookup={baselookup} />

                                    </MainCard>
                            </MainCard>
                        </Stack>
                    ) ) :
                    (
                        <div>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

                            <Grid container spacing={3}>
                                <Grid item xs={3}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                                <Grid item xs={3}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                            </Grid>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="rectangular" width={600} height={100} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

                            <Grid container spacing={3}>
                                <Grid item xs={3}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                                <Grid item xs={3}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                            </Grid>
                            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                            <Skeleton variant="rectangular" width={600} height={100} />

                            <Grid container spacing={3}>
                                <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                                <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                            </Grid><Grid container spacing={3}>
                            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                        </Grid><Grid container spacing={3}>
                            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                            <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>
                        </Grid>
                        </div>
                        )
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default RepoConfigs;
