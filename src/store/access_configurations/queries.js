import { useQuery } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const getAllAccessConfigs = async () => {
    const res = await fetch(`${API_URL}/db_access/available_connections`);
    const jsonData = await res.json();
    return jsonData?.credentials ?? [];
};

export const useGetAccessConfigs = () => useQuery({
    queryKey: ['access_configs'],
    queryFn: getAllAccessConfigs
});
