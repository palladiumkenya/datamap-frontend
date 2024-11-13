import { useRoutes } from 'react-router-dom';

// project import

import axios from "axios";
import {API_URL} from "../constants";


export const fetchBaseRepositories = async() => {
  const data =  fetch(API_URL+"/dictionary_mapper/base_schemas").then((res) =>
          res.json(),
      );
  return data;
};


export const fetchRepoMappings = async(baselookup) => {
    const data =  fetch(API_URL+"/dictionary_mapper/base_schema_variables/"+baselookup).then((res) =>
        res.json(),
    );
    return data;
};

export const fetchSourceSystemTablesAndColumns = async(baselookup) => {
    const data =  fetch(API_URL+"/dictionary_mapper/get_database_columns").then((res) =>
        res.json(),
    );
    return data;
};

export const fetchSourceSystemInfo = async(baselookup) => {
    return fetch(API_URL+"/db_access/active_connection").then((res) =>
        res.json(),
    );
    
};
