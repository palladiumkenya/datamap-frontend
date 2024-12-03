import {Box, Button, Grid, Typography} from "@mui/material";
import MainCard from "../../../components/MainCard";
import * as React from "react";
import DataDictionaryNew from "./DataDictionaryNew";
import DataDictionaryListUSL from "./DataDictionaryListUSL";
import UniversalDictionaryTabs from "./UniversalDictionaryTabs";


const DataDictionary = () => {

    return (
        <Box sx={{ width: '100%' }}>
            <UniversalDictionaryTabs />
        </Box>
    )
}

export default DataDictionary
