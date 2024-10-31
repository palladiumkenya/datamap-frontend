import { useMutation, useQueryClient } from "@tanstack/react-query";
import {API_URL} from "../../constants";


const addUniversalDictionaryConfig = async (data) => {
    return await fetch(`${API_URL}/config/add_dictionary_config`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

}

const testUniversalDictionaryConfig = async (data) => {

    const response = await fetch(`${API_URL}/config/test_dictionary_config`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    )
    const responseData = await response.json();
}


export const useAddUniversalDictionaryConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addUniversalDictionaryConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['universal_dictionary_config']})
        }
    })
}

export const useTestUniversalDictionaryConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: testUniversalDictionaryConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['universal_dictionary_config']})
        }
    })
}
