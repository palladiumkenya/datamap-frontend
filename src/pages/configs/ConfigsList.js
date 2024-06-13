import {useEffect, useState} from "react";
import {
    Box, IconButton,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Tooltip,
    Typography
} from "@mui/material";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import Dot from "../../components/@extended/Dot";
import {BookOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import DeleteDialog from "../../components/Dialogs/DeleteDialog";
import {useDeleteAccessConfig} from "../../store/access_configurations/mutations";
import {useGetAccessConfigs} from "../../store/access_configurations/queries";



const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Name'
    },
    {
        id: 'db_type',
        align: 'left',
        disablePadding: false,
        label: 'Database Type'
    },
    {
        id: 'is_active',
        align: 'left',
        disablePadding: false,
        label: 'Status'
    },
    {
        id: 'updated_at',
        align: 'right',
        disablePadding: false,
        label: 'Date Updated'
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
            title = 'Active';
            break;
        case false:
            color = 'warning';
            title = 'Inactive';
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
    status: PropTypes.number
};

const ConfigsList = () =>{
    const [selected] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false)
    const [rowId, setRowId] = useState(null);
    const navigate = useNavigate()
    const deleteAccess = useDeleteAccessConfig()
    const { isLoading: isLoading, data: getAccessConfigsData } = useGetAccessConfigs();


    const handleDictListClick = () => {
        navigate('/dictionary/list');
    };

    const handleClickOpen = (id) => {
        setRowId(id);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleDelete = () => {
        console.log(rowId)
        // Add your delete logic here
        deleteAccess.mutate({id: rowId})
        console.log(deleteAccess.isSuccess)
        handleClose();
    };


    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

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
                        {!isLoading && (getAccessConfigsData)?.map((row, index) => {
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
                                    <TableCell align="left">{row.conn_string.split("://")[0]}</TableCell>
                                    <TableCell align="left">
                                        <OrderStatus status={row.is_active} />
                                    </TableCell>
                                    <TableCell align="right">{new Date(row.updated_at).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={`Data Dictionary`}>
                                            <IconButton aria-label="Data Dictionary" onClick={handleDictListClick}>
                                                <BookOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={`Edit`}>
                                            <IconButton aria-label="Edit">
                                                <EditOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={`Delete`}>
                                            <IconButton aria-label="Delete" onClick={() => handleClickOpen(row.id)}>
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
                text="Database Config"
                open={dialogOpen}
                handleClose={handleClose}
                handleDelete={handleDelete} />
        </Box>
    );
}
export default ConfigsList;