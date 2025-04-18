import { useEffect, useState, useRef } from 'react';

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
    Stack,Alert, Chip, Tooltip,
    Typography, Select, MenuItem, Skeleton,TextField
} from '@mui/material';
import MainCard from 'components/MainCard';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import {ArrowRightOutlined, InfoCircleFilled , CheckCircleFilled} from '@ant-design/icons';
import SourceSystemInfo from "../source-system/SourceSystemInfo";

import {API_URL, FRONTEND_URL} from '../../../constants';
import { fetchBaseVariables, fetchSourceSystemTablesAndColumns } from '../../../store/mapper/queries';
import ActiveSiteConfigInfo from "../../configs/Site/ActiveSiteConfigInfo";
import {useDeleteSiteConfig} from "../../../store/site_configurations/mutations";
// import {useSaveMappings} from "../../../store/mapper/mutations";
import CircularProgress from "@mui/material/CircularProgress";
import TestCsvMappings  from "../test-mappings/TestCsvMappings";
import {fetchSourceCsvHeaders} from "../../../store/csv-api-mapper/queries";




const CsvApiSelectorForm = ({conn_type}) => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')
    const initialized = useRef(false);

    const [databaseColumns, setdatabaseColumns] = useState([]);
    const [tablenames, setTablenames] = useState(Object.keys(databaseColumns));
    const [baseRepoVariables, setBaseRepoVariables] = useState([])
    const [fetchedSourceTables, setFetchedSourceTables] = useState(null);

    const [warning, setWarning] = useState("")

    const allColumns = []
    baseRepoVariables.map(o =>{
        allColumns.push({"baseVariable":o,"tableSelected":"", "matchingTableColumns":[]});
    });

    const [columns, setColumns] = useState([]);
    const [primaryTableColumns, setPrimaryTableColumns] = useState([]);

    const [formData, setFormData] = useState([]);




    const getBaseVariables = async() => {
        const baseVariables = await fetchBaseVariables(baselookup);
        if (baseVariables) {
            setBaseRepoVariables(baseVariables);

            const allColumns = []
            baseVariables.map(o =>{
                allColumns.push({"baseVariable":o.term,"HeaderSelected":""});
                formData.push({
                    "base_repository": baselookup,
                    "base_variable_mapped_to": o.term,
                    "is_required": o.is_required,
                    "columnname": "",
                    "datatype": o.datatype
                })
                setFormData(formData)

            });

            setColumns(allColumns);
            console.log("basevariables formData",formData)
        }
    };


    const getDatabaseColumns = async() => {
        const res = await fetchSourceCsvHeaders(conn_type);
        if (res){
            setdatabaseColumns(res);
            setFetchedSourceTables(true);
        }
        console.log("databaseColumns", databaseColumns)

    };

    const handleHeaderSelect = (csvHeaderSelected, basevariable) => {

        const mappingExists = formData.find(item => item.base_variable_mapped_to.toLowerCase() == basevariable.toLowerCase());
        if (mappingExists){
            mappingExists.tablename = "-";
            mappingExists.columnname = csvHeaderSelected;
            mappingExists.join_by = "-";
        }
        setFormData(formData)

    };

    const columnMappedQualityCheck = (baseVariable, columnSelected, columnSelectedDatatype)=> {
        const myElement = document.getElementById(baseVariable.term+"columnWarning");

        const stringTypes = ["VARCHAR","NVARCHAR","CHAR", "TEXT"]
        const numberTypes = ["INT","INTEGER","BIGINT","SMALLINT", "FLOAT"]
        const dateTypes = ["DATE","DATETIME","DATETIME2"]

        if(stringTypes.some(substring => baseVariable.datatype.toLowerCase().includes(substring.toLowerCase())) &&
            stringTypes.some(substring => columnSelectedDatatype.toLowerCase().includes(substring.toLowerCase()))) {
            myElement.textContent  ="";
        }
        else if( numberTypes.some(substring => baseVariable.datatype.toLowerCase().includes(substring.toLowerCase())) &&
            numberTypes.some(substring => columnSelectedDatatype.toLowerCase().includes(substring.toLowerCase()))) {
            myElement.textContent  ="";
        }
        else if( dateTypes.some(substring => baseVariable.datatype.toLowerCase().includes(substring.toLowerCase())) &&
            dateTypes.some(substring => columnSelectedDatatype.toLowerCase().includes(substring.toLowerCase()))) {
            myElement.textContent  ="";
        }
        else{
            if (myElement) {
                // Perform DOM manipulations or mapper
                myElement.textContent  = `* Expected Datatype for variable mapped to ${baseVariable.term} should be
                 ${baseVariable.datatype} or similar to it.  ${columnSelected} has datatype ${columnSelectedDatatype}`;
            }
        }

    };









    useEffect(() => {
        if (!initialized.current) {
            getBaseVariables();
            initialized.current = true;
        }
        getDatabaseColumns();

    }, []);

    return (
        <>
            { fetchedSourceTables == false &&
                <Alert color="error" icon={<InfoCircleFilled  />}>
                    An error has occurred: Check your source DB/API connection in the Configurations page and make
                    sure you can connect to it and then restart the application. You cannot map unless the Source system is correctly configured
                </Alert>
            }
                    <form noValidate >

                        <Divider sx={{marginBottom:"20px"}}/>
                        <Grid container spacing={1}>
                            <Grid container spacing={1} sx={{marginBottom:"20px"}}>
                                <Grid item xs={2} md={2}>Baseline Variable</Grid>
                                <Grid item xs={1} md={1}></Grid>
                                <Grid item xs={3} md={3}>Source Header</Grid>
                            </Grid>

                            { baseRepoVariables.length>0 ?
                                baseRepoVariables.map(baseVariable => (
                                    <MainCard border={true} boxShadow   sx={{ width: '100%', marginBottom:'10px' }}>

                                        <Grid container spacing={1} sx={{marginBottom:"20px"}}>
                                            <Grid item xs={2} md={2}>
                                                <Stack spacing={1}>
                                                    <Tooltip title={baseVariable.is_required ? baseVariable.term + "(*Mandatory)" : baseVariable.term}>

                                                    <TextField
                                                        id="base-indicators-{{baseVariable.term}}"
                                                        value={baseVariable.is_required ? "*"+baseVariable.term : baseVariable.term }
                                                        readonly
                                                        placeholder="BaseVariable"
                                                        fullWidth
                                                        size="small" required
                                                        sx={{ backgroundColor:'white' }}
                                                    />
                                                    </Tooltip>

                                                </Stack>
                                            </Grid>

                                            <Grid item xs={1} md={1}>
                                                <Stack spacing={1} style={{"alignItems": "center"}}>
                                                    <ArrowRightOutlined style={{"alignItems": "center"}}/>
                                                </Stack>
                                            </Grid>

                                            <Grid item xs={3} md={3}>
                                                <Stack spacing={1}>
                                                    {/*<InputLabel htmlFor="tables">Source Table</InputLabel>*/}
                                                    <Select
                                                        id={baseVariable.term+"table"}
                                                        fullWidth
                                                        size="small" required
                                                        sx={{ backgroundColor:'#e6f7ff', borderRadius: '20px', border:'1px #40a9ff solid' }}
                                                        onChange={(e)=>{handleHeaderSelect(e.target.value, baseVariable.term)}}
                                                    >
                                                        {
                                                            databaseColumns.map(csvHeader => (
                                                            <MenuItem value={csvHeader}>{csvHeader}</MenuItem>
                                                                )
                                                            )}
                                                    </Select>
                                                </Stack>
                                            </Grid>

                                        </Grid>
                                    </MainCard>
                                ) )
                                :
                                (
                                    <div>
                                        <Skeleton variant="rectangular" width={600} height={100} />
                                        <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

                                        <Skeleton variant="rectangular" width={600} height={100} />
                                        <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

                                        <Skeleton variant="rectangular" width={600} height={100} />
                                        <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>

                                        <Skeleton variant="rectangular" width={600} height={100} />
                                        <Grid item xs={6}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></Grid>


                                    </div>
                                )}

                            {fetchedSourceTables &&
                                <>
                                    <TestCsvMappings formData={formData} baselookup={baselookup} conn_type={conn_type}/>
                                </>
                            }
                        </Grid>
                    </form>

        </>
    );
};

export default CsvApiSelectorForm;
