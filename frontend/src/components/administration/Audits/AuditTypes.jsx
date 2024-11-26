import { useEffect, useState } from "react";
import { CUType, deleteType, getTypes } from "../../../../controllers/type";
import { getPlants } from "../../../../controllers/plant";
import { checkAdminAccess } from "../../../../controllers/auth";
import AuditTypeForm from "./Forms/AuditTypeForm";

const AuditTypes = ({ onSelectType }) => {
    const [plants, setPlants] = useState(null);
    const [auditTypes, setAuditTypes] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlant, setSelectedPlant] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if user is superadmin
        checkAdminAccess().then((res) => {
            if (res.status === 200) {
                setIsAdmin(true);
            }
        });

        getPlants()
            .then((res) => {
                if (res.status === 200) {
                    setPlants(res.data);
                } else {
                    setPlants([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setPlants([]);
            });

        getTypes()
            .then((res) => {
                if (res.status === 200) {
                    setAuditTypes(res.data);
                } else {
                    setAuditTypes([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setAuditTypes([]);
            });
    }, [updateTrigger]);

    const handleStatusChange = async (type) => {
        try {
            const res = await CUType({
                ...type,
                active: !type.active,
            });
            if (res.status === 201) {
                setUpdateTrigger(!updateTrigger);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const filteredAuditTypes = auditTypes?.filter((type) => {
        if (!isAdmin) return true; // Show all types if not admin

        const matchesSearch = type.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesPlant = !selectedPlant || type.plant.id === selectedPlant;
        return matchesSearch && matchesPlant;
    });

    if (!plants || !auditTypes) return null;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                        Audit Types
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500">
                        Manage and configure different types of audits
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    <span>New Audit Type</span>
                </button>
            </div>

            {/* Search and Filter Section - Only visible for superadmin */}
            {isAdmin && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    <div className="w-full sm:flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                            <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="w-full sm:flex-1">
                        <select
                            value={selectedPlant}
                            onChange={(e) => setSelectedPlant(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        >
                            <option value="">All Plants</option>
                            {plants.map((plant) => (
                                <option key={plant.id} value={plant.id}>
                                    {plant.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Grid of Audit Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredAuditTypes.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => onSelectType(type)}
                        className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl p-4 sm:p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex flex-col h-full">
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                                {type.name}
                            </h2>
                            <div className="flex-grow">
                                <p className="text-sm sm:text-base text-slate-500 mb-3 sm:mb-4">
                                    Frequency: {type.frequency} weeks
                                </p>
                                <p className="text-sm sm:text-base text-slate-500">
                                    Plant: {type.plant.name}
                                </p>
                            </div>
                            <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatusChange(type);
                                    }}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                                        type.active
                                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                            : "bg-red-100 text-red-800 hover:bg-red-200"
                                    }`}
                                >
                                    {type.active ? "Active" : "Inactive"}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedType(type);
                                        setShowForm(true);
                                    }}
                                    className="text-slate-400 hover:text-slate-600 p-1"
                                >
                                    <svg
                                        className="w-4 h-4 sm:w-5 sm:h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Dialog */}
            {showForm && (
                <AuditTypeForm
                    plants={plants}
                    type={selectedType}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedType(null);
                    }}
                    onSave={() => {
                        setUpdateTrigger(!updateTrigger);
                        setShowForm(false);
                        setSelectedType(null);
                    }}
                />
            )}
        </div>
    );
};

export default AuditTypes;
