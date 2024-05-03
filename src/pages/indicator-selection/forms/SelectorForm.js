import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
    Typography, Select,MenuItem
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import databaseColumns  from '../json/databaseColumns';
import { API_URL } from '../../../constants';

import axios from "axios";


const SelectorForm = () => {

    const isSubmitting=false;

    const [databaseColumns, setdatabaseColumns] = useState({});
    const [tablenames, setTablenames] = useState(Object.keys(databaseColumns));
    const [columns, setColumns] = useState([]);
    const txcurrBaseIndicators = ['DOB','Sex',	'Patient Identifier',
        'Last Dispense Date',	'All Dispense Dates',	'Start ART Date',	'Next Appointment Date'
    ]
    const [formData, setFormData] = useState([]);

    const handleChange = (e, baseVariable, table, column) => {
        // formData.map(o =>{
        //     for (let i = formData.length - 1; i >= 0; i--) {
        //         if ([o].includes(formData[i])) {
        //             formData.splice(i, 1);
        //         }
        //     }
        // })
        // document.getElementById(baseVariable+'column.input').setAttribute("disabled", "disabled");
        console.log(baseVariable+'column input',document.getElementByName(baseVariable+'column'))

        formData.push({"indicator":'TX_CURR',"baseVariableMappedTo":baseVariable, "tablename":table, "columnname":column, "datatype":"string"})
        setFormData(formData)

    };

    const getDatabaseColumns = async() => {
        await axios.get(API_URL+"/indicator_selector/getDatabaseColumns").then(res => {
            setdatabaseColumns( res.data );
            setTablenames(Object.keys(res.data));
        });
    };

    const handleTableSelect = (tableSelected, basevariable) => {
        const variableObj = {};
        variableObj[tableSelected] = databaseColumns[tableSelected];
        setColumns(variableObj)

    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        console.log(formData);
        axios.post(API_URL+ "/indicator_selector/add_indicator_variables",  formData);

    };


    useEffect(() => {
        getDatabaseColumns()
    }, []);

    return (
        <>

                    <form noValidate onSubmit={handleSubmit}>
                        <p >TX_CURR</p>
                        <Grid container spacing={1}>
                            {
                                txcurrBaseIndicators.map(baseVariable => (
                                    <Grid container spacing={1}>
                                        <Grid item xs={4} md={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="base-variable">Baseline Variable</InputLabel>
                                                {/*{*/}
                                                {/*    txcurrBaseIndicators.map(baseVariable => (*/}
                                                <OutlinedInput
                                                    id="base-indicators-{{baseVariable}}"
                                                    value={baseVariable}
                                                    readonly
                                                    placeholder="John"
                                                    fullWidth
                                                />
                                                    {/*    )*/}
                                                    {/*)}*/}
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={4} md={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="tables">Tables</InputLabel>
                                                <Select
                                                    id={baseVariable+"table"}
                                                    fullWidth
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

                                        <Grid item xs={4} md={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="columns">Variable</InputLabel>
                                                <Select
                                                    name={baseVariable+"column"}
                                                    id={baseVariable+"column"}
                                                    placeholder="variable"
                                                    fullWidth
                                                    onChange={(e)=>{handleChange(e, baseVariable,Object.keys(columns)[0], e.target.value)}}
                                                >
                                                    { Object.keys(columns).length > 0 ?
                                                        columns[Object.keys(columns)[0]].map(column => (
                                                                <MenuItem value={column}>{column}</MenuItem>
                                                            )
                                                        ) : (
                                                            <MenuItem value=""></MenuItem>
                                                        )}
                                                </Select>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                )
                                )}


                            {/*<Grid item xs={12}>*/}
                            {/*    <Typography variant="body2">*/}
                            {/*        By Signing up, you agree to our &nbsp;*/}
                            {/*        <Link variant="subtitle2" component={RouterLink} to="#">*/}
                            {/*            Terms of Service*/}
                            {/*        </Link>*/}
                            {/*        &nbsp; and &nbsp;*/}
                            {/*        <Link variant="subtitle2" component={RouterLink} to="#">*/}
                            {/*            Privacy Policy*/}
                            {/*        </Link>*/}
                            {/*    </Typography>*/}
                            {/*</Grid>*/}
                            {/*{errors.submit && (*/}
                            {/*    <Grid item xs={12}>*/}
                            {/*        <FormHelperText error>{errors.submit}</FormHelperText>*/}
                            {/*    </Grid>*/}
                            {/*)}*/}
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
