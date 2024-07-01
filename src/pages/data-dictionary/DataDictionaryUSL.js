import {Box, Button, Grid, Typography} from "@mui/material";
import MainCard from "../../components/MainCard";
import * as React from "react";
import DataDictionaryNew from "./DataDictionaryNew";
import {useNavigate} from "react-router-dom";
import DataDictionaryListUSL from "./DataDictionaryListUSL";


const DataDictionary = () => {

    return (
        <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="center" justifyContent="space-between">
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography  variant="h5">USL Data Dictionaries</Typography>
                        </Grid>
                        <Grid item>
                            {/*<Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} >*/}
                            {/*    Download Configurations From MarketPlace*/}
                            {/*</Button>*/}
                            {/*{'\t'}*/}
                            {/*<Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }} disabled={true} color={`success`}>*/}
                            {/*    Upload Configurations From MarketPlace*/}
                            {/*</Button>*/}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <DataDictionaryNew />
                    <MainCard sx={{ mt: 2 }} content={false}>
                        <DataDictionaryListUSL />
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    )
}

export default DataDictionary