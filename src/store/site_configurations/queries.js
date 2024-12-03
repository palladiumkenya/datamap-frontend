import { useQuery } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const getAllSiteConfigs = async () => {
    const res = await fetch(`${API_URL}/site_config/all/configs`);
    const jsonData = await res.json();
    return jsonData?.data ?? [];
};

export const useGetSiteConfigs = () => useQuery({
    queryKey: ['site_configs'],
    queryFn: getAllSiteConfigs
});


const getActiveSiteConfig = async () => {
    const res = await fetch(`${API_URL}/site_config/active_site_config`);
    const jsonData = await res.json();
    return jsonData?.data ?? [];
};

export const useGetActiveSiteConfig = () => useQuery({
    queryKey: ['site_config'],
    queryFn: getActiveSiteConfig
});
