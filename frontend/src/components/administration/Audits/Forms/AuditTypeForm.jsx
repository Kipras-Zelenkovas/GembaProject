import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import { CUType, deleteType } from "../../../../../controllers/type";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    frequency: Yup.number()
        .required("Frequency is required")
        .min(1, "Frequency must be at least 1 week")
        .max(52, "Frequency cannot exceed 52 weeks"),
    plant: Yup.string().required("Plant is required"),
});

const AuditTypeForm = ({ plants, type, onClose, onSave }) => {
    const handleSubmit = async (values) => {
        try {
            const res = await CUType(values);
            if (res.status === 201) {
                onSave();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteType(type.id);
            if (res.status === 200) {
                onSave();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Dialog
            visible={true}
            onHide={onClose}
            className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 bg-white shadow shadow-gray-500 rounded-md"
            header={
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                    {type ? "Edit Audit Type" : "Create New Audit Type"}
                </h2>
            }
        >
            <Formik
                initialValues={
                    type || {
                        name: "",
                        frequency: 1,
                        active: true,
                        plant: plants[0]?.id || "",
                    }
                }
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched }) => (
                    <Form className="space-y-4 sm:space-y-6 p-3 sm:p-4">
                        <div className="space-y-3 sm:space-y-4">
                            {/* Name Field */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                >
                                    Name
                                </label>
                                <Field
                                    name="name"
                                    type="text"
                                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                        errors.name && touched.name
                                            ? "border-red-500"
                                            : "border-slate-200"
                                    }`}
                                    placeholder="Enter audit type name"
                                />
                                {errors.name && touched.name && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Frequency Field */}
                            <div>
                                <label
                                    htmlFor="frequency"
                                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                >
                                    Frequency (weeks)
                                </label>
                                <Field
                                    name="frequency"
                                    type="number"
                                    min="1"
                                    max="52"
                                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                        errors.frequency && touched.frequency
                                            ? "border-red-500"
                                            : "border-slate-200"
                                    }`}
                                />
                                {errors.frequency && touched.frequency && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                                        {errors.frequency}
                                    </p>
                                )}
                            </div>

                            {/* Plant Field */}
                            <div>
                                <label
                                    htmlFor="plant"
                                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                >
                                    Plant
                                </label>
                                <Field
                                    name="plant"
                                    as="select"
                                    className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                        errors.plant && touched.plant
                                            ? "border-red-500"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <option value="">Select a plant</option>
                                    {plants.map((plant) => (
                                        <option key={plant.id} value={plant.id}>
                                            {plant.name}
                                        </option>
                                    ))}
                                </Field>
                                {errors.plant && touched.plant && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                                        {errors.plant}
                                    </p>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <Field
                                    name="active"
                                    type="checkbox"
                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="active"
                                    className="text-xs sm:text-sm font-medium text-slate-700"
                                >
                                    Active
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200">
                            <button
                                type="submit"
                                className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                            >
                                {type ? "Save Changes" : "Create Type"}
                            </button>
                            {type && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                >
                                    Delete Type
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default AuditTypeForm;
