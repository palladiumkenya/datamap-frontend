import React, { useEffect, useState, useRef, useCallback  } from 'react';

// material-ui
import {
    Button,
    Divider,
    Grid, Alert, TextField
} from '@mui/material';
import { styled } from '@mui/system';


// assets
import {InfoCircleFilled, CheckCircleFilled, CloseCircleFilled} from '@ant-design/icons';

import { fetchBaseVariables } from '../../../store/mapper/queries';

import TestQueryMappings  from "../test-mappings/TestQueryMappings";




const SqlTextArea = React.memo(({ onChange }) => {
    const SqlEditorTextarea = styled('textarea')({
        fontFamily: 'monospace',
        backgroundColor: 'darkslategray', // Dark theme like SQL editors
        color: '#d4d4d4', // Light gray text
        borderRadius: '5px',
        border: '1px solid #555',
        fontSize: '14px',
        lineHeight: '1.5',
        minWidth: '600px', // Resemble a query editor box
        maxHeight: '200px', // Resemble a query editor box
        whiteSpace: 'pre-wrap',
        padding: '10px',
        '&:hover': {
            borderColor: '#888',
        },
        '&:focus': {
            borderColor: '#4CAF50', // Green focus border like SQL editors
            outline: 'none',
        },
    });

    return (
        <SqlEditorTextarea
            variant="outlined"
            multiline
            rows={10}
            placeholder="Add your SQL query here..."
            id="custom-query"
            onChange={onChange}

        />
    );
});


const AddQuerySelectorForm = () => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    const baselookup=params.get('baselookup')
    const initialized = useRef(false);

    const [databaseColumns, setdatabaseColumns] = useState({});
    const [baseRepoVariables, setBaseRepoVariables] = useState([])
    const [fetchedSourceTables, setFetchedSourceTables] = useState(null);

    const allColumns = []
    baseRepoVariables.map(o =>{
        allColumns.push({"baseVariable":o,"tableSelected":"", "matchingTableColumns":[]});
    });

    const [columns, setColumns] = useState([]);

    const [formData, setFormData] = useState([]);
    const [queryData, setQueryData] = useState('');

    const inputRef = useRef(null);
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


    const handleQueryInput = useCallback((e) => {
        setQueryData(e.target.value);
    }, []);



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
                                <SqlTextArea
                                    onChange={handleQueryInput}
                                />
                            </Grid>
                            <Grid item xs={10}>
                                {checkMapped.length > 0 && checkMapped.map(base => (
                                        <Button key={base.id} variant="outlined" color={base.matched ? "warning" : "error"} endIcon={base.matched ? <CheckCircleFilled /> : <CloseCircleFilled />} className={{backgroundColor:'rgb(82, 196, 26)'}}>{base.variable}</Button>
                                    )
                                )}
                            </Grid>
                            <Grid item xs={10}>
                                {queryData != '' &&
                                    <>
                                        <TestQueryMappings formData={queryData} baselookup={baselookup}/>
                                    </>
                                }
                            </Grid>
                        </Grid>
                    </form>

        </>
    );
};

export default AddQuerySelectorForm;
