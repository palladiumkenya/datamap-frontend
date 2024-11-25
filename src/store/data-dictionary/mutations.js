import {useMutation, useQueryClient} from "@tanstack/react-query";
import {API_URL} from "../../constants";

const addDataDictionary = async (data) => {
    const res = await fetch(`${API_URL}/usl/data_dictionary/create_data_dictionary_usl`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return res.json();
};

const updateDataDictionaryTermUSL = async (data) => {
    const res = await fetch(`${API_URL}/usl/data_dictionary/update_data_dictionary_terms_usl/${data.term_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return res.json();
};

const syncDataDictionary = async (dataSource) => {
    const res = await fetch(`${API_URL}/data_dictionary/sync_all/${dataSource}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
};

const deleteDictionaryTermUSL = async (id) => {
    const res = await fetch(`${API_URL}/usl/data_dictionary/delete_data_dictionary_terms_usl/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
};

const deleteDictionaryUSL = async (id) => {
    const res = await fetch(`${API_URL}/usl/data_dictionary/delete_data_dictionary_usl/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
};

const publishUniversalDataDictionary = async (data) => {
    const res = await fetch(`${API_URL}/usl/data_dictionary/publish/universal_dictionary`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

const refreshUniversalDataDictionaryToken = async () => {
    const res = await fetch(`${API_URL}/usl/data_dictionary/refresh_universal_dictionary/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
}

export const useAddDataDictionary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addDataDictionary,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['data_dictionaries_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_terms_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_term_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_change_log_usl']})
        }
    })
};

export const useUpdateDataDictionaryTermUSL = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDataDictionaryTermUSL,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['data_dictionaries_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_terms_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_term_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_change_log_usl']})
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

export const useDeleteDictionaryTermUSL = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDictionaryTermUSL,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['data_dictionaries_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_terms_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_term_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_change_log_usl']})
        }
    })
};

export const useDeleteDictionaryUSL = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteDictionaryUSL,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['data_dictionaries_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_terms_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_term_usl']})
            queryClient.invalidateQueries({queryKey: ['data_dictionary_change_log_usl']})
        }
    })
};

export const usePublishUniversalDataDictionary = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: publishUniversalDataDictionary,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['data_dictionaries_usl']})
        }
    })
}

export const useRefreshUniversalDataDictionaryToken = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: refreshUniversalDataDictionaryToken,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['data_dictionary_token_usl']})
        }
    })
}
