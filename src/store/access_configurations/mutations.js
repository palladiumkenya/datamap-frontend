import {useMutation, useQueryClient} from "@tanstack/react-query";
import {API_URL} from "../../constants";

const deleteAccessConfig = async (id) => {

    const res = await fetch(`${API_URL}/db_access/delete_connection/${id.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
};

const updateAccessConfig = async ({id, connectionData}) => {
    const res = await fetch(`${API_URL}/db_access/update_connection/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(connectionData)
    })
    return await res.json()
}

export const useDeleteAccessConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAccessConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['access_configs']})
        }
    })
};

export const useUpdateAccessConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAccessConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['access_configs']})
        }
    })
};
