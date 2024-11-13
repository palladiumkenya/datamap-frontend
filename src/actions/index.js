import {API_URL} from "../constants";


export const fetchBaseRepositories = async() => {
    const data = fetch(API_URL+"/dictionary_mapper/base_schemas")
        .then((res) =>
            res.json(),
        );
  return data;
};


export const fetchRepoMappings = async(baselookup) => {
    const data = fetch(API_URL+"/dictionary_mapper/base_schema_variables/"+baselookup)
        .then((res) =>
            res.json(),
        );
    return data;
};
