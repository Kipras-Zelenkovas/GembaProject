import { useEffect, useState, useRef } from "react";
import { Loader } from "../Loader";
import { useSearchParams } from "react-router-dom";
import { getQuestions } from "../../../controllers/question";
import { Dialog } from "primereact/dialog";
import { CUAnswer } from "../../../controllers/answer";
import { completeAudit } from "../../../controllers/auditUser";

export const Audit = () => {
    const [params] = useSearchParams();
    const [audit, setAudit] = useState(params.get("id"));
    const [auditUser, setAuditUser] = useState(params.get("audit_id"));
    const [questions, setQuestions] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [previewImages, setPreviewImages] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [imageScale, setImageScale] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getQuestions(audit)
            .then((res) => {
                if (res.status === 200) {
                    setQuestions(res.data);
                } else {
                    setQuestions([]);
                }
            })
            .catch((error) => {
                setQuestions([]);
                console.log(error);
            });
    }, []);

    // Reset image scale and position when closing dialog
    useEffect(() => {
        if (!selectedImage) {
            setImageScale(1);
            setImagePosition({ x: 0, y: 0 });
        }
    }, [selectedImage]);

    const handleAnswer = (data) => {
        const existingAnswerIndex = answers.findIndex(
            (a) => a.question === data.question
        );
        const newAnswer = {
            audit: audit,
            question: data.question,
            answer: data.answer,
            additionalAnswer: data.additionalAnswer,
            pictures: data.pictures || [],
        };

        if (existingAnswerIndex !== -1) {
            const updatedAnswers = [...answers];
            updatedAnswers[existingAnswerIndex] = newAnswer;
            setAnswers(updatedAnswers);
        } else {
            setAnswers([...answers, newAnswer]);
        }
    };

    const removeUploadedImage = (questionId, imageIndex) => {
        setPreviewImages((prev) => ({
            ...prev,
            [questionId]: prev[questionId].filter(
                (_, index) => index !== imageIndex
            ),
        }));
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setImageScale((prev) => Math.min(prev + 0.1, 3));
        } else {
            setImageScale((prev) => Math.max(prev - 0.1, 0.5));
        }
    };

    const handleMouseDown = (e) => {
        if (imageScale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - imagePosition.x,
                y: e.clientY - imagePosition.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && imageRef.current) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            // Calculate bounds
            const bounds = {
                x:
                    (imageRef.current.width * imageScale -
                        imageRef.current.width) /
                    2,
                y:
                    (imageRef.current.height * imageScale -
                        imageRef.current.height) /
                    2,
            };

            // Constrain movement within bounds
            const constrainedX = Math.max(-bounds.x, Math.min(bounds.x, newX));
            const constrainedY = Math.max(-bounds.y, Math.min(bounds.y, newY));

            setImagePosition({
                x: constrainedX,
                y: constrainedY,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const renderAnswerInput = (question) => {
        const currentAnswer = answers.find((a) => a.question === question.id);

        const renderImageUploadSection = () => (
            <div className="mt-6">
                <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-md border border-indigo-600 hover:bg-indigo-50 cursor-pointer">
                        <svg
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        Add Images
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const picturesPreview = files.map((file) =>
                                    URL.createObjectURL(file)
                                );

                                setPreviewImages({
                                    ...previewImages,
                                    [question.id]: picturesPreview,
                                });

                                handleAnswer({
                                    question: question.id,
                                    answer: currentAnswer?.answer || "",
                                    additionalAnswer:
                                        currentAnswer?.additionalAnswer || "",
                                    pictures: files,
                                });
                            }}
                        />
                    </label>
                    {currentAnswer?.pictures.length > 0 && (
                        <span className="text-sm text-gray-600">
                            {currentAnswer.pictures.length} image(s) uploaded
                        </span>
                    )}
                </div>

                {previewImages[question.id]?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {previewImages[question.id].map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image}
                                    alt={`Uploaded ${index + 1}`}
                                    className="w-full h-64 object-cover rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
                                    onClick={() => setSelectedImage(image)}
                                />
                                <button
                                    onClick={() =>
                                        removeUploadedImage(question.id, index)
                                    }
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );

        switch (question.answerType) {
            case "yesNo":
                return (
                    <div className="mt-4">
                        <div className="flex gap-4">
                            {["yes", "no", "na"].map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center space-x-1 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`answer-${question.id}`}
                                        value={option}
                                        checked={
                                            currentAnswer?.answer === option
                                        }
                                        onChange={(e) =>
                                            handleAnswer({
                                                question: question.id,
                                                answer: e.target.value,
                                                additionalAnswer:
                                                    currentAnswer?.additionalAnswer,
                                                pictures:
                                                    currentAnswer?.pictures,
                                            })
                                        }
                                        className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                            ${
                                                option === "yes"
                                                    ? "border-emerald-500 checked:bg-emerald-500"
                                                    : option === "no"
                                                    ? "border-red-500 checked:bg-red-500"
                                                    : "border-blue-500 checked:bg-blue-500"
                                            }`}
                                    />
                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                        {option === "na" ? "N/A" : option}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {renderImageUploadSection()}
                    </div>
                );
            case "number5":
                return (
                    <div className="mt-4">
                        <div className="flex gap-3 sm:gap-4">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`answer-${question.id}`}
                                        value={value.toString()}
                                        checked={
                                            currentAnswer?.answer ===
                                            value.toString()
                                        }
                                        onChange={(e) =>
                                            handleAnswer({
                                                question: question.id,
                                                answer: e.target.value,
                                                additionalAnswer:
                                                    currentAnswer?.additionalAnswer,
                                                pictures:
                                                    currentAnswer?.pictures,
                                            })
                                        }
                                        className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                            ${
                                                value <= 2
                                                    ? "border-red-500 checked:bg-red-500"
                                                    : value === 3
                                                    ? "border-yellow-500 checked:bg-yellow-500"
                                                    : "border-emerald-500 checked:bg-emerald-500"
                                            }`}
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {value}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {renderImageUploadSection()}
                    </div>
                );
            case "number10":
                return (
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`answer-${question.id}`}
                                        value={value.toString()}
                                        checked={
                                            currentAnswer?.answer ===
                                            value.toString()
                                        }
                                        onChange={(e) =>
                                            handleAnswer({
                                                question: question.id,
                                                answer: e.target.value,
                                                additionalAnswer:
                                                    currentAnswer?.additionalAnswer,
                                                pictures:
                                                    currentAnswer?.pictures,
                                            })
                                        }
                                        className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                            ${
                                                value <= 3
                                                    ? "border-red-500 checked:bg-red-500"
                                                    : value <= 7
                                                    ? "border-yellow-500 checked:bg-yellow-500"
                                                    : "border-emerald-500 checked:bg-emerald-500"
                                            }`}
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {value}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {renderImageUploadSection()}
                    </div>
                );
            case "yesT":
            case "noT":
                return (
                    <div className="mt-4">
                        <div className="flex gap-4">
                            <label className="flex items-center space-x-4 cursor-pointer">
                                <div className="flex flex-wrap gap-1">
                                    <input
                                        id={`answer-${question.id}-yes`}
                                        type="radio"
                                        name={`answer-${question.id}`}
                                        value={"yes"}
                                        checked={
                                            currentAnswer?.answer === "yes"
                                        }
                                        onChange={(e) =>
                                            handleAnswer({
                                                question: question.id,
                                                answer: e.target.value,
                                                additionalAnswer:
                                                    currentAnswer?.additionalAnswer,
                                                pictures:
                                                    currentAnswer?.pictures,
                                            })
                                        }
                                        className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                            ${
                                                currentAnswer?.answer === "yes"
                                                    ? "border-emerald-500 checked:bg-emerald-500"
                                                    : "border-emerald-500"
                                            }`}
                                    />
                                    <label
                                        htmlFor={`answer-${question.id}-yes`}
                                        className="text-sm font-medium text-gray-700 capitalize"
                                    >
                                        Yes
                                    </label>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <input
                                        id={`answer-${question.id}-no`}
                                        type="radio"
                                        name={`answer-${question.id}`}
                                        value={"no"}
                                        checked={currentAnswer?.answer === "no"}
                                        onChange={(e) =>
                                            handleAnswer({
                                                question: question.id,
                                                answer: e.target.value,
                                                additionalAnswer:
                                                    currentAnswer?.additionalAnswer,
                                                pictures:
                                                    currentAnswer?.pictures,
                                            })
                                        }
                                        className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-full appearance-none cursor-pointer transition-all duration-200
                                            ${
                                                currentAnswer?.answer === "no"
                                                    ? "border-red-500 checked:bg-red-500"
                                                    : "border-red-500"
                                            }`}
                                    />
                                    <label
                                        htmlFor={`answer-${question.id}-no`}
                                        className="text-sm font-medium text-gray-700 capitalize"
                                    >
                                        No
                                    </label>
                                </div>
                            </label>
                        </div>
                        {currentAnswer?.answer ===
                            (question.answerType === "yesT" ? "yes" : "no") && (
                            <textarea
                                className="w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mt-4"
                                placeholder="Additional details..."
                                value={currentAnswer?.additionalAnswer || ""}
                                onChange={(e) =>
                                    handleAnswer({
                                        question: question.id,
                                        answer: currentAnswer?.answer,
                                        additionalAnswer: e.target.value,
                                        pictures: currentAnswer?.pictures,
                                    })
                                }
                                rows={3}
                            />
                        )}
                        {renderImageUploadSection()}
                    </div>
                );
            case "text":
                return (
                    <div className="mt-4">
                        <textarea
                            className="w-full px-4 py-3 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter your answer..."
                            value={currentAnswer?.answer || ""}
                            onChange={(e) =>
                                handleAnswer({
                                    question: question.id,
                                    answer: e.target.value,
                                    additionalAnswer:
                                        currentAnswer?.additionalAnswer,
                                    pictures: currentAnswer?.pictures,
                                })
                            }
                            rows={3}
                        />
                        {renderImageUploadSection()}
                    </div>
                );
            default:
                return null;
        }
    };

    if (questions === null) {
        return <Loader />;
    }

    if (!questions.length) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg text-gray-700">
                    No questions found for this audit.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 overflow-y-auto max-h-full no-scrollbar">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{
                        width: `${(currentQuestion / questions.length) * 100}%`,
                    }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Error Alert */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md">
                        {error}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                    </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-800">
                    {questions[currentQuestion].question}
                </h2>

                {/* Question Images Grid */}
                {questions[currentQuestion].pictures?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {questions[currentQuestion].pictures.map(
                            (image, index) => (
                                <div
                                    key={index}
                                    className="relative group cursor-pointer"
                                    onClick={() =>
                                        setSelectedImage(
                                            `${
                                                import.meta.env
                                                    .VITE_BACKEND_PICTURE
                                            }${image}`
                                        )
                                    }
                                >
                                    <img
                                        src={`${
                                            import.meta.env.VITE_BACKEND_PICTURE
                                        }${image}`}
                                        alt={`Question ${
                                            currentQuestion + 1
                                        } - Image ${index + 1}`}
                                        className="w-full h-64 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg" />
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* Answer Input */}
                {renderAnswerInput(questions[currentQuestion])}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                        disabled={currentQuestion === 0}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => {
                            if (currentQuestion === questions.length - 1) {
                                if (questions.length === answers.length) {
                                    let answered = 0;
                                    for (let answer of answers) {
                                        CUAnswer({
                                            audit: answer.audit,
                                            question: answer.question,
                                            answer: answer.answer,
                                            additionalAnswer:
                                                answer.additionalAnswer,
                                            pictures: answer.pictures,
                                        })
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    setError(null);
                                                    answered++;
                                                } else {
                                                    setError(
                                                        "Failed to submit answer."
                                                    );
                                                }
                                            })
                                            .then(() => {
                                                if (
                                                    answered === answers.length
                                                ) {
                                                    completeAudit(auditUser)
                                                        .then((res) => {
                                                            if (
                                                                res.status ===
                                                                200
                                                            ) {
                                                                setError(null);
                                                                window.location.href =
                                                                    "/dashboard";
                                                            } else {
                                                                setError(
                                                                    "Failed to complete audit."
                                                                );
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            setError(
                                                                "Failed to complete audit."
                                                            );
                                                        });
                                                }
                                            })
                                            .catch((error) => {
                                                setError(
                                                    "Failed to submit answer."
                                                );
                                            });
                                    }
                                } else {
                                    setError("Please answer all questions.");
                                }
                            }
                            setCurrentQuestion(
                                currentQuestion + 1 === questions.length
                                    ? currentQuestion
                                    : currentQuestion + 1
                            );
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {currentQuestion === questions.length - 1
                            ? "Submit"
                            : "Next"}
                    </button>
                </div>
            </div>

            {/* Image Preview Dialog */}
            <Dialog
                visible={!!selectedImage}
                onHide={() => setSelectedImage(null)}
                modal
                dismissableMask
                closeOnEscape
                style={{ width: "90vw", height: "90vh" }}
                contentStyle={{ padding: 0 }}
                className="p-0"
                closable={false}
                header={
                    <div className="bg-white bg-opacity-90 p-2 rounded-t-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {Math.round(imageScale * 100)}% - Drag to pan
                                when zoomed
                            </span>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                }
            >
                <div
                    className="w-full h-full flex items-center justify-center relative overflow-hidden bg-black bg-opacity-90"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {selectedImage && (
                        <img
                            ref={imageRef}
                            src={selectedImage}
                            alt="Preview"
                            style={{
                                transform: `scale(${imageScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                                transition: isDragging
                                    ? "none"
                                    : "transform 0.4s ease-out",
                                cursor:
                                    imageScale > 1
                                        ? isDragging
                                            ? "grabbing"
                                            : "grab"
                                        : "default",
                            }}
                            className="max-w-full max-h-full object-contain"
                            draggable="false"
                        />
                    )}
                </div>
            </Dialog>
        </div>
    );
};
