import { useEffect, useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Alert,
    Chip,
    Typography,
    Select,
    MenuItem,
    Skeleton,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tooltip,
    TableContainer
} from '@mui/material';
import MainCard from 'components/MainCard';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import {API_URL, FRONTEND_URL} from '../../../constants';
import {useSaveMappings} from "../../../store/data-transmission/mutations";
import {useTestMappings} from "../../../store/mapper/mutations";
import {Link as RouterLink} from "react-router-dom";
import {WarningFilled} from "@ant-design/icons";
import CircularProgress from "@mui/material/CircularProgress";




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
const TestMappings = ({formData, baselookup}) => {
    const [spinner, setSpinner] = useState(null);
    const [testingSpinner, setTestingSpinner] = useState(null);

    const [alertType, setAlertType] = useState(null);
    const [submitMessage, setSubmitMessage] = useState(null);
    const [disableSave, setDisableSave] = useState(true);

    const isSubmitting=false;
    const testMappingsData = useTestMappings();

    const testVariableMappings = async () => {
        setTestingSpinner(true)
        setDisableSave(true)

        testMappingsData.mutate({baselookup,formData})

        if (testMappingsData.isError) {
            setSpinner(false);
            setAlertType("error");
            setSubmitMessage("Error testing mappings ");

        }
        if (testMappingsData.isSuccess){
            setDisableSave(false)
        }
    };




    return (
        <Grid container spacing={1} sx={{marginBottom:"100px"}}>

            <Grid item xs={2}>
                <AnimateButton>
                    <Button disableElevation disabled={disableSave} fullWidth size="medium" type="submit" variant="contained" color="primary">
                        Save
                        {spinner &&
                            <CircularProgress style={{"color":"black","marginLeft":"10px"}} size="1rem"/>
                        }
                    </Button>

                </AnimateButton>
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

            { testMappingsData?.data &&
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
                        { testMappingsData?.data.map((row, index) => {
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

export default TestMappings;
