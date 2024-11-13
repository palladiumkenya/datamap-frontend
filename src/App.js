// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {AlertDictionaryVersionsProvider} from "./contexts/UniversalDictionaryVersionsContext";

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //


const queryClient = new QueryClient()

const App = () => (
    <QueryClientProvider client={queryClient} contextSharing={true}>
        <AlertDictionaryVersionsProvider>
            <ThemeCustomization>
                <ScrollTop>
                    <Routes/>
                </ScrollTop>
            </ThemeCustomization>
        </AlertDictionaryVersionsProvider>
    </QueryClientProvider>
);

export default App;
