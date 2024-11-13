import Loadable from "../components/Loadable";
import {lazy} from "react";
import MainRoutes from "./MainRoutes";
import MinimalLayout from "../layout/MinimalLayout";

const DataDictionaryUSL = Loadable(lazy(() => import('pages/data-dictionary/UniversalDictionary/DataDictionaryUSL')));
const ViewDataDictionaryUSL = Loadable(lazy(() => import('pages/data-dictionary/UniversalDictionary/ViewDataDictionaryUSL')));
const AddDataDictionary = Loadable(lazy(() => import('pages/data-dictionary/UniversalDictionary/AddDataDictionary')));

const USL = {
    path: 'usl_dictionary',
    element: <MinimalLayout />,
    children: [
        {
            path: `list`,
            element: <DataDictionaryUSL />
        },
        {
            path: `add`,
            element: <AddDataDictionary />
        },
        {
            path: `upload/:dictionaryName`,
            element: <AddDataDictionary />
        },
        {
            path: `view/:dictionaryName`,
            element: <ViewDataDictionaryUSL />
        }
    ]
}

export default USL;
