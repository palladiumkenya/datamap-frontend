import { useMutation, useQueryClient } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const saveMappings = async ({baselookup,formData}) => {
    const res = fetch(`${API_URL}/dictionary_mapper/add_mapped_variables/${baselookup}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    return res;
};

export const useSaveMappings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveMappings,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['mappings']})
        }
    })
};



const testMappings = async ({baselookup,formData}) => {
    const res = await fetch(`${API_URL}/dictionary_mapper/test/mapped_variables/${baselookup}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    const jsonData = await res.json();

    return jsonData?.data ?? [];
};

export const useTestMappings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: testMappings,
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
    console.log("res", res)
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
