import {useGetDQAReportDashboard} from "../../../store/dashboard/queries";
import {Skeleton} from "@mui/material";
import {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";

const PieLatestRunsDQA = () => {
    const [options, setOptions] = useState( {
        chart: {
            height: 390,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                offsetY: 0,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: false,
                    }
                },
                barLabels: {
                    enabled: true,
                    useSeriesColors: true,
                    offsetX: -8,
                    fontSize: '16px',
                    formatter: function (seriesName, opts) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                    },
                },
            }
        },
        labels: [],
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    show: false
                }
            }
        }]
    },);
    const [series, setSeries] = useState([])
    const {isLoading, error, data } = useGetDQAReportDashboard();

    useEffect(() => {
        if (data && data?.latest_per_base_report && !isLoading) {
            let labels = []
            let seriesData = []
            data?.latest_per_base_report?.forEach((item) => {
                labels.push(item.base_table_name)
                seriesData.push(((item.invalid_rows/item.total_rows) * 100).toFixed(2));
            })
            console.log(labels, seriesData)
            setOptions((prevState) => ({
                ...prevState, labels: labels
            }))
            setSeries(seriesData)
        }

    }, [data?.latest_per_base_report, isLoading]);

    if (isLoading) return <Skeleton variant="rectangular" />

    if (error) return <div>Error loading data</div>;


    return (
        <>
            <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={390}
            />
        </>
    )

}

export default PieLatestRunsDQA;
