import { useMutation, useQueryClient } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const saveCsvMappings = async ({baselookup,formData,conn_type}) => {
    const res = await fetch(`${API_URL}/flatfile_mapper/add/${conn_type}/mapped_variables/${baselookup}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const jsonData = await res.json();

    if (!res.ok) {
        return {status_code: res?.status,
            data:jsonData?.detail ?? []};
    }
    return {status_code: res?.status || 500,
        data:jsonData?.data ?? []};
};

export const useSaveCsvMappings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveCsvMappings,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['mappings']})
        }
    })
};



const testCsvMappings = async ({baselookup,formData, conn_type}) => {
    const res = await fetch(`${API_URL}/flatfile_mapper/test/${conn_type}/mapped_variables/${baselookup}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    const jsonData = await res.json();

    if (!res.ok) {
        return {status_code: res?.status,
            data:jsonData?.detail ?? []};
    }
    return {status_code: res?.status || 500,
        data:jsonData?.data ?? []};
};

export const useTestCsvMappings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: testCsvMappings,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['test_mappings']})
        }
    })
};


