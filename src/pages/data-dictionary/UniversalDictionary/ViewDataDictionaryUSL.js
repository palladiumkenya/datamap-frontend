import {
    Box,
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import DeleteDialog from "../../../components/Dialogs/DeleteDialog";
import MainCard from "../../../components/MainCard";
import {useGetDataDictionaryTermUSL} from "../../../store/data-dictionary/queries";
import {useDeleteDictionaryTermUSL, useUpdateDataDictionaryTermUSL} from "../../../store/data-dictionary/mutations";
import UpdateTermDialog from "./UpdateTermDialog";


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
    const [dialogOpen, setDialogOpen] = useState(false)
    const [rowId, setRowId] = useState(null);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);
    const {dictionaryName} = useParams()
    const {isLoading, data: dictionaryTerms} = useGetDataDictionaryTermUSL(dictionaryName)
    const deleteTerm = useDeleteDictionaryTermUSL()
    const updateTerm = useUpdateDataDictionaryTermUSL();

    useEffect(() => {
        if(!isLoading && dictionaryTerms){
            setData(dictionaryTerms?.dictionary_terms)
        }
    }, [isLoading, dictionaryTerms]);

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
        console.log(rowId)
        // Add your delete logic here
        deleteTerm.mutate(rowId, {
            onSuccess: () => {
                setData((prevData) => prevData.filter((term) => term.term_id !== rowId));
                handleClose();
            },
        });
        console.log(deleteTerm.isSuccess)
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
        <Box>
            <MainCard sx={{ mt: 2 }} content={false}>
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
                                        <TableCell align="right">

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
    )
}

export default ViewDataDictionaryUSL
