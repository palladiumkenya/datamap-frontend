import {
    Box, CircularProgress, IconButton,
    Link, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import {useState, useEffect} from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    EyeOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {useGetDataDictionariesUSL, useGetDataDictionaryTermsUSL} from "../../../store/data-dictionary/queries";
import DeleteDialog from "../../../components/Dialogs/DeleteDialog";
import {useDeleteDictionaryUSL, usePublishUniversalDataDictionary} from "../../../store/data-dictionary/mutations";
import Dot from "../../../components/@extended/Dot";
import PropTypes from "prop-types";

const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Name'
    },
    {
        id: 'version_number',
        align: 'left',
        disablePadding: true,
        label: 'Dictionary Version'
    },
    {
        id: 'is_published',
        align: 'left',
        disablePadding: true,
        label: 'Published'
    },
    {
        id: 'terms',
        align: 'left',
        disablePadding: false,
        label: 'No. of Terms/Variables'
    },
    {
        id: 'actions',
        align: 'right',
        disablePadding: false,
        label: ''
    }
];

const OrderStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case true:
            color = 'success';
            title = 'Published';
            break;
        case false:
            color = 'warning';
            title = 'Draft';
            break;
        default:
            color = 'error';
            title = 'Unknown';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

OrderStatus.propTypes = {
    status: PropTypes.bool
};

const DataDictionaryListUSL = () => {
    const [selected] = useState([]);
    const [data, setData] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowId, setRowId] = useState(null);

    const navigate = useNavigate();
    const {isLoading: isLoadingDict, data: repos} = useGetDataDictionariesUSL();
    const {isLoading: isLoadingTerms, data: terms} = useGetDataDictionaryTermsUSL();
    const deleteDictionary = useDeleteDictionaryUSL();
    const publishDictionary = usePublishUniversalDataDictionary();

    useEffect(() => {
        if (!isLoadingDict && !isLoadingTerms && repos && terms) {
            let configs = repos.map((repo) => {
                let datadict = terms.find(dict => dict.name === repo.name);
                return {...repo, ...datadict, "terms": datadict?.dictionary_terms.length ?? 0};
            });
            setData(configs);
        }
    }, [isLoadingDict, isLoadingTerms, repos, terms]);

    const handleClickUpload = (name) => {
        navigate(`/usl_dictionary/upload/${name}`);
    };

    const handleClickPublish = (id) => {
        publishDictionary.mutate({id})
    }

    const handleClickOpen = (id) => {
        setRowId(id);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleDelete = () => {
        // Add your delete logic here
        deleteDictionary.mutate(rowId, {
            onSuccess: () => {
                handleClose();
            },
        });
        handleClose();
    };

    const handleClickView = (name) => {
        navigate(`/usl_dictionary/view/${name}`);
    };

    const isSelected = (dict_name) => selected.indexOf(dict_name) !== -1;

    if (isLoadingDict || isLoadingTerms) {
        return (<CircularProgress />);
    }

    return (
        <Box>
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
                        {data.map((row, index) => {
                            const isItemSelected = isSelected(row.name);
                            const labelId = `enhanced-table-checkbox-${index}`;

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
                                    <TableCell component="th" id={labelId} scope="row" align="left">
                                        <Link color="secondary" component={RouterLink} to="">
                                            {row.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{row?.version_number}</TableCell>
                                    <TableCell align="left">
                                        <OrderStatus status={row.is_published} />
                                    </TableCell>
                                    <TableCell align="left">{row.terms}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={`Upload Dictionary`}>
                                            <IconButton aria-label="Upload" onClick={() => handleClickUpload(row.id)}>
                                                <UploadOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={row.is_published?`Unpublish Dictionary`: `Publish Dictionary`}>
                                            <IconButton aria-label="Publish/UnPublish" onClick={() => handleClickPublish(row.id)}>
                                                {row.is_published? <CloudDownloadOutlined />: <CloudUploadOutlined />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={`View Dictionary Variables`}>
                                            <IconButton aria-label="Edit" onClick={() => handleClickView(row.id)}>
                                                <EyeOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={`Delete All Dictionary Variables`}>
                                            <IconButton aria-label="Delete" onClick={() => handleClickOpen(row?.id)}>
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
                text="Data dictionary"
                open={dialogOpen}
                handleClose={handleClose}
                handleDelete={handleDelete} />
        </Box>
    );
};

export default DataDictionaryListUSL;
