import { useEffect, useState, useRef } from 'react';

// material-ui
import {
    Button,
    Divider,
    Grid, Alert, Chip, Tooltip,
    Typography, Select, MenuItem, Skeleton,TextField
} from '@mui/material';
import { styled } from '@mui/system';

import MainCard from 'components/MainCard';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import {ArrowRightOutlined, InfoCircleFilled, CheckCircleFilled, CloseCircleFilled} from '@ant-design/icons';
import SourceSystemInfo from "../source-system/SourceSystemInfo";

import {API_URL, FRONTEND_URL} from '../../../constants';
import { fetchBaseVariables, fetchSourceSystemTablesAndColumns, fetchMappedBaseVariables } from '../../../store/mapper/queries';
import ActiveSiteConfigInfo from "../../configs/Site/ActiveSiteConfigInfo";
import {useDeleteSiteConfig} from "../../../store/site_configurations/mutations";
// import {useSaveMappings} from "../../../store/mapper/mutations";
import CircularProgress from "@mui/material/CircularProgress";
import TestQueryMappings  from "../test-mappings/TestQueryMappings";




const AddQuerySelectorForm = () => {
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
    const [checkMapped, setCheckMapped] = useState([]);




    const getBaseVariables = async() => {
        const baseVariables = await fetchBaseVariables(baselookup);
        if (baseVariables) {
            setBaseRepoVariables(baseVariables);

            const allColumns = []
            const initialVariables = []
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
                initialVariables.push({"variable":o.term,"matched":false});

            });

            setColumns(allColumns);
            setCheckMapped(initialVariables)
        }
    };



    const SqlEditorTextField = styled(TextField)({
        fontFamily: "monospace",
        backgroundColor: "darkslategray", // Dark theme like SQL editors
        color: "#d4d4d4", // Light gray text
        borderRadius: "5px",
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#555",
            },
            "&:hover fieldset": {
                borderColor: "#888",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#4CAF50", // Green focus border like SQL editors
            },
        },
        "& .MuiInputBase-input": {
            fontSize: "14px",
            fontFamily: "monospace",
            lineHeight: "1.5",
            minWidth: "600px", // Resemble a query editor box
            maxHeight: "200px", // Resemble a query editor box
            whiteSpace: "pre-wrap",
            color: "#d4d4d4", // Light gray text

        },
    });

    const handleQueryInsert = () => {
        const handleInputChange = (event) => {
            setInputValue(event.target.value);
            // Perform your desired action here
            console.log('Input Value:', event.target.value);
        };
        const queryData = document.getElementById('custom-query').value;
        setFormData(queryData)

    };



    useEffect(() => {
        if (!initialized.current) {
            getBaseVariables();
            initialized.current = true;
        }

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
                        <Grid container spacing={3}>

                            <Grid item xs={10}>
                                <SqlEditorTextField
                                    variant="outlined"
                                    multiline
                                    rows={10}
                                    placeholder="Add your SQL query here..."
                                    id="custom-query"
                                    onChange={handleQueryInsert}
                                />
                            </Grid>
                            <Grid item xs={10}>
                                {checkMapped.length > 0 && checkMapped.map(base => (
                                        <Button variant="outlined" color={base.matched ? "warning" : "error"} endIcon={base.matched ? <CheckCircleFilled /> : <CloseCircleFilled />} className={{backgroundColor:'rgb(82, 196, 26)'}}>{base.variable}</Button>
                                    )
                                )}
                            </Grid>
                            <Grid item xs={10}>
                                {formData.length>0 &&
                                    <>
                                            <TestQueryMappings formData={formData} baselookup={baselookup}/>
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </form>

        </>
    );
};

export default AddQuerySelectorForm;
