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

import CircularProgress from '@mui/material/CircularProgress';
import { CheckCircleFilled,EditOutlined,CloseCircleFilled,CloudUploadOutlined,
    FileSyncOutlined,InfoCircleFilled  } from '@ant-design/icons';

import MainCard from 'components/MainCard';

import {API_URL} from "../../constants"
import axios from "axios";
import { useQuery  } from '@tanstack/react-query'
import {fetchRepoMappings, fetchSourceSystemInfo} from "../../actions/queries";
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
        await fetch(`${API_URL}/dictionary_mapper/base_schema_variables/${baselookup}`).then(res => {
            setBaseSchemas(res.data);
        });
    };


    const uploadConfig = async (baseSchema) =>{
        setUploadSpinner(true);
        setSuccessAlert(false);

        await axios.get(`${API_URL}dictionary_mapper/generate_config`, {
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
        await axios.get(`${API_URL}/dictionary_mapper/import_config`, {
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
