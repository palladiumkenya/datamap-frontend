import { useQuery } from "@tanstack/react-query";
import {API_URL} from "../../constants";



const getLoadedData = async ({queryKey}) => {
    const [key, baseRepo] = queryKey;
    const res = await fetch(`${API_URL}/dictionary_mapper/load_data/${baseRepo}`);
    const jsonData = await res.json();
    console.log("getLoadedData",baseRepo, jsonData)
    return jsonData?.data ?? [];
};

export const useGetLoadedData = (baseRepo) => useQuery({
    queryKey: ['loaded_data', baseRepo],
    queryFn: getLoadedData,
    enabled:false
});

const getTransmissionHistory = async () => {
    const res = await fetch(`${API_URL}/usl_data/transmission/history`);
    const jsonData = await res.json();
    console.log(jsonData)
    return jsonData?.data ?? [];
};

export const useGetTransmissionHistory = () => useQuery({
    queryKey: ['baseReposHistory'],
    queryFn: getTransmissionHistory
});



