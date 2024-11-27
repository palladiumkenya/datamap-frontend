import { useMutation, useQueryClient } from "@tanstack/react-query";
import {API_URL} from "../../constants";

const deleteSiteConfig = async (id) => {
    console.log(id)
    const res = await fetch(`${API_URL}/site_config/delete_site_config/${id.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
};

export const useDeleteSiteConfig = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSiteConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['site_configs']})
        }
    })
};
