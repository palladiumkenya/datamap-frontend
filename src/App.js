// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { useQuery, QueryClient, QueryClientProvider  } from '@tanstack/react-query'

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //



const queryClient = new QueryClient()

const App = () => (
    <QueryClientProvider client={queryClient} contextSharing={true}>
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
    </QueryClientProvider>
);

export default App;
