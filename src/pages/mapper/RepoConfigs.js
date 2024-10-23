import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

// material-ui
import {Skeleton,Grid, Stack, Typography,Button, Divider,Box,IconButton,Tooltip, Fab,Alert,LinearProgress } from '@mui/material';
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

import {API_URL, STAGING_API} from "../../constants"
import axios from "axios";
import { useQuery, QueryClient, QueryClientProvider  } from '@tanstack/react-query'
import {fetchRepoMappings} from "../../actions";



const RepoConfigs = () =>{
    const [txcurr, settxcurr] = useState({"indicator_value":"-","indicator_date":"-"});
    const [loadedData, setLoadedData] = useState([]);

    const [spinner, setSpinner] = useState(null);
    const [uploadSpinner, setUploadSpinner] = useState(null);
    const [importSpinner, setImportSpinner] = useState(null);
    const [successAlert, setSuccessAlert] = useState(null);
    const [message, setMessage] = useState(null);
    const [loadSuccessAlert, setLoadSuccessAlert] = useState(null);
    const [loadMessage, setLoadMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);

    const [progress, setProgress] = useState(0);

    const [datagridcolumns, setColumns] =useState([])
    const [datagridrows, setRows] =useState([])
    const [baseSchemas, setBaseSchemas] = useState([]);
    const [isExpanded,setIsExpanded] = useState(false);

    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')

    const {isPending, error, data } = useQuery({
        queryKey: ['base_schemas', baselookup],
        queryFn: ()=> fetchRepoMappings(baselookup),
    })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message + " Check your source DB/API connection"


    const getBaseSchemas = async() => {
        await fetch(API_URL+"/dictionary_mapper/base_schema_variables/"+baselookup).then(res => {
            setBaseSchemas(res.data);
        });
    };

    const loadData = async (baseRepo) =>{
        setSpinner(true)
        setLoadSuccessAlert(false);

        await axios.get(API_URL+"/dictionary_mapper/load_data/"+baselookup).then((res)=> {
            // setLoadedData(res.data);
            const data = []
            data.push({ field: "id", headerName: "id", width: 130 },)
            Object.keys(res.data[0]).map(row => {
                data.push({ field: row, headerName: row, width: 130 },)
            })
            setColumns(data)

            const rowsWithIds = res.data.map((row, index) => ({ id: index, ...row }));
            setRows(rowsWithIds)
            // setRows(res.data)

            setSpinner(false);
            setAlertType("success");
            setLoadSuccessAlert(true);
            setLoadMessage("Successfully loaded "+baselookup+" data");
        }).catch( (error) => {
            setSpinner(false);
            setLoadSuccessAlert(true);
            setAlertType("error");
            setLoadMessage("Error loading ==> "+error);
        })
    }


    const verifyManifest = async (baseRepo) =>{
        setLoadSuccessAlert(false);
        setProgress(0);

        const data = {
            "base_repository": baseRepo,
            "count": "100",
            "columns": ["ClientID","Gender","MaritalStatus","DOB", "FacilityID"],
            "sessionID": "jjjnjjcncccj",
            "source_system_name": "kenyaemr source system",
            "source_system_version": "19.1.1",
            "opendive_version": "1.0.0"
        }
        try {
            const response = await fetch(`https://4459-165-90-30-222.ngrok-free.app/api/staging/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json(); // Parse JSON error response
                setSpinner(false);
                setLoadSuccessAlert(true);
                setAlertType("error");
                setLoadMessage("Error loading ==> "+errorData.detail);

            }
            for(var i=0; i<=100; i=i+0.1){

                setProgress(progress+i);
            }
            const result = await response.json(); // Process successful response
            setLoadSuccessAlert(true);
            setAlertType("success");
            setLoadMessage("Successfully verified "+baselookup+" endpoint. We are now starting to send");
            sendData(baseRepo)

        } catch (error) {

            console.log("Error loading ==> "+error)
        }

        // setLoadSuccessAlert(false);
        //
        // for(var i=0; i<=100; i=i+0.1){
        //
        //     setProgress(progress+i);
        // }
        // setLoadSuccessAlert(true);
        // setLoadMessage("Successfully sent "+baselookup+" to the warehouse");

    }

    const sendData = async (baseRepo) =>{
        const data={}
        try {
            // const res = await fetch(`https://4459-165-90-30-222.ngrok-free.app/api/staging/usl/${baseRepo}`, {
            const response = await fetch(`${API_URL}/dictionary_mapper/send/usl/${baseRepo}`);
            console.log("response -->", response)
            if (!response.ok) {
                const errorData = await response.json(); // Parse JSON error response
                setSpinner(false);
                setLoadSuccessAlert(true);
                setAlertType("error");
                setLoadMessage("Error sending ==> "+errorData.detail);

            }
            const result = await response.json(); // Process successful response
            setLoadSuccessAlert(true);
            setAlertType("success");
            setLoadMessage("Sending completed");
            sendData(baseRepo)

        } catch (error) {

            console.log("Error sending ==> "+error)
        }
    }

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


    return(
        < >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: 0.5, sm: 0.5 } }}>
                        <Typography variant="h3">{baselookup}</Typography>
                    </Stack>
                </Grid>

                <Grid item xs={12}>

                    {data.length>0 ? data.map( (base) => (
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

                                    <MainCard sx={{ width: '100%'}} >
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
                                                    <Alert color={alertType} onClose={() => {}}>
                                                         {loadMessage}
                                                    </Alert>
                                                }

                                            </Typography>
                                            <Typography variant="h6">
                                                {base.schema} Count: <b  style={{"color":"#13c2c2"}}>{datagridrows.length}</b>
                                                {loadSuccessAlert &&
                                                    <Button variant="outlined" color="success" size="extraSmall" onClick={()=>verifyManifest(baselookup)} style={{"marginLeft":"50px"}}>
                                                        Send To WareHouse
                                                    </Button>
                                                }
                                            </Typography>
                                            {/*<Typography variant="h6">Date: <b style={{"color":"#13c2c2"}}>{txcurr.indicator_date}</b></Typography>*/}
                                        </Box>
                                        <Box sx={{ width: '100%' }}>
                                            { progress >0 &&
                                                <LinearProgress variant="determinate" value={progress} />
                                            }
                                            { datagridrows.length >0 &&
                                                <div>
                                                    <DataGrid
                                                        rows={datagridrows}
                                                        columns={datagridcolumns}
                                                        initialState={{
                                                            pagination: {
                                                                paginationModel: { page: 0, pageSize: 10 },
                                                            },
                                                        }}
                                                        pageSizeOptions={[10, 50]}

                                                    />
                                                </div>
                                            }

                                        </Box>

                                        <Divider/>

                                        <Box sx={{ p: 2 }}>
                                            <Typography variant="h4">Base Variables
                                                <NavLink to={`/schema/selector?baselookup=${base.schema}`} exact activeClassName="active-link">
                                                    <Tooltip title="Manually map/update Variable Mappings">
                                                        <IconButton variant="outlined" color="success">
                                                             <EditOutlined />
                                                        </IconButton>
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
                                            </Typography>

                                            {base.base_variables.map(base => (
                                                <Button variant="outlined" color={base.matched ? "warning" : "error"} endIcon={base.matched ? <CheckCircleFilled /> : <CloseCircleFilled />} className={{backgroundColor:'rgb(82, 196, 26)'}}>{base.variable}</Button>
                                                )
                                            )}

                                        </Box>
                                        <Tooltip title="Upload Mappings Config to the MarketPlace">
                                            <Fab color="error" variant="extended" onClick={()=>uploadConfig(base.schema)}>
                                                Upload Mappings
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

export default RepoConfigs;
