import {API_URL} from "../../constants";
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


export const fetchBaseVariables = async (baseRepo) => {
    const res = await fetch(`${API_URL}/dictionary_mapper/base_variables/${baseRepo}`);
    const jsonData = await res.json();
    return jsonData?.data ?? null;
};
export const useGetBaseVariables  = (baseRepo) => useQuery({
    queryKey: ['baseRepo'],
    queryFn: fetchBaseVariables(baseRepo),
    refetchInterval: 1800000, // refresh every 30min

});

export const fetchMappedBaseVariables = async (baseRepo) => {
    const res = await fetch(`${API_URL}/dictionary_mapper/base_schema_variables/${baseRepo}`);
    const jsonData = await res.json();
    console.log("jsonData", jsonData)
    return jsonData ?? null;
};
export const useGetMappedBaseVariables  = (baseRepo) => useQuery({
    queryKey: ['baseRepo'],
    queryFn: fetchMappedBaseVariables(baseRepo),
    refetchInterval: 1800000, // refresh every 30min

});


const fetchConfigCreation = async () => {
    const res = await fetch(`${API_URL}/dictionary_mapper/generate_config/${baselookup}`);
    const jsonData = await res.json();
    return jsonData ?? null;
};

export const useGetConfigCreation = () => useQuery({
    queryKey: ['baselookup'],
    queryFn: fetchConfigCreation,
    refetchInterval: 1800000, // refresh every 30min

});


const fetchRepositoryLoadedData = async (baseRepo) => {
    const res = await fetch(`${API_URL}/usl_data/repository/${baseRepo}`);
    const jsonData = await res.json();
    console.log("data ==>", jsonData)
    return jsonData?.data ?? null;
};

export const useGetRepositoryLoadedData  = (baseRepo) => useQuery({
    queryKey: ['baseRepo'],
    queryFn: fetchRepositoryLoadedData(baseRepo),
    refetchInterval: 1800000, // refresh every 30min

});
