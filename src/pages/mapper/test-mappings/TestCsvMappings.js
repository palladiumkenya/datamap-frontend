import { useEffect, useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Grid,
    Alert,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer
} from '@mui/material';
import MainCard from 'components/MainCard';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import {API_URL, FRONTEND_URL} from '../../../constants';

import {InfoCircleFilled, WarningFilled} from "@ant-design/icons";
import CircularProgress from "@mui/material/CircularProgress";
import {useSaveCsvMappings, useTestCsvMappings} from "../../../store/csv-api-mapper/mutations";




const headCells = [
    {
        id: 'base_variable',
        align: 'left',
        disablePadding: true,
        label: 'Base Variable'
    },
    {
        id: 'column_mapped',
        align: 'left',
        disablePadding: false,
        label: 'Column With Issue'
    },
    {
        id: 'issue',
        align: 'left',
        disablePadding: false,
        label: 'Issue'
    },
    {
        id: 'recommended_solution',
        align: 'left',
        disablePadding: false,
        label: 'Recommended Solution'
    }
];
const TestCsvMappings = ({formData, baselookup, conn_type}) => {
    const [spinner, setSpinner] = useState(null);
    const [testingSpinner, setTestingSpinner] = useState(null);

    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [disableSave, setDisableSave] = useState(true);
    const [querySaved, setQuerySaved] = useState(true);
    const [issuesList, setIssuesList] = useState(null);

    const isSubmitting=false;
    const testMappingsData = useTestCsvMappings();
    const saveMappings = useSaveCsvMappings();

    const testVariableMappings = async () => {
        const missingMapping = formData.find(item => item.is_required == true &&  item.columnname == "");

        if (missingMapping === undefined) {
            setTestingSpinner(true)
            setDisableSave(true)

            const testingResponse = await testMappingsData.mutateAsync({baselookup, formData, conn_type})

            if (testingResponse?.status_code == 200) {
                // if (testingResponse && testingResponse?.length == 0) {
                setQuerySaved(false)

                if (Array.isArray(testingResponse?.data) && testingResponse?.data.length > 0) {
                    setIssuesList(testingResponse?.data)

                    setDisableSave(true)
                    setTestingSpinner(false)
                    setAlertType("error");
                    setAlertMessage("Issues with mappings found");
                }else{
                    setIssuesList(null)

                    setDisableSave(false)
                    setTestingSpinner(false)
                    setAlertType("success");
                    setAlertMessage("No data issues found with mappings");
                }
                // }
            } else {
                setSpinner(false);
                setTestingSpinner(false)

                setAlertType("error");
                setAlertMessage("Error testing mappings ");
                console.log(testingResponse)

            }
        }else{
            setAlertType("error");
            setAlertMessage("Error testing mappings. Missing mappings. Add mappings to the required base variables " +
                "prefixed by * such as *"+missingMapping.base_variable_mapped_to);
        }

    };

    const handleSubmit = async () => {
        setSpinner(true);

        const saveResponse = await saveMappings.mutateAsync({baselookup,formData, conn_type})

        console.log("saveResponse",saveResponse)
        if (saveResponse?.status_code == 200) {
            setDisableSave(false)
            setSpinner(false);
            setAlertType("success");
            setAlertMessage(saveResponse?.data);

            setQuerySaved(true)
        } else {
            setSpinner(false);
            setTestingSpinner(false)

            setAlertType("error");
            setAlertMessage("Error saving mappings, ERROR --> "+saveResponse?.data);

        }



    };




    return (
        <Grid container spacing={1} sx={{marginBottom:"100px"}}>

            <Grid item xs={2}>
                { !querySaved ? (
                    <AnimateButton>
                        <Button disableElevation disabled={disableSave} fullWidth size="medium" type="button" variant="contained"
                                color="primary" onClick={()=>handleSubmit()}>
                            Save
                            {spinner &&
                                <CircularProgress style={{"color":"black","marginLeft":"10px"}} size="1rem"/>
                            }
                        </Button>
                    </AnimateButton>
                    ):(
                    <AnimateButton>
                        <Button disableElevation disabled={disableSave} fullWidth size="medium" type="button" variant="contained"
                                color="success" onClick={() => window.location.href = `${FRONTEND_URL}/schema/config?baselookup=${baselookup}`}>
                            Finish
                        </Button>
                    </AnimateButton>
                )}
            </Grid>
            <Grid item xs={2}>
                <AnimateButton>
                    <Button disableElevation disabled={isSubmitting} fullWidth size="medium" type="button"
                            variant="contained" color="error" onClick={()=>testVariableMappings()}>
                        Test Mappings
                        {testingSpinner &&
                            <CircularProgress style={{"color":"black","marginLeft":"10px"}} size="1rem"/>
                        }
                    </Button>
                </AnimateButton>
            </Grid>

            {alertMessage &&
                <Alert color={alertType} icon={<InfoCircleFilled  />}>
                    {alertMessage}
                </Alert>
            }

            { issuesList && issuesList.length>0 &&
                <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}
                >
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={headCell.align}
                                    padding={headCell.disablePadding ? 'none' : 'normal'}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { issuesList.length>0 && issuesList.map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    tabIndex={-1}
                                    key={row.site_name}
                                >
                                    <TableCell component="th" id={labelId} scope="row" align="left"> {row.base_variable}
                                    </TableCell>
                                    <TableCell align="left">{row.column_mapped}</TableCell>
                                    <TableCell align="left" sx={{ color: 'error.main' }}><WarningFilled />{row.issue}</TableCell>
                                    <TableCell align="left" sx={{ color: 'primary.main' }}>{row.recommended_solution}</TableCell>
                                    <TableCell align="right">

                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            }
        </Grid>
    );
};

export default TestCsvMappings;
