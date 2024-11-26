import { useEffect, useState } from "react";
import { getQuestions } from "../../../../../controllers/question";
import QuestionForm from "./QuestionForm";
import QuestionPreview from "./QuestionPreview";

const QuestionList = ({ audit, onBack }) => {
    const [questions, setQuestions] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        getQuestions(audit.id)
            .then((res) => {
                if (res.status === 200) {
                    setQuestions(res.data);
                } else {
                    setQuestions([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setQuestions([]);
            });
    }, [audit.id, updateTrigger]);

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

    const filteredQuestions = questions?.filter((q) =>
        q.question.toLowerCase().includes(filter.toLowerCase())
    );

    if (!questions) return null;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
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
                            {audit.name} Questions
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500">
                            Manage audit questions and responses
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search questions..."
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
                        onClick={() => {
                            setSelectedQuestion({
                                audit: audit.id,
                                question: "",
                                answerType: "",
                                pictures: [],
                            });
                            setShowForm(true);
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
                        <span>New Question</span>
                    </button>
                </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
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
                                    {getAnswerTypeLabel(question.answerType)}
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

            {/* Question Form */}
            {showForm && (
                <QuestionForm
                    question={selectedQuestion}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedQuestion(null);
                    }}
                    onSave={() => {
                        setUpdateTrigger(!updateTrigger);
                        setShowForm(false);
                        setSelectedQuestion(null);
                    }}
                />
            )}

            {/* Question Preview */}
            {showPreview && (
                <QuestionPreview
                    question={selectedQuestion}
                    onClose={() => {
                        setShowPreview(false);
                        setSelectedQuestion(null);
                    }}
                />
            )}
        </div>
    );
};

export default QuestionList;
