import { useMutation, useQueryClient } from "@tanstack/react-query";
import {API_URL} from "../../constants";


const addUniversalDictionaryConfig = async (data) => {
    console.log(data)
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

const updateUniversalDictionaryConfig = async (data) => {

    const response = await fetch(`${API_URL}/config/update_dictionary_config`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    )

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

export const useUpdateUniversalDictionaryConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateUniversalDictionaryConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['universal_dictionary_config']})
        }
    })
}
