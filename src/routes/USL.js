import Loadable from "../components/Loadable";
import {lazy} from "react";
import MainRoutes from "./MainRoutes";
import MinimalLayout from "../layout/MinimalLayout";

const DataDictionaryUSL = Loadable(lazy(() => import('pages/data-dictionary/DataDictionaryUSL')));
const ViewDataDictionaryUSL = Loadable(lazy(() => import('pages/data-dictionary/ViewDataDictionaryUSL')));
const AddDataDictionary = Loadable(lazy(() => import('pages/data-dictionary/AddDataDictionary')));

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