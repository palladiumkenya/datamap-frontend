import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteAccessConfig = async (id) => {
    console.log(id)
    const res = await fetch(`http://localhost:8000/api/db_access/delete_connection/${id.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
};

export const useDeleteAccessConfig = () => {
    const queryClient = useQueryClient(); // Move useQueryClient inside the hook

    return useMutation({
        mutationFn: deleteAccessConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['access_configs']})
        }
    })
};
