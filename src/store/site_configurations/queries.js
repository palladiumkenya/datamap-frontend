import { useQuery } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const getAllSiteConfigs = async () => {
    const res = await fetch(`${API_URL}/site_config/get_site_config`);
    const jsonData = await res.json();
    return jsonData?.data ?? [];
};

export const useGetSiteConfigs = () => useQuery({
    queryKey: ['site_configs'],
    queryFn: getAllSiteConfigs
});
