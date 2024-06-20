import {useMutation, useQueryClient} from "@tanstack/react-query";

const addDataDictionary = async (data) => {
    console.log(data)
    const res = await fetch(`http://localhost:8000/api/data_dictionary/create_data_dictionary_usl`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return res.json();
};

const syncDataDictionary = async (dataSource) => {
    console.log(dataSource)
    const res = await fetch(`http://localhost:8000/api/data_dictionary/sync_all/${dataSource}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
};

export const useAddDataDictionary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addDataDictionary,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['data_dictionaries_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_terms_usl']})
        }
    })
};

export const useDataDictionarySync = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: syncDataDictionary,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['data_dictionaries']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_terms']})
        }
    })
};