import * as React from 'react';
import {
    Box,
    Typography,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Collapse, Checkbox, FormControlLabel, List, ListItem
} from "@mui/material";
import {useState} from "react";
import {
    useGetDataDictionariesUSL,
    useGetUniversalDataDictionaryMetrics
} from "../../../../store/data-dictionary/queries";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";


function Row(props) {
    const { row } = props;
    const {repos} = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.facility_mfl_code}
                </TableCell>
                <TableCell>{row.date_last_updated}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Universal Dictionary Versions
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dictionary</TableCell>
                                        <TableCell align="right">Facility Version</TableCell>
                                        <TableCell align="right">Latest Version</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.dictionary_versions.map((version, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {version.name}
                                            </TableCell>
                                            <TableCell align="right">{version.version}</TableCell>
                                            <TableCell align="right">
                                                {repos.find((repo) => repo.name === version.name)?.version_number ?? 'DELETED'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


const UniversalDictionaryFacilityMetrics = () => {
    const {data, isLoading} = useGetUniversalDataDictionaryMetrics()
    const {isLoading: isLoadingDict, data: repos} = useGetDataDictionariesUSL();
    const [showOutdated, setShowOutdated] = useState(false);

    if(isLoading || isLoadingDict)
        return (<></>)

    const isOutdated = (row) => {
        return row.dictionary_versions.some(version => {
            const latestVersion = repos.find(repo => repo.name == version.name)?.version_number;
            return latestVersion && version.version < latestVersion;
        });
    };

    const filteredData = showOutdated ? data.filter(isOutdated) : data;

    return (
        <Box sx={{ width: '100%' }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showOutdated}
                        onChange={() => setShowOutdated(!showOutdated)}
                        name="showOutdated"
                        color="primary"
                    />
                }
                label="Show only facilities with outdated dictionaries"
            />

            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Facility MFLCode</TableCell>
                            <TableCell>Date Last Updated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row) => (
                            <Row key={row.facility_mfl_code} row={row} repos={repos} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default UniversalDictionaryFacilityMetrics
