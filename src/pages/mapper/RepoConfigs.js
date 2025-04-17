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
import {fetchRepoMappings, fetchSourceSystemInfo} from "../../store/mapper/queries";
import SourceSystemInfo from "./source-system/SourceSystemInfo";
import DataExtraction from "../data-extraction/DataExtraction";
import UploadConfig from "./actions/UploadConfig";
import EditMappings from "./actions/EditMappings";
import ImportConfig from "./actions/ImportConfig";
import RepoSkeleton from "../../components/skeleton/Skeleton";
import ActiveSiteConfigInfo from "../configs/Site/ActiveSiteConfigInfo";
import ScheduledRunsStatus from "../configs/Schedules/ScheduledRunsStatus";



const RepoConfigs = () =>{
    const [txcurr, settxcurr] = useState({"indicator_value":"-","indicator_date":"-"});
    const [baseSchemas, setBaseSchemas] = useState([]);

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



    return(
        < >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: 0.5, sm: 0.5 } }}>
                        <Typography variant="h3">{baselookup}
                            <ActiveSiteConfigInfo /> <SourceSystemInfo />
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
                                                <EditMappings baselookup={baselookup}/>

                                                <ImportConfig baselookup={baselookup}/>

                                                <UploadConfig baselookup={baselookup}/>
                                            </Typography>

                                            {base.base_variables.map(base => (
                                                <Button variant="outlined" color={base.matched ? "warning" : "error"} endIcon={base.matched ? <CheckCircleFilled /> : <CloseCircleFilled />} className={{backgroundColor:'rgb(82, 196, 26)'}}>{base.variable}</Button>
                                                )
                                            )}

                                        </Box>


                                        <Divider/>

                                        <DataExtraction baseRepo={baselookup} />
                                        <ScheduledRunsStatus />

                                    </MainCard>
                            </MainCard>
                        </Stack>
                    ) ) :
                        (
                        <RepoSkeleton/>
                        )
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default RepoConfigs;
