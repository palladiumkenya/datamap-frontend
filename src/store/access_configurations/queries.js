import {useQuery} from "@tanstack/react-query";
import {API_URL} from "../../constants";

const getAllAccessConfigs = async () => {
    const res = await fetch(`${API_URL}/db_access/available_connections`);
    const jsonData = await res.json();
    return jsonData?.credentials ?? [];
};

const getAccessConfig = async ({queryKey}) => {
    const [, id] = queryKey;
    const res = await fetch(`${API_URL}/db_access/get_connection/${id}`)
    return await res.json()
}

export const useGetAccessConfigs = () => useQuery({
    queryKey: ['access_configs'],
    queryFn: getAllAccessConfigs
});

export const useGetAccessConfig = (id) => useQuery({
    queryKey: ['access_config', id],
    queryFn: getAccessConfig,
    enabled: !!id
})
