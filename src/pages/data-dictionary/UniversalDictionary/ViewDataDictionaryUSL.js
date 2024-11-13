import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Chip,
    CircularProgress, Grid,
    IconButton, Skeleton, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip, Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {DeleteOutlined, EditOutlined, ExpandAltOutlined} from "@ant-design/icons";
import DeleteDialog from "../../../components/Dialogs/DeleteDialog";
import MainCard from "../../../components/MainCard";
import {useGetDataDictionaryChangeLogUSL, useGetDataDictionaryTermUSL} from "../../../store/data-dictionary/queries";
import {useDeleteDictionaryTermUSL, useUpdateDataDictionaryTermUSL} from "../../../store/data-dictionary/mutations";
import UpdateTermDialog from "./UpdateTermDialog";
import {parseVersionChanges} from "../../../helpers/diffHelper";
import Paper from "@mui/material/Paper";


const headCells = [
    {
        id: 'column',
        align: 'left',
        disablePadding: true,
        label: 'Column'
    },
    {
        id: 'data_type',
        align: 'left',
        disablePadding: true,
        label: 'data_type'
    },
    {
        id: 'is_required',
        align: 'left',
        disablePadding: true,
        label: 'is_required'
    },
    {
        id: 'description',
        align: 'left',
        disablePadding: false,
        label: 'Description'
    },
    {
        id: 'expected_values',
        align: 'left',
        disablePadding: false,
        label: 'Expected Values'
    },
    {
        id: 'actions',
        align: 'left',
        disablePadding: false,
        label: 'Actions'
    },
];


const ViewDataDictionaryUSL = () => {
    const [selected] = useState([]);
    let [data, setData] = useState([]);
    let [changeLog, setChangeLog] = useState([]);
    let [dict, setDict] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false)
    const [rowId, setRowId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const {dictionaryName} = useParams()
    const {isLoading, data: dictionaryTerms} = useGetDataDictionaryTermUSL(dictionaryName)
    const {isLoading: isLoadingHistory, data: dictionaryChangeLog} = useGetDataDictionaryChangeLogUSL(dictionaryName)
    const deleteTerm = useDeleteDictionaryTermUSL()
    const updateTerm = useUpdateDataDictionaryTermUSL();

    useEffect(() => {
        if(!isLoading && dictionaryTerms){
            setData(dictionaryTerms?.dictionary_terms)
            setDict(dictionaryTerms?.name)
        }
        if (!isLoadingHistory && dictionaryChangeLog){
            const parsedChanges = Object.keys(dictionaryChangeLog)
                .map((version) => ({
                    version: parseInt(version.replace('Version ', ''), 10),
                    changes: parseVersionChanges(dictionaryChangeLog[version])
                }))
                .sort((a, b) => b.version - a.version);

            setChangeLog(parsedChanges)
        }
    }, [isLoading, dictionaryTerms, isLoadingHistory, dictionaryChangeLog]);

    const handleClickOpen = (id) => {
        setRowId(id);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleUpdateDialogOpen = (term) => {
        setSelectedTerm(term);
        setUpdateDialogOpen(true);
    };

    const handleUpdateDialogClose = () => {
        setUpdateDialogOpen(false);
    };

    const handleDelete = () => {
        deleteTerm.mutate(rowId, {
            onSuccess: () => {
                setData((prevData) => prevData.filter((term) => term.term_id !== rowId));
                handleClose();
            },
        });
        handleClose();
    };

    const handleUpdate = (updatedTerm) => {
        updateTerm.mutate({ term_id: selectedTerm.term_id, ...updatedTerm }, {
            onSuccess: () => {
                setData((prevData) =>
                    prevData.map((term) =>
                        term.term_id === selectedTerm.term_id ? { ...term, ...updatedTerm } : term
                    )
                );
                handleUpdateDialogClose();
            },
        });
    };
    const isSelected = (dict_name) => selected.indexOf(dict_name) !== -1;

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid container columnSpacing={2} sx={{ marginY: '5px'}}>
            <Grid item xs={8} md={8} style={{maxHeight: '97vh', overflowY: 'auto'}}>
                <Box>
                    <MainCard content={true} title={`${dict} Dictionary Terms`}>

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
                                                style={headCell.id === 'actions' ? {
                                                    position: "sticky",
                                                    background: "white",
                                                    boxShadow: "5px 2px 5px grey",
                                                    right: 0
                                                } : {}}
                                            >
                                                {headCell.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!isLoading && (data)?.map((row, index) => {
                                        const isItemSelected = isSelected(row.name);

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.name}
                                                selected={isItemSelected}
                                            >
                                                <TableCell align="left">{row?.term}</TableCell>
                                                <TableCell align="left">{row?.data_type}</TableCell>
                                                <TableCell align="left">{row?.is_required ? 'yes': 'no'}</TableCell>
                                                <TableCell align="left">{row?.term_description}</TableCell>
                                                <TableCell align="left">{row?.expected_values}</TableCell>
                                                <TableCell align="right"
                                                           style={{
                                                               position: "sticky",
                                                               background: "white",
                                                               boxShadow: "5px 2px 5px grey",
                                                               right: 0
                                                }}>

                                                    <Tooltip title={`Edit Dictionary Variables`}>
                                                        <IconButton aria-label="Edit" onClick={() => handleUpdateDialogOpen(row)}>
                                                            <EditOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip  title={`Delete Dictionary Variables`}>
                                                        <IconButton aria-label="Delete" onClick={() => handleClickOpen(row?.term_id)}>
                                                            <DeleteOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <DeleteDialog
                            text="Data dictionary term"
                            open={dialogOpen}
                            handleClose={handleClose}
                            handleDelete={handleDelete} />
                        <UpdateTermDialog
                            open={updateDialogOpen}
                            handleClose={handleUpdateDialogClose}
                            handleUpdate={handleUpdate}
                            termData={selectedTerm}
                        />
                    </MainCard>
                </Box>
            </Grid>
            <Grid item xs={4} md={4} style={{maxHeight: '97vh', overflowY: 'auto'}}>
                <Box style={{width: '100%'}}>
                    <MainCard content={true} title={`${dict} Dictionary Version History`}>
                        {isLoadingHistory && <Skeleton variant="rectangular" height={118} />}
                        {changeLog.map(({ version, changes }, index) => (
                            <Accordion key={version} defaultExpanded={index === 0}>
                                <AccordionSummary expandIcon={<ExpandAltOutlined />}>
                                    <Typography variant="h6">Version {version}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {changes.map((change) => (
                                        <div style={{ padding: '10px', marginBottom: '16px' }} key={change.id}>
                                            <Typography variant="body2" color="textSecondary">
                                                Operation: <Chip label={change.operation} size="small" color={change.operation === 'ADD' ? 'success' : change.operation === 'DELETE' ? 'error' : 'primary'} />
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                Changed At: {new Date(change.changed_at).toLocaleString()}
                                            </Typography>

                                            <TableContainer component={Paper} style={{ marginTop: '16px' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Field</TableCell>
                                                            <TableCell>Old Value</TableCell>
                                                            <TableCell>New Value</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {change.fields.map((fieldChange, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell><strong>{fieldChange.field}</strong></TableCell>
                                                                <TableCell>{fieldChange.old !== null ? fieldChange.old.toString() : '-'}</TableCell>
                                                                <TableCell>{fieldChange.new !== null ? fieldChange.new.toString() : '-'}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </div>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </MainCard>
                </Box>
            </Grid>
        </Grid>
    )
}

export default ViewDataDictionaryUSL
