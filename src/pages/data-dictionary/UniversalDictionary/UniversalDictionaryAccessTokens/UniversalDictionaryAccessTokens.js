import {
    Box,
    Button,
    Stack,
    OutlinedInput,
    Typography,
    InputAdornment,
    IconButton,
    InputLabel,
    Snackbar
} from "@mui/material";
import {ContentCopy, Visibility, VisibilityOff} from "@mui/icons-material";
import * as React from "react";
import MainCard from "../../../../components/MainCard";
import {useState} from "react";
import {useGetDataDictionaryTokenUSL} from "../../../../store/data-dictionary/queries";
import {useRefreshUniversalDataDictionaryToken} from "../../../../store/data-dictionary/mutations";


const UniversalDictionaryAccessTokens = () => {
    const [copied, setCopied] = useState(false);
    const [showToken, setShowToken] = React.useState(false);
    const {data, isLoading} = useGetDataDictionaryTokenUSL()
    const refreshToken = useRefreshUniversalDataDictionaryToken()

    if(isLoading)
        return (<></>)


    const handleClickShowToken = () => setShowToken((show) => !show);

    const handleMouseDownToken = (event) => {
        event.preventDefault();
    };

    const handleMouseUpToken = (event) => {
        event.preventDefault();
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(data.token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setCopied(false);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <MainCard>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <InputLabel htmlFor="token-adornment">Access token</InputLabel>
                    <OutlinedInput
                        id='token-adornment'
                        type={showToken ? 'text' : 'password'}
                        name="name"
                        label="Universal Data Dictionary Name"
                        variant="outlined"
                        value={`${data.token}`}
                        disabled={true}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showToken ? 'hide the Token' : 'display the Token'
                                    }
                                    onClick={handleClickShowToken}
                                    onMouseDown={handleMouseDownToken}
                                    onMouseUp={handleMouseUpToken}
                                    edge="end"
                                >
                                    {showToken ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                <IconButton
                                    aria-label="copy token"
                                    onClick={handleCopy}
                                    edge="end"
                                >
                                    <ContentCopy />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Typography variant="body2" color="textSecondary">Access token for Universal Data Dictionary</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        type={'button'}
                        variant="contained"
                        color="success"
                        onClick={() => refreshToken.mutate()}
                    >
                        Refresh
                    </Button>
                </Stack>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    open={copied}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Token Copied!"
                />
            </MainCard>
        </Box>
    )
}

export default UniversalDictionaryAccessTokens
