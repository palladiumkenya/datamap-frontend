import { useEffect, useState, useRef } from 'react';
// material-ui
import {Grid, Stack, Typography,Checkbox, FormControlLabel, RadioGroup, Radio} from '@mui/material';

// project import
import SelectorForm from "./selector-form/SelectorForm";
import ActiveSiteConfigInfo from "../configs/Site/ActiveSiteConfigInfo";
import SourceSystemInfo from "./source-system/SourceSystemInfo";
import AddQuerySelectorForm from "./selector-form/AddQuerySelectorForm";
import {useGetFetchSourceSystemInfo} from "../../store/mapper/queries";
import CsvApiSelectorForm from "./selector-form/CsvApiSelectorForm";



const CsvAndApiMapper = () => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')

    const [isDbSchemaChecked, setIsDbSchemaChecked] = useState(false);
    const [isQueryChecked, setIsQueryChecked] = useState(false);

    const handleMethodChange = (event) => {
        if(event.target.value=="dbschema") {
            setIsDbSchemaChecked(true)
            setIsQueryChecked(false)


        }else if(event.target.value=="query"){
            setIsQueryChecked(true)
            setIsDbSchemaChecked(false)

        }
    };

    const {data:sourceSystemData, isLoading:isSourceSystemLoading, error:sourceSystemError } = useGetFetchSourceSystemInfo()



    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography color="text.info" variant="h4">{baselookup} Mapping for {sourceSystemData.conn_type}
                            <ActiveSiteConfigInfo />  <SourceSystemInfo />
                        </Typography>
                    </Stack>
                </Grid>

                <Grid item xs={12}>
                    {!isSourceSystemLoading  && (
                            <CsvApiSelectorForm conn_type={sourceSystemData.conn_type}/>
                        )
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default CsvAndApiMapper;
