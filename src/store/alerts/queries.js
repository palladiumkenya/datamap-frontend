import {useQuery} from "@tanstack/react-query";
import {API_URL} from "../../constants";


const getDataDictionarySyncAlert = async () => {
    const res = await fetch(`${API_URL}/data_dictionary/dictionary_version_notification`);
    const jsonData = await res.json();
    return jsonData ?? null;
};

export const useGetDataDictionarySyncAlert = () => useQuery({
    queryKey: ['data_dictionary_sync_alert'],
    queryFn: getDataDictionarySyncAlert,
    refetchInterval: 1800000, // refresh every 30min

});
