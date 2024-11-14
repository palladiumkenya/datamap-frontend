import {API_URL} from "../constants";
import {useQuery} from "@tanstack/react-query";


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

export const fetchSourceSystemTablesAndColumns = async() => {
    const res = await fetch(`${API_URL}/dictionary_mapper/get_database_columns`);
    const jsonData = await res.json();

    return jsonData ?? null;
};

// export const useFetchSourceSystemTablesAndColumns = () => useQuery({
//     queryKey: ['source_system_tables'],
//     queryFn: fetchSourceSystemTablesAndColumns,
//     refetchInterval: 1800000, // refresh every 30min
//
// });


const fetchSourceSystemInfo = async () => {
    const res = await fetch(`${API_URL}/db_access/active_connection`);
    const jsonData = await res.json();
    return jsonData ?? null;
};

export const useGetFetchSourceSystemInfo = () => useQuery({
    queryKey: ['source_system'],
    queryFn: fetchSourceSystemInfo,
    refetchInterval: 1800000, // refresh every 30min

});


export const fetchBaseVariables = async (baselookup) => {
    const res = await fetch(`${API_URL}/dictionary_mapper/base_variables/`+baselookup);
    const jsonData = await res.json();
    return jsonData ?? null;
};
