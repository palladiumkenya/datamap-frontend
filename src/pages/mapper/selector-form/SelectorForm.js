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
import TestMappings from "../test-mappings/TestMappings";




const SelectorForm = () => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')
    const initialized = useRef(false);

    const isSubmitting=false;
    const [submitMessage, setSubmitMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [spinner, setSpinner] = useState(null);

    const [databaseColumns, setdatabaseColumns] = useState({});
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
                allColumns.push({"baseVariable":o.term,"tableSelected":"", "matchingTableColumns":[]});
                formData.push({
                    "base_repository": baselookup,
                    "base_variable_mapped_to": o.term,
                    "is_required": o.is_required,
                    "tablename": "",
                    "columnname": "",
                    "join_by": "",
                    "datatype": o.datatype
                })
                setFormData(formData)

            });

            setColumns(allColumns);
            console.log("basevariables formData",formData)
        }
    };

    const handleColumnChange = (e, baseVariable, table, join_by) => {
        const filteredData = columns.filter(item => item.baseVariable === baseVariable);
        const selectIdentifier = baseVariable+"column";
        const column = document.getElementsByName(selectIdentifier)[0].value;

        // if item in list, filter it out and update the current value picked
        const mappingExists = formData.find(item => item.base_variable_mapped_to == baseVariable);
        if (mappingExists){
            mappingExists.tablename = filteredData[0].tableSelected;
            mappingExists.columnname = column;
            mappingExists.join_by = join_by;
        }else {
            formData.push({
                "base_repository": baselookup,
                "base_variable_mapped_to": baseVariable,
                "is_required": baseVariable,
                "tablename": filteredData[0].tableSelected,
                "columnname": column,
                "join_by": join_by,
                "datatype": "string"
            })
            setFormData(formData)
        }

    };

    const getDatabaseColumns = async() => {
        const res = await fetchSourceSystemTablesAndColumns();
        if (res){
            setdatabaseColumns(res);
            setTablenames(Object.keys(res));
            setFetchedSourceTables(true);
        }

    };

    const handleTableSelect = (tableSelected, basevariable) => {
        //clear any selected data for base variable
        // document.getElementById(basevariable+"column").value = "";
        // document.getElementById(basevariable+"JoinColumn").value = "";
        // console.log("columns  -->", columns)
        const variableObj = {};
        variableObj[tableSelected] = databaseColumns[tableSelected];
        variableObj["baseVariable"] = basevariable;

        const updateColumns = columns.filter((item) => item["baseVariable"] === basevariable);

        updateColumns[0]["matchingTableColumns"] = databaseColumns[tableSelected];
        updateColumns[0]["tableSelected"] = tableSelected;

        const updatedList = columns.map(item => {
            if (item["baseVariable"] === basevariable) {

                return { ...item, matchingTableColumns: databaseColumns[tableSelected],tableSelected:tableSelected }; // Update category for 'Banana'
            }
            return item; // Return unchanged item for other objects
        });
        setColumns(updatedList)

    };

    const handlePrimaryTableIdSelect = (uniqueId) => {
        // const filteredData = columns.filter(item => item.baseVariable === baseVariable);

        const table = document.getElementsByName('PrimaryTable')[0].value;

        formData.push({"base_repository":baselookup,"base_variable_mapped_to":'PrimaryTableId', "tablename":table,
            "columnname":uniqueId, "join_by":"-", "datatype":"string"})
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
        // const table = document.getElementsByName('PrimaryTable')[0].value;
        //
        // formData.push({"base_repository":baselookup,"base_variable_mapped_to":'PrimaryTableId', "tablename":table,
        //     "columnname":uniqueId, "join_by":"-", "datatype":"string"})
        // setFormData(formData)
        // console.log(formData)

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
            { !fetchedSourceTables &&
                <Alert color="error" icon={<InfoCircleFilled  />}>
                    An error has occurred: Check your source DB/API connection in the Configurations page and make
                    sure you can connect to it and then restart the application. You cannot map unless the Source system is correctly configured
                </Alert>
            }
                    <form noValidate >
                        <Typography color="text.info" variant="h4">{baselookup} Mapping
                            <ActiveSiteConfigInfo />  <SourceSystemInfo />
                        </Typography>
                        <Divider sx={{marginBottom:"20px"}}/>
                        <Grid container spacing={1}>
                            <Grid container spacing={1} sx={{marginBottom:"20px"}}>
                                <Grid item xs={3} md={3}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="base-variable">Primary Table</InputLabel>
                                        <Select
                                            id={"PrimaryTable"}
                                            name={"PrimaryTable"}
                                            fullWidth
                                            size="small"
                                            onChange={(e)=>{ setPrimaryTableColumns(databaseColumns[e.target.value])}}
                                        >
                                            {
                                                tablenames.map(table => (
                                                        <MenuItem value={table}>{table}</MenuItem>
                                                    )
                                                )}
                                        </Select>
                                    </Stack>
                                </Grid>
                                <Grid item xs={3} md={3}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="base-variable">Unique Identifier</InputLabel>
                                        <Select
                                            name={"UniqueIdentifier"}
                                            id={"UniqueIdentifier"}
                                            placeholder="variable"
                                            fullWidth
                                            size="small"
                                            onChange={(e)=>{handlePrimaryTableIdSelect(e.target.value)}}
                                        >
                                            { primaryTableColumns.map(variable => ( <MenuItem value={variable.name}>{variable.name} : {variable.type}</MenuItem>))
                                            }
                                        </Select>

                                    </Stack>
                                </Grid>
                            </Grid>
                            <Typography>Secondary Tables</Typography>
                            <Grid container spacing={1} sx={{marginBottom:"20px"}}>
                                <Grid item xs={2} md={2}>Baseline Variable</Grid>
                                <Grid item xs={1} md={1}></Grid>
                                <Grid item xs={3} md={3}>Source Table</Grid>
                                <Grid item xs={3} md={3}>Variable Mapped</Grid>
                                <Grid item xs={3} md={3}>JOIN Primary table By</Grid>
                            </Grid>

                            { baseRepoVariables.length>0 ?
                                baseRepoVariables.map(baseVariable => (
                                    <MainCard border={true} boxShadow   sx={{ width: '100%', marginBottom:'10px' }}>

                                        <Grid container spacing={1} sx={{marginBottom:"20px"}}>
                                            <Grid item xs={2} md={2}>
                                                <Stack spacing={1}>
                                                    {/*<InputLabel htmlFor="base-variable">Baseline Variable</InputLabel>*/}
                                                    {/*<Typography>{baseVariable}</Typography>*/}
                                                    <Tooltip title={baseVariable.is_required ? baseVariable.term + "(*Mandatory)" : baseVariable.term}>

                                                    <TextField
                                                        id="base-indicators-{{baseVariable.term}}"
                                                        value={baseVariable.is_required ? "*"+baseVariable.term : baseVariable.term }
                                                        readonly
                                                        placeholder="BaseVariable"
                                                        fullWidth
                                                        // helperText="Variable Description and expected value"
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
                                                        onChange={(e)=>{handleTableSelect(e.target.value, baseVariable.term)}}
                                                    >
                                                        {
                                                            tablenames.map(table => (
                                                            <MenuItem value={table}>{table}</MenuItem>
                                                                )
                                                            )}
                                                    </Select>
                                                </Stack>
                                            </Grid>

                                            <Grid item xs={3} md={3}>
                                                <Stack spacing={1}>

                                                    <Select
                                                        name={baseVariable.term+"column"}
                                                        id={baseVariable.term+"column"}
                                                        placeholder="variable"
                                                        fullWidth
                                                        size="small" required
                                                        sx={{ backgroundColor:'#e6f7ff', borderRadius: '20px', border:'1px #40a9ff solid' }}
                                                        required={baseVariable.is_required}
                                                    >
                                                        { columns.filter(item => item.baseVariable === baseVariable.term)
                                                            .map(columnList => ( columnList.matchingTableColumns.map(variable => (
                                                                <MenuItem value={variable.name} onClick={() => columnMappedQualityCheck(baseVariable, variable.name, variable.type)}>{variable.name}</MenuItem>))
                                                            ))
                                                        }
                                                    </Select>
                                                    <p  style={{"color":"red","font-size":"9px"}} id={baseVariable.term+"columnWarning"}></p>
                                                </Stack>
                                            </Grid>

                                            <Grid item xs={2} md={2}>
                                                <Stack spacing={1}>
                                                    {/*<InputLabel htmlFor="JoinColumn">Join Primary Table By</InputLabel>*/}
                                                    <Select
                                                        name={baseVariable.term+"JoinColumn"}
                                                        id={baseVariable.term+"JoinColumn"}
                                                        placeholder="JOIN"
                                                        fullWidth
                                                        size="small" required
                                                        sx={{ backgroundColor:'#e6f7ff', borderRadius: '20px', border:'1px #40a9ff solid' }}
                                                        onChange={(e)=>{handleColumnChange(e, baseVariable.term,Object.keys(columns)[0], e.target.value)}}
                                                    >
                                                        { columns.filter(item => item.baseVariable === baseVariable.term)
                                                            .map(columnList => ( columnList.matchingTableColumns.map(variable => ( <MenuItem value={variable.name}>{variable.name}</MenuItem>))))
                                                        }
                                                    </Select>
                                                </Stack>
                                            </Grid>
                                            {/*<Grid item xs={1} md={1}>*/}
                                            {/*    <IconButton variant="outlined" color="success" style={{"marginTop": "35px"}} id={baseVariable+"Mapped"}>*/}
                                            {/*        <CheckCircleFilled />*/}
                                            {/*    </IconButton>*/}
                                            {/*</Grid>*/}
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
                                {/*<Grid item xs={4}>*/}
                                {/*    <AnimateButton>*/}
                                {/*        <Button disableElevation disabled={isSubmitting} fullWidth size="medium" type="submit" variant="contained" color="primary">*/}
                                {/*                    Save*/}
                                {/*        </Button>*/}
                                {/*        {spinner ?*/}
                                {/*            <CircularProgress style={{"color":"black"}} size="1rem"/>*/}
                                {/*            :*/}
                                {/*            <></>*/}
                                {/*        }*/}
                                {/*    </AnimateButton>*/}
                                {/*</Grid>*/}
                                {/*    <Grid item xs={12}>*/}
                                        <TestMappings formData={formData} baselookup={baselookup}/>

                                    {/*</Grid>*/}
                                </>
                            }
                        </Grid>
                    </form>

        </>
    );
};

export default SelectorForm;
