import { useQuery } from "@tanstack/react-query";
import {API_URL} from "../../constants";




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
