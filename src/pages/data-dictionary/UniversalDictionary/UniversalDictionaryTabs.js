import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Box, Grid, Tab, Typography} from "@mui/material";
import * as React from "react";
import DataDictionaryListUSL from "./DataDictionaryListUSL";
import MainCard from "../../../components/MainCard";
import DataDictionaryNew from "./DataDictionaryNew";
import UniversalDictionaryAccessTokens from "./UniversalDictionaryAccessTokens/UniversalDictionaryAccessTokens";
import UniversalDictionaryFacilityMetrics
    from "./UniversalDictionaryFacilityMetrics/UniversalDictionaryFacilityMetrics";

const UniversalDictionaryTabs = () => {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return(
        <>
            <Box sx={{ width: '100%' }}>
                <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="center" justifyContent="space-between">
                    <Grid item xs={12}>
                        <MainCard sx={{ mt: 2 }} content={true}>
                            <TabContext value={value}>
                                <TabList
                                    value={value}
                                    onChange={handleChange}
                                    variant="scrollable"
                                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                                >
                                    <Tab label="Universal Data Dictionary" value={"1"} />
                                    <Tab label="Universal Dictionary Access Tokens" value={"2"} />
                                    <Tab label="Universal Dictionary Metrics" value={"3"} />
                                </TabList>
                                <TabPanel value="1">
                                    <Grid container rowSpacing={4.5} columnSpacing={2.75} alignItems="center" justifyContent="space-between">
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between">
                                                <Grid item>
                                                    <Typography  variant="h5">Universal Data Dictionaries</Typography>
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
                                </TabPanel>
                                <TabPanel value="2">
                                    <UniversalDictionaryAccessTokens />
                                </TabPanel>
                                <TabPanel value="3">
                                    <UniversalDictionaryFacilityMetrics />
                                </TabPanel>
                            </TabContext>
                        </MainCard>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default UniversalDictionaryTabs
