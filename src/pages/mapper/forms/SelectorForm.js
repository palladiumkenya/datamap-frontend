import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Link as RouterLink } from 'react-router-dom';
import $ from 'jquery';
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
    Typography, Select, MenuItem, Skeleton,TextField
} from '@mui/material';
import MainCard from 'components/MainCard';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import {ArrowRightOutlined, CheckCircleFilled} from '@ant-design/icons';

import { API_URL } from '../../../constants';

import axios from "axios";



const SelectorForm = () => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')


    const isSubmitting=false;

    const [databaseColumns, setdatabaseColumns] = useState({});
    const [tablenames, setTablenames] = useState(Object.keys(databaseColumns));
    const [baseIndicators, setBaseIndicators] = useState([])

    const allColumns = []
    baseIndicators.map(o =>{
        allColumns.push({"baseVariable":o,"tableSelected":"", "matchingTableColumns":[]});
    });

    const [columns, setColumns] = useState([]);
    const [primaryTableColumns, setPrimaryTableColumns] = useState([]);

    const [formData, setFormData] = useState([]);




    const getBaseVariables = async() => {
        await axios.get(API_URL+"/dictionary_mapper/base_variables/"+baselookup).then(res => {
            setBaseIndicators(res.data);

            const allColumns = []
            res.data.map(o =>{
                allColumns.push({"baseVariable":o,"tableSelected":"", "matchingTableColumns":[]});
            });

            setColumns(allColumns);
        });
    };

    const handleColumnChange = (e, baseVariable, table, join_by) => {
        const filteredData = columns.filter(item => item.baseVariable === baseVariable);
        const selectIdentifier = baseVariable+"column";
        const column = document.getElementsByName(selectIdentifier)[0].value;
        formData.push({"base_repository":baselookup,"base_variable_mapped_to":baseVariable, "tablename":filteredData[0].tableSelected,
            "columnname":column, "join_by":join_by, "datatype":"string"})
        setFormData(formData)
        console.log(formData)

    };

    const getDatabaseColumns = async() => {
        await axios.get(API_URL+"/dictionary_mapper/getDatabaseColumns").then(res => {
            setdatabaseColumns(res.data);
            setTablenames(Object.keys(res.data));

        });
    };

    const handleTableSelect = (tableSelected, basevariable) => {
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



    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        console.log(formData);
        axios.post(API_URL+ "/dictionary_mapper/add_mapped_variables",  formData).then(res => {
            window.location.href = `http://localhost:3000/schema/config?baselookup=` + baselookup;
        })
        // window.location.href = `http://localhost:3000/schema/config?baselookup=`+baselookup;

    };


    useEffect(() => {
        getBaseVariables();
        getDatabaseColumns();

    }, []);

    return (
        <>

                    <form noValidate onSubmit={handleSubmit}>
                        <Typography color="text.info" variant="h4">{baselookup} Mapping</Typography>
                        <Divider sx={{marginBottom:"20px"}}/>
                        <Grid container spacing={1}>
                            <Grid container spacing={1} sx={{marginBottom:"20px"}}>
                                <Grid item xs={3} md={3}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="base-variable">Primary Table</InputLabel>
                                        <Select
                                            id={"PrimaryTable"}
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
                                            onChange={(e)=>{}}
                                        >
                                            { primaryTableColumns.map(variable => ( <MenuItem value={variable}>{variable}</MenuItem>))
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

                            { baseIndicators.length>0 ?
                                baseIndicators.map(baseVariable => (
                                    <MainCard border={true} boxShadow   sx={{ width: '100%', marginBottom:'10px' }}>

                                        <Grid container spacing={1} sx={{marginBottom:"20px"}}>
                                            <Grid item xs={2} md={2}>
                                                <Stack spacing={1}>
                                                    {/*<InputLabel htmlFor="base-variable">Baseline Variable</InputLabel>*/}
                                                    {/*<Typography>{baseVariable}</Typography>*/}
                                                    <TextField
                                                        id="base-indicators-{{baseVariable}}"
                                                        value={baseVariable}
                                                        readonly
                                                        placeholder="BaseVariable"
                                                        fullWidth
                                                        // helperText="Variable Description and expected value"
                                                        size="small"
                                                        sx={{ backgroundColor:'white' }}
                                                    />

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
                                                        id={baseVariable+"table"}
                                                        fullWidth
                                                        size="small"
                                                        sx={{ backgroundColor:'#e6f7ff', borderRadius: '20px', border:'1px #40a9ff solid' }}
                                                        onChange={(e)=>{handleTableSelect(e.target.value, baseVariable)}}
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
                                                    {/*<InputLabel htmlFor="columns">Variable</InputLabel>*/}
                                                    <Select
                                                        name={baseVariable+"column"}
                                                        id={baseVariable+"column"}
                                                        placeholder="variable"
                                                        fullWidth
                                                        size="small"
                                                        sx={{ backgroundColor:'#e6f7ff', borderRadius: '20px', border:'1px #40a9ff solid' }}
                                                        // onChange={(e)=>{handleColumnChange(e, baseVariable,Object.keys(columns)[0], e.target.value)}}
                                                    >
                                                        { columns.filter(item => item.baseVariable === baseVariable)
                                                            .map(columnList => ( columnList.matchingTableColumns.map(variable => ( <MenuItem value={variable}>{variable}</MenuItem>))))
                                                        }
                                                    </Select>
                                                </Stack>
                                            </Grid>

                                            <Grid item xs={2} md={2}>
                                                <Stack spacing={1}>
                                                    {/*<InputLabel htmlFor="JoinColumn">Join Primary Table By</InputLabel>*/}
                                                    <Select
                                                        name={baseVariable+"JoinColumn"}
                                                        id={baseVariable+"JoinColumn"}
                                                        placeholder="JOIN"
                                                        fullWidth
                                                        size="small"
                                                        sx={{ backgroundColor:'#e6f7ff', borderRadius: '20px', border:'1px #40a9ff solid' }}
                                                        onChange={(e)=>{handleColumnChange(e, baseVariable,Object.keys(columns)[0], e.target.value)}}
                                                    >
                                                        { columns.filter(item => item.baseVariable === baseVariable)
                                                            .map(columnList => ( columnList.matchingTableColumns.map(variable => ( <MenuItem value={variable}>{variable}</MenuItem>))))
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


                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                                Save
                                    </Button>
                                </AnimateButton>
                            </Grid>

                        </Grid>
                    </form>

        </>
    );
};

export default SelectorForm;
