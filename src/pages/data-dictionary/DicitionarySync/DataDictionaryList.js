import {
    Box,
    CircularProgress,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from "@mui/material";
import {useEffect, useState} from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {EyeOutlined} from "@ant-design/icons";
import {
    useGetDataDictionaries,
    useGetDataDictionaryTerms
} from "../../../store/data-dictionary/queries";


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
    const {isLoading: isLoadingDict, data: repos} = useGetDataDictionaries();
    const {isLoading: isLoadingTerms, data: terms} = useGetDataDictionaryTerms();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoadingDict && !isLoadingTerms && repos && terms) {
            let configs = repos.map((repo) => {
                let datadict = terms.find(dict => dict.name === repo.name);
                return {...repo, ...datadict, "terms": datadict?.dictionary_terms.length ?? 0};
            });
            setData(configs);
        }
    }, [isLoadingDict, isLoadingTerms, repos, terms]);


    const handleClickView = (id) => {
        navigate(`/dictionary/view/${id}`)
    }

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
                                        <Tooltip  title={`View Dictionary Variables`}>
                                            <IconButton aria-label="View"  onClick={() => handleClickView(row.id)}>
                                                <EyeOutlined />
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
