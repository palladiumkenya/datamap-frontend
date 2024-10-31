import { useQuery } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const getUniversalDictionaryConfig = async () => {
    const res = await fetch(`${API_URL}/config/get_dictionary_config`);
    const jsonData = await res.json();
    return jsonData?.data ?? null;
};

export const useGetUniversalDictionaryConfig= () => useQuery({
    queryKey: ['universal_dictionary_config'],
    queryFn: getUniversalDictionaryConfig
});
