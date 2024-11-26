import { useEffect, useState } from "react";
import { CUAudit, deleteAudit, getAudits } from "../../../../controllers/audit";
import { getPlantAll } from "../../../../controllers/plant";
import AuditForm from "./Forms/AuditForm";
import { Loader } from "../../Loader.jsx";
import { getTypeQuestions } from "../../../../controllers/question.js";
import QuestionPreview from "./Questions/QuestionPreview.jsx";
import QuestionForm from "./Questions/QuestionForm.jsx";

const AuditList = ({ auditType, onBack, onSelectAudit }) => {
    const [audits, setAudits] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [plantData, setPlantData] = useState({
        offices: [],
        areas: [],
        lines: [],
        processes: [],
    });
    const [filter, setFilter] = useState("");
    const [qFilter, setQFilter] = useState("");

    const [questions, setQuestions] = useState([]);
    const [showAllQuestions, setShowAllQuestions] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(undefined);
    const [showPreview, setShowPreview] = useState(false);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [auditsRes, plantRes] = await Promise.all([
                    getAudits(auditType.id),
                    getPlantAll(auditType.plant.id || auditType.plant),
                ]);

                if (auditsRes.status === 200) {
                    setAudits(auditsRes.data);
                }
                if (plantRes.status === 200) {
                    setPlantData(plantRes.data);
                }
            } catch (err) {
                console.log(err);
                setAudits([]);
            }
        };

        fetchData();
    }, [auditType, updateTrigger]);

    useEffect(() => {
        if (showAllQuestions == true) {
            setQuestions(null);
            const fetchData = async () => {
                try {
                    const res = await getTypeQuestions(auditType.id);
                    if (res.status === 200) {
                        setQuestions(res.data);
                    }
                } catch (err) {
                    console.log(err);
                    setQuestions([]);
                }
            };

            fetchData();
        }
    }, [showAllQuestions, update]);

    const getAnswerTypeLabel = (type) => {
        const types = {
            text: "Text",
            yesNo: "Yes / No / N/A",
            number5: "Numbers: 1-5",
            number10: "Numbers: 1-10",
            yesT: "Yes + Text",
            yesN5: "Yes + Numbers: 1-5",
            yesN10: "Yes + Numbers: 1-10",
            noT: "No + Text",
            noN5: "No + Numbers: 1-5",
            noN10: "No + Numbers: 1-10",
        };
        return types[type] || type;
    };

    const handleStatusChange = async (audit) => {
        try {
            const res = await CUAudit({
                ...audit,
                active: !audit.active,
            });
            if (res.status === 201) {
                setUpdateTrigger(!updateTrigger);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getLocationName = (locationId) => {
        if (!locationId) return "";

        if (locationId.includes("office")) {
            return plantData.offices.find((o) => o.id === locationId)?.name;
        }
        if (locationId.includes("area")) {
            return plantData.areas.find((a) => a.id === locationId)?.name;
        }
        if (locationId.includes("line")) {
            return plantData.lines.find((l) => l.id === locationId)?.name;
        }
        return plantData.processes.find((p) => p.id === locationId)?.name;
    };

    const filteredAudits = audits?.filter(
        (audit) =>
            audit.name.toLowerCase().includes(filter.toLowerCase()) ||
            getLocationName(audit.location)
                ?.toLowerCase()
                .includes(filter.toLowerCase())
    );

    const filteredQuestions = questions?.filter((question) =>
        question.question.toLowerCase().includes(qFilter.toLowerCase())
    );

    if (audits === null || questions == null) return <Loader />;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            {showAllQuestions == false && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <button
                            onClick={onBack}
                            className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                                {auditType.name} Audits
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500">
                                Manage audits for this type
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search audits..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
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
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
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
                            <span>New Audit</span>
                        </button>
                        <button
                            onClick={() => {
                                setQuestions(null);
                                setShowAllQuestions(true);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
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
                            <span>See question for all audits</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Audit Grid */}
            {showAllQuestions == false && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredAudits.map((audit) => (
                        <div
                            key={audit.id}
                            onClick={() => onSelectAudit(audit)}
                            className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl p-4 sm:p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                                    {audit.name}
                                </h2>
                                <div className="flex-grow">
                                    <p className="text-sm sm:text-base text-slate-500 mb-3 sm:mb-4">
                                        Location:{" "}
                                        {getLocationName(audit.location)}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(audit);
                                        }}
                                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                                            audit.active
                                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                : "bg-red-100 text-red-800 hover:bg-red-200"
                                        }`}
                                    >
                                        {audit.active ? "Active" : "Inactive"}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedAudit(audit);
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
            )}

            {showAllQuestions == true && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 sticky top-0 z-50">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => {
                                setShowAllQuestions(false);
                            }}
                            className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 sm:w-6 sm:h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                                {auditType.name} Questions
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500">
                                Manage questions for this type
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search question..."
                                value={filter}
                                onChange={(e) => setQFilter(e.target.value)}
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
                        <button
                            onClick={() =>
                                setSelectedQuestion({
                                    type: auditType.id,
                                    question: "",
                                    answerType: "",
                                    pictures: [],
                                })
                            }
                            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
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
                            <span>New Question</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Audit Grid */}
            {showAllQuestions == true && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 h-full max-h-full overflow-y-auto no-scrollbar">
                    {filteredQuestions.map((question) => (
                        <div
                            key={question.id}
                            className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl p-4 sm:p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2 line-clamp-2">
                                    {question.question}
                                </h2>
                                <div className="flex-grow">
                                    <p className="text-sm sm:text-base text-slate-500 mb-3 sm:mb-4">
                                        {getAnswerTypeLabel(
                                            question.answerType
                                        )}
                                    </p>
                                    {question.triggerPoint && (
                                        <p className="text-sm sm:text-base text-slate-500">
                                            Trigger: {question.triggerPoint}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => {
                                            setSelectedQuestion(question);
                                            setShowPreview(true);
                                        }}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedQuestion(question);
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
            )}

            {showPreview && (
                <QuestionPreview
                    question={selectedQuestion}
                    onClose={() => {
                        setShowPreview(false);
                        setSelectedQuestion(undefined);
                    }}
                />
            )}

            {selectedQuestion !== undefined && showPreview == false && (
                <QuestionForm
                    question={selectedQuestion}
                    onClose={() => {
                        setSelectedQuestion(undefined);
                        setUpdate(!update);
                    }}
                    onSave={() => {
                        setUpdateTrigger(!updateTrigger);
                        setUpdate(!update);
                        setSelectedQuestion(undefined);
                    }}
                />
            )}

            {/* Form Dialog */}
            {showForm && (
                <AuditForm
                    auditType={auditType}
                    audit={selectedAudit}
                    plantData={plantData}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedAudit(null);
                    }}
                    onSave={() => {
                        setUpdateTrigger(!updateTrigger);
                        setShowForm(false);
                        setSelectedAudit(null);
                    }}
                />
            )}
        </div>
    );
};

export default AuditList;
