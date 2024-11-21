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
import Dot from "../../../components/@extended/Dot";
import {BookOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import DeleteDialog from "../../../components/Dialogs/DeleteDialog";
import {useDeleteAccessConfig} from "../../../store/access_configurations/mutations";
import { useGetSiteConfigs} from "../../../store/site_configurations/queries";



const headCells = [
    {
        id: 'site_name',
        align: 'left',
        disablePadding: true,
        label: 'Name'
    },
    {
        id: 'site_code',
        align: 'left',
        disablePadding: false,
        label: 'Site Code'
    },
    {
        id: 'is_active',
        align: 'left',
        disablePadding: false,
        label: 'Status'
    },
    {
        id: 'primary_system',
        align: 'right',
        disablePadding: false,
        label: 'Primary System'
    },
    {
        id: 'actions',
        align: 'right',
        disablePadding: false,
        label: ''
    }
];

const SiteConfigStatus = ({ status }) => {
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

SiteConfigStatus.propTypes = {
    status: PropTypes.number
};

const ConfigsList = () =>{
    const [selected] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false)
    const [rowId, setRowId] = useState(null);
    const navigate = useNavigate()
    const deleteAccess = useDeleteAccessConfig()
    const { isLoading: isLoading, data: getSiteConfigsData } = useGetSiteConfigs();

    const handleDictListClick = (id) => {
        navigate(`/dictionary/list/${id}`);
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
                        {!isLoading && (getSiteConfigsData)?.map((row, index) => {
                            const isItemSelected = isSelected(row.site_name);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.site_name}
                                    selected={isItemSelected}
                                >
                                    <TableCell component="th" id={labelId} scope="row" align="left">
                                        <Link color="secondary" component={RouterLink} to="">
                                            {row.site_name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{row.site_code}</TableCell>
                                    <TableCell align="left">
                                        <SiteConfigStatus status={row.is_active} />
                                    </TableCell>
                                    <TableCell align="right">{new Date(row.primary_system)}</TableCell>
                                    <TableCell align="right">
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
