import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import {
    CUQuestion,
    CUQuestionType,
    deleteQuestion,
} from "../../../../../controllers/question";
import * as Yup from "yup";
import { useState } from "react";

const validationSchema = Yup.object().shape({
    question: Yup.string().required("Question text is required"),
    answerType: Yup.string().required("Answer type is required"),
    triggerPoint: Yup.string().when("answerType", {
        is: (val) =>
            [
                "yesNo",
                "number5",
                "number10",
                "yesT",
                "yesN5",
                "yesN10",
                "noT",
                "noN5",
                "noN10",
            ].includes(val),
        then: () =>
            Yup.string().required(
                "Trigger point is required for this answer type"
            ),
        otherwise: () => Yup.string().notRequired(),
    }),
});

const answerTypes = [
    { value: "text", label: "Text" },
    { value: "yesNo", label: "Yes / No / N/A" },
    { value: "number5", label: "Numbers: 1-5" },
    { value: "number10", label: "Numbers: 1-10" },
    { value: "yesT", label: "Yes + Text" },
    { value: "noT", label: "No + Text" },
];

const QuestionForm = ({ question, onClose, onSave }) => {
    const [previewImages, setPreviewImages] = useState([]);

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (key !== "new_pictures") {
                    formData.append(key, values[key]);
                }
            });

            if (values.new_pictures) {
                values.new_pictures.forEach((pic) => {
                    formData.append("pictures", pic);
                });
            }

            if (question.type !== undefined) {
                CUQuestionType(formData).then((res) => {
                    if (res.status === 201) {
                        onSave();
                    }
                });
            } else {
                const res = await CUQuestion(formData);
                if (res.status === 201) {
                    onSave();
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteQuestion(question.id);
            if (res.status === 200) {
                onSave();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const renderTriggerPointOptions = (answerType) => {
        switch (answerType) {
            case "yesNo":
            case "yesT":
            case "noT":
                return (
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        {["yes", "no", "na"].map((value) => (
                            <label
                                key={value}
                                className="flex items-center gap-2"
                            >
                                <Field
                                    type="radio"
                                    name="triggerPoint"
                                    value={value}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
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
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <label
                                key={value}
                                className="flex items-center gap-2"
                            >
                                <Field
                                    type="radio"
                                    name="triggerPoint"
                                    value={value.toString()}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
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
                                <Field
                                    type="radio"
                                    name="triggerPoint"
                                    value={value.toString()}
                                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                                />
                                <span className="text-xs sm:text-sm font-medium text-slate-700">
                                    {value}
                                </span>
                            </label>
                        ))}
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
            className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 bg-white shadow shadow-gray-500 rounded-md"
            header={
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                    {question.id ? "Edit Question" : "Create New Question"}
                </h2>
            }
        >
            <Formik
                initialValues={{
                    ...question,
                    new_pictures: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form className="space-y-4 sm:space-y-6 p-3 sm:p-4">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Answer Type Selection */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                                    Answer Type
                                </label>
                                <Field
                                    name="answerType"
                                    as="select"
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select answer type</option>
                                    {answerTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </Field>
                                {errors.answerType && touched.answerType && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                                        {errors.answerType}
                                    </p>
                                )}
                            </div>

                            {/* Trigger Point Selection */}
                            {values.answerType &&
                                renderTriggerPointOptions(
                                    values.answerType
                                ) && (
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                                            Trigger Point
                                        </label>
                                        {renderTriggerPointOptions(
                                            values.answerType
                                        )}
                                        {errors.triggerPoint &&
                                            touched.triggerPoint && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-500">
                                                    {errors.triggerPoint}
                                                </p>
                                            )}
                                    </div>
                                )}

                            {/* Question Text */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                                    Question Text
                                </label>
                                <Field
                                    name="question"
                                    as="textarea"
                                    rows={4}
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your question here..."
                                />
                                {errors.question && touched.question && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                                        {errors.question}
                                    </p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                                    Images
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = Array.from(
                                            e.target.files
                                        );
                                        setPreviewImages(files);
                                        setFieldValue("new_pictures", files);
                                    }}
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* Image Previews */}
                            {(previewImages.length > 0 ||
                                values.pictures?.length > 0) && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                                    {/* New Images */}
                                    {previewImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index}`}
                                                className="w-full h-24 sm:h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = [
                                                        ...previewImages,
                                                    ];
                                                    newImages.splice(index, 1);
                                                    setPreviewImages(newImages);
                                                    setFieldValue(
                                                        "new_pictures",
                                                        newImages
                                                    );
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg
                                                    className="w-3 h-3 sm:w-4 sm:h-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Existing Images */}
                                    {values.pictures?.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <img
                                                src={`${
                                                    import.meta.env
                                                        .VITE_BACKEND_PICTURE
                                                }${image}`}
                                                alt={`Existing ${index}`}
                                                className="w-full h-24 sm:h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newPictures =
                                                        values.pictures.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        );
                                                    setFieldValue(
                                                        "pictures",
                                                        newPictures
                                                    );
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg
                                                    className="w-3 h-3 sm:w-4 sm:h-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200">
                            <button
                                type="submit"
                                className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                                {question.id
                                    ? "Save Changes"
                                    : "Create Question"}
                            </button>
                            {question.id && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                >
                                    Delete Question
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default QuestionForm;
