import { useState } from 'react';
import { Grid, Stack, Typography, TextField, Button, Box, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Text2SQL = () => {
  const sqlQuery = "SELECT * FROM users WHERE age > 30;"; // Example SQL Output
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlQuery).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 600, p: 2 }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h5" component="h2" gutterBottom>
              SQL Query Generator
            </Typography>

            <TextField
              id="outlined-textarea"
              label="Enter your query"
              placeholder="What would you like to ask today..."
              multiline
              fullWidth
              variant="outlined"
            />

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" size="large" sx={{ textTransform: 'none' }}>
                Generate SQL
              </Button>
            </Box>

            <Typography variant="body1" component="p">
              Your SQL query is here:
            </Typography>

            <Box sx={{ position: 'relative', p: 2, borderRadius: 1, overflow: 'hidden', bgcolor: '#f5f5f5', border: '1px solid #ddd' }}>
              <SyntaxHighlighter language="sql" style={materialLight}>
                {sqlQuery}
              </SyntaxHighlighter>
              <Tooltip title={copied ? "Copied!" : "Copy"}>
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', boxShadow: 1 }}
                >
                  <FileCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Text2SQL;
