import * as React from 'react';
import {Box, Tab} from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import UniversalDictionaryConfig from "./UniversalDictionaryConfig";


const USLConfigsTabs = () => {
    const [value, setValue] = React.useState('1');


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return(
      <>
          <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList value={value} onChange={handleChange} centered>
                      <Tab label="Universal Dictionary " value={"1"} />
                  </TabList>
              </Box>

              <TabPanel value="1">
                  <UniversalDictionaryConfig />
              </TabPanel>
          </TabContext>
      </>
    )
}

export default USLConfigsTabs
