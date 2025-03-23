import { useMutation, useQueryClient } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const saveCsvMappings = async ({baselookup,formData}) => {
    const res = await fetch(`${API_URL}/flatfile_mapper/add_mapped_variables/${baselookup}`, {
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



const testCsvMappings = async ({baselookup,formData}) => {
    const res = await fetch(`${API_URL}/flatfile_mapper/test/mapped_variables/${baselookup}`, {
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


const testQueryMappings = async ({baselookup,formData}) => {

    const res = await fetch(`${API_URL}/dictionary_mapper/test/query/mapped_variables/${baselookup}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"query":formData})
    });
    const jsonData = await res.json();

    if (!res.ok) {
        return {status_code: res?.status,
            data:jsonData?.detail ?? []};
    }
    return {status_code: res?.status || 500,
         data:jsonData?.data ?? []};

};

export const useTestQueryMappings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: testQueryMappings,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['test_query_mappings']})
        }
    })
};



const saveQuery = async ({baselookup,formData}) => {
    const res = await fetch(`${API_URL}/dictionary_mapper/add_query/${baselookup}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"query":formData})
    });

    const jsonData = await res.json();

    if (!res.ok) {
        return {status_code: res?.status,
            data:jsonData?.detail ?? []};
    }
    return {status_code: res?.status || 500,
        data:jsonData?.data ?? []};
};

export const useSaveQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveQuery,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['query']})
        }
    })
};
