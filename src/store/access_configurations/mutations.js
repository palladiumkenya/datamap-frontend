import { useMutation, useQueryClient } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const deleteAccessConfig = async (id) => {
    console.log(id)
    const res = await fetch(`${API_URL}/db_access/delete_connection/${id.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
};

export const useDeleteAccessConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteAccessConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['access_configs']})
        }
    })
};
