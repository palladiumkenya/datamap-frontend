import {useQuery} from "@tanstack/react-query";
import {API_URL} from "../../constants";


const getDQAReportDashboard = async () => {
    const res = await fetch(`${API_URL}/dqa/transformation/report`);
    const jsonData = await res.json();
    return jsonData ?? null;
};

export const useGetDQAReportDashboard = () => useQuery({
    queryKey: ['dqa_transformation_report'],
    queryFn: getDQAReportDashboard,
    refetchInterval: 1800000, // refresh every 30min
});
