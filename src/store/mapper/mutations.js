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
