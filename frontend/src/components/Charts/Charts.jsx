import { useEffect, useState } from "react";
import { getDistributed } from "../../../controllers/charts";
import { Loader } from "../Loader.jsx";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export const Charts = () => {
    const [distributed, setDistributed] = useState(null);
    const [piechartData, setPiechartData] = useState(null);
    const [tasks, setTasks] = useState(null);

    const colors = [
        "D1BDFF",
        "E2CBF7",
        "D6F6FF",
        "B3F5BC",
        "F9FFB5",
        "FFE699",
        "FCAE7C",
    ];

    useEffect(() => {
        getDistributed()
            .then((res) => {
                if (res.status === 200) {
                    setDistributed(res.data);
                    setTasks(res.tasks);

                    let piechartData = [];
                    res.data.forEach((item, index) => {
                        piechartData.push([
                            {
                                name: "Done",
                                value: item.done,
                                fill: "#16a34a",
                            },
                            {
                                name: "To be done",
                                value: item.distributed - item.done,
                                fill: "#828282",
                            },
                        ]);
                    });

                    console.log(piechartData);

                    setPiechartData(piechartData);
                } else {
                    setDistributed([]);
                    setTasks([]);
                    setPiechartData([]);
                }
            })
            .catch((err) => {
                setDistributed([]);
                setTasks([]);
                setPiechartData([]);
            });
    }, []);

    if (distributed === null || tasks === null || piechartData === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap flex-col md:flex-row w-full h-full p-4 bg-background md:justify-between max-h-full overflow-y-auto no-scrollbar gap-4">
            <div className="flex flex-col w-full md:w-[41%] gap-4 bg-white p-4 h-max md:h-full rounded-lg shadow-md shadow-gray-500">
                <p className="text-center text-gray-700 text-lg font-semibold">
                    Audits:
                </p>
                {distributed.map((item, index) => {
                    return (
                        <div
                            className="w-full p-4 h-max rounded-lg flex flex-wrap justify-between"
                            style={{
                                backgroundColor: `#${colors[index]}`,
                                boxShadow: `0 0 4px 2px #${colors[index]}`,
                            }}
                        >
                            <div className="rounded-lg">
                                <div className="text-lg font-semibold">
                                    {item.name}
                                </div>
                                <div className="text-base font-medium">
                                    Distributed: {item.distributed}
                                </div>
                                <div className="text-base font-medium">
                                    To be done: {item.distributed - item.done}
                                </div>
                                <div className="text-base font-medium">
                                    Done: {item.done}
                                </div>
                            </div>
                            <ResponsiveContainer width="20%" height="100%">
                                <PieChart data={piechartData}>
                                    <Tooltip />
                                    <Label textAnchor="center">item</Label>{" "}
                                    <Pie
                                        data={piechartData[index]}
                                        innerRadius={30}
                                        outerRadius={50}
                                        cx="50%"
                                        cy="50%"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-col w-full md:w-[58%] gap-4 bg-white p-4 h-max rounded-lg shadow-md shadow-gray-500">
                <p className="text-center text-gray-700 text-lg font-semibold">
                    Tasks:
                </p>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={tasks}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" className="text-wrap text-xs" />
                        <Tooltip />
                        <YAxis />
                        <Bar dataKey="value" fill="#16a34a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
