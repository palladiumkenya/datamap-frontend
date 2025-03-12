import { useEffect, useState, useRef } from 'react';
// material-ui
import {Grid, Stack, Typography,Checkbox, FormControlLabel, RadioGroup, Radio} from '@mui/material';

// project import
import SelectorForm from "./selector-form/SelectorForm";
import ActiveSiteConfigInfo from "../configs/Site/ActiveSiteConfigInfo";
import SourceSystemInfo from "./source-system/SourceSystemInfo";



const Mapper = () => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')

    const [isDbSchemaChecked, setIsDbSchemaChecked] = useState(false);
    const [isQueryChecked, setIsQueryChecked] = useState(false);

    const handleMethodChange = (event) => {
        console.log("use what checked ", event.target.value)
        if(event.target.value=="dbschema") {
            setIsDbSchemaChecked(true)
            setIsQueryChecked(false)


        }else if(event.target.value=="query"){
            setIsQueryChecked(true)
            setIsDbSchemaChecked(false)

        }
    };




    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography color="text.info" variant="h4">{baselookup} Mapping
                            <ActiveSiteConfigInfo />  <SourceSystemInfo />
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={6}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>

                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group" onChange={handleMethodChange}
                        >
                            <FormControlLabel value="dbschema" control={<Radio id="useDbSchema"/>} label="Use Source DB Schema" />
                            <FormControlLabel value="query" control={<Radio id="useQuery" />} label="Use Custom Query" />
                        </RadioGroup>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    {
                        isDbSchemaChecked && (
                            <SelectorForm />
                        )
                    }
                    {
                        isQueryChecked && (
                            <p>under development</p>
                        )
                    }

                </Grid>
            </Grid>
        </>
    );
};

export default Mapper;
