import { useEffect, useState } from "react";
import { Loader } from "../../Loader";
import { CUPlant, deletePlant, getPlants } from "../../../../controllers/plant";
import { getUsersDefault } from "../../../../controllers/user";
import { CUArea, deleteArea, getAreas } from "../../../../controllers/area";
import {
    CUOffice,
    deleteOffice,
    getOffices,
} from "../../../../controllers/office";
import { CULine, deleteLine, getLines } from "../../../../controllers/line";
import {
    CUProcess,
    deleteProcess,
    getProcesses,
} from "../../../../controllers/processes";

import { PlantCard } from "./PlantCard";
import { AreaCard } from "./AreaCard";
import { LineCard } from "./LineCard";
import { ProcessCard } from "./ProcessCard";
import { OfficeCard } from "./OfficeCard";
import { PlantDialog } from "./PlantDialog";
import { AreaDialog } from "./AreaDialog";
import { LineDialog } from "./LineDialog";
import { ProcessDialog } from "./ProcessDialog";
import { OfficeDialog } from "./OfficeDialog";

export const Plants = () => {
    // State management
    const [plants, setPlants] = useState(null);
    const [plant, setPlant] = useState(undefined);
    const [showPlantCU, setShowPlantCU] = useState(false);
    const [updateP, setUpdateP] = useState(false);

    const [areas, setAreas] = useState([]);
    const [area, setArea] = useState(undefined);
    const [showAreaCU, setShowAreaCU] = useState(false);
    const [updateA, setUpdateA] = useState(false);

    const [offices, setOffices] = useState([]);
    const [office, setOffice] = useState(undefined);
    const [showOfficeCU, setShowOfficeCU] = useState(false);
    const [updateO, setUpdateO] = useState(false);

    const [lines, setLines] = useState([]);
    const [line, setLine] = useState(undefined);
    const [showLineCU, setShowLineCU] = useState(false);
    const [updateL, setUpdateL] = useState(false);

    const [processes, setProcesses] = useState([]);
    const [process, setProcess] = useState(undefined);
    const [showProcessCU, setShowProcessCU] = useState(false);
    const [updatePr, setUpdatePr] = useState(false);

    const [users, setUsers] = useState(null);

    // Data fetching
    useEffect(() => {
        getUsersDefault()
            .then((res) => {
                if (res.status === 200) {
                    setUsers(res.data);
                } else {
                    setUsers([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setUsers([]);
            });
    }, []);

    useEffect(() => {
        getPlants()
            .then((res) => {
                if (res.status === 200) {
                    setPlants(res.data);
                    if (plant !== undefined) {
                        setPlant(res.data.find((p) => p.id === plant.id));
                    }
                } else {
                    setPlants([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setPlants([]);
            });
    }, [updateP]);

    useEffect(() => {
        if (plant !== undefined) {
            getAreas(plant.id)
                .then((res) => {
                    if (res.status === 200) {
                        setAreas(res.data);
                        if (area !== undefined) {
                            setArea(res.data.find((a) => a.id === area.id));
                        }
                    } else {
                        setAreas([]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setAreas([]);
                });

            getOffices(plant.id)
                .then((res) => {
                    if (res.status === 200) {
                        setOffices(res.data);
                    } else {
                        setOffices([]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setOffices([]);
                });
        }
    }, [updateA, updateO, plant]);

    useEffect(() => {
        if (area !== undefined) {
            getLines(area.id)
                .then((res) => {
                    if (res.status === 200) {
                        setLines(res.data);
                        if (line !== undefined) {
                            setLine(res.data.find((l) => l.id === line.id));
                        }
                    } else {
                        setLines([]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setLines([]);
                });
        }
    }, [updateL, area]);

    useEffect(() => {
        if (line !== undefined) {
            getProcesses(line.id)
                .then((res) => {
                    if (res.status === 200) {
                        setProcesses(res.data);
                    } else {
                        setProcesses([]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setProcesses([]);
                });
        }
    }, [updatePr, line]);

    if (plants === null || users === null) {
        return <Loader />;
    }

    // Handlers
    const handlePlantSubmit = (values) => {
        CUPlant(values).then((res) => {
            if (res.status === 201) {
                setUpdateP(!updateP);
                setShowPlantCU(false);
                setPlant(undefined);
            }
        });
    };

    const handleAreaSubmit = (values) => {
        CUArea(values).then((res) => {
            if (res.status === 201) {
                setUpdateA(!updateA);
                setShowAreaCU(false);
                setArea(undefined);
            }
        });
    };

    const handleOfficeSubmit = (values) => {
        CUOffice(values).then((res) => {
            if (res.status === 201) {
                setUpdateO(!updateO);
                setShowOfficeCU(false);
                setOffice(undefined);
            }
        });
    };

    const handleLineSubmit = (values) => {
        CULine(values).then((res) => {
            if (res.status === 201) {
                setUpdateL(!updateL);
                setShowLineCU(false);
                setLine(undefined);
            }
        });
    };

    const handleProcessSubmit = (values) => {
        CUProcess(values).then((res) => {
            if (res.status === 201) {
                setUpdatePr(!updatePr);
                setShowProcessCU(false);
                setProcess(undefined);
            }
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 max-h-full overflow-y-auto no-scrollbar">
            {/* Plants View */}
            {!plant && (
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                                Factories
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500">
                                Manage your factories, areas, lines and
                                processes
                            </p>
                        </div>
                        <button
                            onClick={() => setShowPlantCU(true)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
                        >
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span>Add Factory</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                        {plants.map((plant) => (
                            <PlantCard
                                key={plant.id}
                                plant={plant}
                                users={users}
                                onClick={() => setPlant(plant)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Plant Detail View */}
            {plant && !area && (
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={() => setPlant(undefined)}
                                className="p-1.5 sm:p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                                    {plant.name}
                                </h1>
                                <p className="text-sm sm:text-base text-slate-500">
                                    Manage areas, lines and processes
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
                            <button
                                onClick={() => setShowPlantCU(true)}
                                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                Edit Factory
                            </button>
                            <button
                                onClick={() => setShowAreaCU(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-200"
                            >
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span>Add Area</span>
                            </button>
                            <button
                                onClick={() => setShowOfficeCU(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-200"
                            >
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span>Add Office</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">
                                Areas
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                                {areas.map((area) => (
                                    <AreaCard
                                        key={area.id}
                                        area={area}
                                        users={users}
                                        onClick={() => setArea(area)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">
                                Offices
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                                {offices.map((office) => (
                                    <OfficeCard
                                        key={office.id}
                                        office={office}
                                        users={users}
                                        onClick={() => {
                                            setOffice(office);
                                            setShowOfficeCU(true);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Area Detail View */}
            {area && !line && (
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={() => setArea(undefined)}
                                className="p-1.5 sm:p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                                    {area.name}
                                </h1>
                                <p className="text-sm sm:text-base text-slate-500">
                                    Manage production lines and processes
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
                            <button
                                onClick={() => setShowAreaCU(true)}
                                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                                Edit Area
                            </button>
                            <button
                                onClick={() => setShowLineCU(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-200"
                            >
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span>Add Line</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">
                            Production Lines
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                            {lines.map((line) => (
                                <LineCard
                                    key={line.id}
                                    line={line}
                                    users={users}
                                    onClick={() => setLine(line)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Line Detail View */}
            {line && (
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button
                                onClick={() => setLine(undefined)}
                                className="p-1.5 sm:p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                                    {line.name}
                                </h1>
                                <p className="text-sm sm:text-base text-slate-500">
                                    Manage production processes
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
                            <button
                                onClick={() => setShowLineCU(true)}
                                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                Edit Line
                            </button>
                            <button
                                onClick={() => setShowProcessCU(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-200"
                            >
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span>Add Process</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">
                            Processes
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                            {processes.map((process) => (
                                <ProcessCard
                                    key={process.id}
                                    process={process}
                                    users={users}
                                    onClick={() => {
                                        setProcess(process);
                                        setShowProcessCU(true);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <PlantDialog
                visible={showPlantCU}
                onHide={() => {
                    setShowPlantCU(false);
                }}
                plant={plant}
                users={users}
                onSubmit={handlePlantSubmit}
                onDelete={() => {
                    deletePlant(plant.id).then((res) => {
                        if (res.status === 200) {
                            setUpdateP(!updateP);
                            setShowPlantCU(false);
                            setPlant(undefined);
                        }
                    });
                }}
            />

            <AreaDialog
                visible={showAreaCU}
                onHide={() => {
                    setShowAreaCU(false);
                }}
                area={area}
                users={users}
                plantId={plant?.id}
                onSubmit={handleAreaSubmit}
                onDelete={() => {
                    deleteArea(area.id).then((res) => {
                        if (res.status === 200) {
                            setUpdateA(!updateA);
                            setShowAreaCU(false);
                            setArea(undefined);
                        }
                    });
                }}
            />

            <OfficeDialog
                visible={showOfficeCU}
                onHide={() => {
                    setShowOfficeCU(false);
                    setOffice(undefined);
                }}
                office={office}
                users={users}
                plantId={plant?.id}
                onSubmit={handleOfficeSubmit}
                onDelete={() => {
                    deleteOffice(office.id).then((res) => {
                        if (res.status === 200) {
                            setUpdateO(!updateO);
                            setShowOfficeCU(false);
                            setOffice(undefined);
                        }
                    });
                }}
            />

            <LineDialog
                visible={showLineCU}
                onHide={() => {
                    setShowLineCU(false);
                }}
                line={line}
                users={users}
                areaId={area?.id}
                onSubmit={handleLineSubmit}
                onDelete={() => {
                    deleteLine(line.id).then((res) => {
                        if (res.status === 200) {
                            setUpdateL(!updateL);
                            setShowLineCU(false);
                            setLine(undefined);
                        }
                    });
                }}
            />

            <ProcessDialog
                visible={showProcessCU}
                onHide={() => {
                    setShowProcessCU(false);
                }}
                process={process}
                users={users}
                lineId={line?.id}
                onSubmit={handleProcessSubmit}
                onDelete={() => {
                    deleteProcess(process.id).then((res) => {
                        if (res.status === 200) {
                            setUpdatePr(!updatePr);
                            setShowProcessCU(false);
                            setProcess(undefined);
                        }
                    });
                }}
            />
        </div>
    );
};
