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
import Dot from "../../components/@extended/Dot";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {DeleteOutlined, EditOutlined, UploadOutlined} from "@ant-design/icons";


const headCells = [
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Name'
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


const DataDictionaryList = () => {
    const [selected] = useState([]);
    let [data, setData] = useState([]);

    const navigate = useNavigate()

    const handleClickUpload = (name) => {
        navigate(`/dictionary/upload/${name}`)
    }
    const handleClickView = (name) => {
        navigate(`/dictionary/view/${name}`)
    }

    let repos = [
        {
            "name": "Client Repository",
            "id": "client_repository"
        },
        {
            "name": "Events Repository",
            "id": "events_repository"
        },
    ]

    useEffect(() => {
        fetchData();
    }, []);

    let fetchData = async () => {
        try {
            const response = await  fetch('http://localhost:8000/api/data_dictionary/data_dictionaries')
            if (response.ok) {
                const jsonData = await response.json();
                let configs = repos.map((repo) => {
                    let datadict = jsonData.find(dict => dict.name === repo.id)

                    return {...repo, ...datadict, "terms": datadict?.dictionary_terms.length ?? 0}
                })
                setData(configs);
            } else {
                throw new Error('Error: ' + response.status);
            }
        } catch (err){
            console.log(err);
        }
    }

    const isSelected = (dict_name) => selected.indexOf(dict_name) !== -1;

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
                        {(data).map((row, index) => {
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
                                    <TableCell align="left">{row?.terms}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip  title={`Upload Dictionary`}>
                                            <IconButton aria-label="Upload" onClick={() => handleClickUpload(row.id)}>
                                                <UploadOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip  title={`Edit Dictionary Variables`}>
                                            <IconButton aria-label="Edit"  onClick={() => handleClickView(row.id)}>
                                                <EditOutlined />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip  title={`Delete All Dictionary Variables`}>
                                            <IconButton aria-label="Delete">
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
        </Box>
    )
}

export default DataDictionaryList