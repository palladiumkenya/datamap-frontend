import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

// material-ui
import {Skeleton,Grid, Stack, Typography,Button, Divider,Box,IconButton,Tooltip, Fab,Alert } from '@mui/material';
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
    const [loadedData, setLoadedData] = useState([]);

    const [spinner, setSpinner] = useState(null);
    const [uploadSpinner, setUploadSpinner] = useState(null);
    const [importSpinner, setImportSpinner] = useState(null);
    const [successAlert, setSuccessAlert] = useState(null);
    const [message, setMessage] = useState(null);
    const [loadSuccessAlert, setLoadSuccessAlert] = useState(null);
    const [loadMessage, setLoadMessage] = useState(null);


    const [datagridcolumns, setColumns] =useState([])
    const [datagridrows, setRows] =useState([])
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

    const loadData = async (baseRepo) =>{
        setSpinner(true)
        setLoadSuccessAlert(false);

        await axios.get(API_URL+"/indicator_selector/load_data/"+baselookup).then((res)=> {
            setLoadedData(res.data);
            const data = []
            Object.keys(res.data[0]).map(row => {
                data.push({ field: row, headerName: row, width: 130 },)
            })
            setColumns(data)

            setRows(res.data)

            setSpinner(false);
            setLoadSuccessAlert(true);
            setLoadMessage("Successfully loaded "+baselookup+" data");
        })
    }

    const uploadConfig = async (baseSchema) =>{
        setUploadSpinner(true);
        setSuccessAlert(false);

        await axios.get(API_URL+"/indicator_selector/generate_config", {
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
        await axios.get(API_URL+"/indicator_selector/import_config", {
            params: { baseSchema }
        }).then((res)=> {
            setImportSpinner(false);
            setMessage("Successfully imported "+baselookup+" config from the marketplace");
            setSuccessAlert(true);
            getBaseSchemas();
        })
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
                        <Typography variant="h3">{baselookup}</Typography>
                    </Stack>
                </Grid>

                <Grid item xs={12}>

                    {baseSchemas.length>0 ? baseSchemas.map( (base) => (
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
                                                <Button variant="contained" color="info" onClick={()=>loadData(baselookup)}>
                                                    Generate / Load
                                                    {spinner ?
                                                        <CircularProgress style={{"color":"black"}} size="1rem"/>
                                                        :
                                                        <></>
                                                    }
                                                </Button>
                                                {loadSuccessAlert &&
                                                    <Alert color="success" onClose={() => {}}>
                                                         {loadMessage}
                                                    </Alert>
                                                }

                                                {/*<LoadingButton loading color="secondary" variant="outlined" loadingPosition="end" endIcon={<Checkbox />}>*/}

                                                {/*    Edit*/}

                                                {/*</LoadingButton>*/}
                                            </Typography>
                                            <Typography variant="h6">{base.schema} Count: <b  style={{"color":"#13c2c2"}}>{loadedData.length}</b></Typography>
                                            {/*<Typography variant="h6">Date: <b style={{"color":"#13c2c2"}}>{txcurr.indicator_date}</b></Typography>*/}
                                        </Box>
                                        <Box>

                                            { loadedData.length >0 &&
                                                <DataGrid
                                                    rows={datagridrows}
                                                    columns={datagridcolumns}
                                                    initialState={{
                                                        pagination: {
                                                            paginationModel: { page: 0, pageSize: 10 },
                                                        },
                                                    }}
                                                    pageSizeOptions={[10, 50]}
                                                    checkboxSelection
                                                />
                                            }

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
                                        {successAlert &&
                                            <Alert color="success" onClose={() => {}}>
                                                 {message}
                                            </Alert>
                                        }

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

export default DictionaryConfigs;
