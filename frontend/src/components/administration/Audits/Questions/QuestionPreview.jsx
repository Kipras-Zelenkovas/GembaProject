import { Dialog } from "primereact/dialog";
import { useState } from "react";

const QuestionPreview = ({ question, onClose }) => {
    const [answer, setAnswer] = useState("");
    const [textAnswer, setTextAnswer] = useState("");

    const renderAnswerInput = () => {
        switch (question.answerType) {
            case "text":
                return (
                    <textarea
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        className="w-full h-36 px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your answer..."
                    />
                );

            case "yesNo":
                return (
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                        {["yes", "no", "na"].map((value) => (
                            <label
                                key={value}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    value={value}
                                    checked={answer === value}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                        ${
                                            value === "yes"
                                                ? "border-emerald-500 checked:bg-emerald-500"
                                                : value === "no"
                                                ? "border-red-500 checked:bg-red-500"
                                                : "border-blue-500 checked:bg-blue-500"
                                        }`}
                                />
                                <span className="text-xs sm:text-sm font-medium text-slate-700 capitalize">
                                    {value === "na" ? "N/A" : value}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case "number5":
                return (
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label
                                key={value}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    value={value}
                                    checked={answer === value.toString()}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                        ${
                                            value <= 2
                                                ? "border-red-500 checked:bg-red-500"
                                                : value === 3
                                                ? "border-yellow-500 checked:bg-yellow-500"
                                                : "border-emerald-500 checked:bg-emerald-500"
                                        }`}
                                />
                                <span className="text-xs sm:text-sm font-medium text-slate-700">
                                    {value}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case "number10":
                return (
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label
                                key={value}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="radio"
                                    name="answer"
                                    value={value}
                                    checked={answer === value.toString()}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                        ${
                                            value <= 3
                                                ? "border-red-500 checked:bg-red-500"
                                                : value <= 6
                                                ? "border-yellow-500 checked:bg-yellow-500"
                                                : "border-emerald-500 checked:bg-emerald-500"
                                        }`}
                                />
                                <span className="text-xs sm:text-sm font-medium text-slate-700">
                                    {value}
                                </span>
                            </label>
                        ))}
                    </div>
                );

            case "yesT":
            case "noT":
                return (
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-wrap gap-4 sm:gap-6">
                            {["yes", "no", "na"].map((value) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="radio"
                                        name="answer"
                                        value={value}
                                        checked={answer === value}
                                        onChange={(e) =>
                                            setAnswer(e.target.value)
                                        }
                                        className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                            ${
                                                value === "yes"
                                                    ? "border-emerald-500 checked:bg-emerald-500"
                                                    : value === "no"
                                                    ? "border-red-500 checked:bg-red-500"
                                                    : "border-blue-500 checked:bg-blue-500"
                                            }`}
                                    />
                                    <span className="text-xs sm:text-sm font-medium text-slate-700 capitalize">
                                        {value === "na" ? "N/A" : value}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {((question.answerType === "yesT" &&
                            answer === "yes") ||
                            (question.answerType === "noT" &&
                                answer === "no")) && (
                            <textarea
                                value={textAnswer}
                                onChange={(e) => setTextAnswer(e.target.value)}
                                className="w-full h-36 px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter additional details..."
                            />
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog
            visible={true}
            onHide={onClose}
            headerClassName="p-3 bg-emerald-500 text-white rounded-t-md"
            className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/3 bg-white shadow shadow-gray-500 rounded-md"
            header={
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                    Question Preview
                </h2>
            }
        >
            <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
                {/* Question Text */}
                <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-lg sm:text-xl font-medium text-slate-800">
                        {question.question}
                    </h3>
                    {question.triggerPoint && (
                        <p className="text-xs sm:text-sm text-slate-500">
                            Trigger Point: {question.triggerPoint}
                        </p>
                    )}
                </div>

                {/* Images Grid */}
                {question.pictures && question.pictures.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {question.pictures.map((image, index) => (
                            <img
                                key={index}
                                src={`${
                                    import.meta.env.VITE_BACKEND_PICTURE
                                }${image}`}
                                alt={`Question ${index + 1}`}
                                className="w-full h-24 sm:h-32 object-cover rounded-lg"
                            />
                        ))}
                    </div>
                )}

                {/* Answer Input */}
                <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-medium text-slate-700">
                        Answer
                    </label>
                    {renderAnswerInput()}
                </div>
            </div>
        </Dialog>
    );
};

export default QuestionPreview;
