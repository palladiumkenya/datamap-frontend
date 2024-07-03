import { useQuery } from "@tanstack/react-query";

const getAllAccessConfigs = async () => {
    const res = await fetch('http://localhost:8000/api/db_access/available_connections');
    const jsonData = await res.json();
    return jsonData?.credentials ?? [];
};

export const useGetAccessConfigs = () => useQuery({
    queryKey: ['access_configs'],
    queryFn: getAllAccessConfigs
});
