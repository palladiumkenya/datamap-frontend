import { useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography
} from '@mui/material';

// project import
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets
import TransmissionHistory from "./metrics/TransmissionHistory";
import DQAReportHistoryTable from "./metrics/DQAReportHistoryTable";
import PieLatestRunsDQA from "./metrics/PieLatestRunsDQA";

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// sales report status
const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [value, setValue] = useState('today');
  const [slot, setSlot] = useState('week');

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      {/*<Grid item xs={12} sx={{ mb: -2.25 }}>*/}
      {/*  <Typography variant="h5">Dashboard</Typography>*/}
      {/*</Grid>*/}
      {/*<Grid item xs={12} sm={6} md={4} lg={3}>*/}
      {/*  <AnalyticEcommerce title="TX_CURR" count="274" percentage={59.3} extra="35,000" />*/}
      {/*</Grid>*/}
      {/*<Grid item xs={12} sm={6} md={4} lg={3}>*/}
      {/*  <AnalyticEcommerce title="TX_NEW" count="21" percentage={70.5} extra="8,900" />*/}
      {/*</Grid>*/}
      {/*<Grid item xs={12} sm={6} md={4} lg={3}>*/}
      {/*  <AnalyticEcommerce title="HTS_TST" count="134" percentage={27.4} isLoss color="warning" extra="1,943" />*/}
      {/*</Grid>*/}
      {/*<Grid item xs={12} sm={6} md={4} lg={3}>*/}
      {/*  <AnalyticEcommerce title="HTS_INDEX" count="78" percentage={27.4} isLoss color="warning" extra="$20,395" />*/}
      {/*</Grid>*/}

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      {/*<Grid item xs={12} md={7} lg={8}>*/}
      {/*  <Grid container alignItems="center" justifyContent="space-between">*/}
      {/*    <Grid item>*/}
      {/*      <Typography variant="h5">TX_NEW stats</Typography>*/}
      {/*    </Grid>*/}
      {/*    <Grid item>*/}
      {/*      <Stack direction="row" alignItems="center" spacing={0}>*/}
      {/*        <Button*/}
      {/*          size="small"*/}
      {/*          onClick={() => setSlot('month')}*/}
      {/*          color={slot === 'month' ? 'primary' : 'secondary'}*/}
      {/*          variant={slot === 'month' ? 'outlined' : 'text'}*/}
      {/*        >*/}
      {/*          Month*/}
      {/*        </Button>*/}
      {/*        <Button*/}
      {/*          size="small"*/}
      {/*          onClick={() => setSlot('week')}*/}
      {/*          color={slot === 'week' ? 'primary' : 'secondary'}*/}
      {/*          variant={slot === 'week' ? 'outlined' : 'text'}*/}
      {/*        >*/}
      {/*          Week*/}
      {/*        </Button>*/}
      {/*      </Stack>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*  <MainCard content={false} sx={{ mt: 1.5 }}>*/}
      {/*    <Box sx={{ pt: 1, pr: 2 }}>*/}
      {/*      <IncomeAreaChart slot={slot} />*/}
      {/*    </Box>*/}
      {/*  </MainCard>*/}
      {/*</Grid>*/}
      {/*<Grid item xs={12} md={5} lg={4}>*/}
      {/*  <Grid container alignItems="center" justifyContent="space-between">*/}
      {/*    <Grid item>*/}
      {/*      <Typography variant="h5">HTS POS Overview</Typography>*/}
      {/*    </Grid>*/}
      {/*    <Grid item />*/}
      {/*  </Grid>*/}
      {/*  <MainCard sx={{ mt: 2 }} content={false}>*/}
      {/*    <Box sx={{ p: 3, pb: 0 }}>*/}
      {/*      <Stack spacing={2}>*/}
      {/*        <Typography variant="h6" color="textSecondary">*/}
      {/*          This Week Statistics*/}
      {/*        </Typography>*/}
      {/*        <Typography variant="h3">7,650</Typography>*/}
      {/*      </Stack>*/}
      {/*    </Box>*/}
      {/*    <MonthlyBarChart />*/}
      {/*  </MainCard>*/}
      {/*</Grid>*/}


      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Transmission History</Typography>
          </Grid>
          <Grid item />
        </Grid>

        <MainCard sx={{ mt: 2 }} content={false}>
            <TransmissionHistory />
        </MainCard>


      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">DQA Runs History</Typography>
          </Grid>
          <Grid item />
        </Grid>

        <MainCard sx={{ mt: 2 }} content={false}>
            <DQAReportHistoryTable />
        </MainCard>


      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Latest DQA Failure Rate By Base Table</Typography>
          </Grid>
          <Grid item />
        </Grid>

        <MainCard sx={{ mt: 2 }} content={false}>
          <PieLatestRunsDQA />
        </MainCard>


      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
