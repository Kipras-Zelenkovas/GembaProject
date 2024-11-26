import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import { CUAudit, deleteAudit } from "../../../../../controllers/audit";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    type: Yup.string().required("Type is required"),
    typeOfLocation: Yup.boolean(),
    office: Yup.string().when(["typeOfLocation"], {
        is: false,
        then: () => Yup.string().required("Office is required"),
        otherwise: () => Yup.string(),
    }),
    area: Yup.string().when(["typeOfLocation"], {
        is: true,
        then: () => Yup.string().required("Area is required"),
        otherwise: () => Yup.string(),
    }),
    line: Yup.string().when(["typeOfLocation", "area"], {
        is: (typeOfLocation, area) => typeOfLocation && area,
        then: () => Yup.string(),
        otherwise: () => Yup.string(),
    }),
    process: Yup.string().when(["typeOfLocation", "line"], {
        is: (typeOfLocation, line) => typeOfLocation && line,
        then: () => Yup.string(),
        otherwise: () => Yup.string(),
    }),
});

const AuditForm = ({ auditType, audit, plantData, onClose, onSave }) => {
    const handleSubmit = async (values) => {
        try {
            // Determine the location based on typeOfLocation
            const location = !values.typeOfLocation
                ? values.office
                : values.process || values.line || values.area;

            const res = await CUAudit({
                id: audit?.id,
                name: values.name,
                type: auditType.id,
                location: location,
                active: values.active,
            });

            if (res.status === 201) {
                onSave();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteAudit(audit.id);
            if (res.status === 200) {
                onSave();
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Determine initial location values based on audit data
    const getInitialLocationValues = (audit) => {
        if (!audit) return {};

        const location = audit.location;
        if (!location) return {};

        if (location.includes("office")) {
            return { typeOfLocation: false, office: location };
        } else {
            const values = { typeOfLocation: true };
            if (location.includes("area")) {
                values.area = location;
            } else if (location.includes("line")) {
                const line = plantData.lines.find((l) => l.id === location);
                values.area = line?.area;
                values.line = location;
            } else {
                const process = plantData.processes.find(
                    (p) => p.id === location
                );
                const line = plantData.lines.find(
                    (l) => l.id === process?.line
                );
                values.area = line?.area;
                values.line = process?.line;
                values.process = location;
            }
            return values;
        }
    };

    return (
        <Dialog
            visible={true}
            onHide={onClose}
            className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 bg-white shadow shadow-gray-500 rounded-md"
            header={
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                    {audit ? "Edit Audit" : "Create New Audit"}
                </h2>
            }
        >
            <Formik
                initialValues={{
                    name: audit?.name || "",
                    type: auditType.id,
                    active: audit?.active ?? true,
                    typeOfLocation: false,
                    office: "",
                    area: "",
                    line: "",
                    process: "",
                    ...getInitialLocationValues(audit),
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue }) => (
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
                                    placeholder="Enter audit name"
                                />
                                {errors.name && touched.name && (
                                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Location Type Toggle */}
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <Field
                                    name="typeOfLocation"
                                    type="checkbox"
                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={(e) => {
                                        setFieldValue(
                                            "typeOfLocation",
                                            e.target.checked
                                        );
                                        setFieldValue("office", "");
                                        setFieldValue("area", "");
                                        setFieldValue("line", "");
                                        setFieldValue("process", "");
                                    }}
                                />
                                <label className="text-xs sm:text-sm font-medium text-slate-700">
                                    Production Area
                                </label>
                            </div>

                            {/* Location Selection */}
                            {!values.typeOfLocation ? (
                                <div>
                                    <label
                                        htmlFor="office"
                                        className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Office
                                    </label>
                                    <Field
                                        name="office"
                                        as="select"
                                        className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                            errors.office && touched.office
                                                ? "border-red-500"
                                                : "border-slate-200"
                                        }`}
                                    >
                                        <option value="">
                                            Select an office
                                        </option>
                                        {plantData.offices.map((office) => (
                                            <option
                                                key={office.id}
                                                value={office.id}
                                            >
                                                {office.name}
                                            </option>
                                        ))}
                                    </Field>
                                    {errors.office && touched.office && (
                                        <p className="mt-1 text-xs sm:text-sm text-red-500">
                                            {errors.office}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Area Selection */}
                                    <div>
                                        <label
                                            htmlFor="area"
                                            className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                        >
                                            Area
                                        </label>
                                        <Field
                                            name="area"
                                            as="select"
                                            className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                                errors.area && touched.area
                                                    ? "border-red-500"
                                                    : "border-slate-200"
                                            }`}
                                            onChange={(e) => {
                                                setFieldValue(
                                                    "area",
                                                    e.target.value
                                                );
                                                setFieldValue("line", "");
                                                setFieldValue("process", "");
                                            }}
                                        >
                                            <option value="">
                                                Select an area
                                            </option>
                                            {plantData.areas.map((area) => (
                                                <option
                                                    key={area.id}
                                                    value={area.id}
                                                >
                                                    {area.name}
                                                </option>
                                            ))}
                                        </Field>
                                        {errors.area && touched.area && (
                                            <p className="mt-1 text-xs sm:text-sm text-red-500">
                                                {errors.area}
                                            </p>
                                        )}
                                    </div>

                                    {/* Line Selection */}
                                    {values.area && (
                                        <div>
                                            <label
                                                htmlFor="line"
                                                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                            >
                                                Line
                                            </label>
                                            <Field
                                                name="line"
                                                as="select"
                                                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                                    errors.line && touched.line
                                                        ? "border-red-500"
                                                        : "border-slate-200"
                                                }`}
                                                onChange={(e) => {
                                                    setFieldValue(
                                                        "line",
                                                        e.target.value
                                                    );
                                                    setFieldValue(
                                                        "process",
                                                        ""
                                                    );
                                                }}
                                            >
                                                <option value="">
                                                    Select a line
                                                </option>
                                                {plantData.lines
                                                    .filter(
                                                        (line) =>
                                                            line.area ===
                                                            values.area
                                                    )
                                                    .map((line) => (
                                                        <option
                                                            key={line.id}
                                                            value={line.id}
                                                        >
                                                            {line.name}
                                                        </option>
                                                    ))}
                                            </Field>
                                            {errors.line && touched.line && (
                                                <p className="mt-1 text-xs sm:text-sm text-red-500">
                                                    {errors.line}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Process Selection */}
                                    {values.line && (
                                        <div>
                                            <label
                                                htmlFor="process"
                                                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                            >
                                                Process
                                            </label>
                                            <Field
                                                name="process"
                                                as="select"
                                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value="">
                                                    Select a process
                                                </option>
                                                {plantData.processes
                                                    .filter(
                                                        (process) =>
                                                            process.line ===
                                                            values.line
                                                    )
                                                    .map((process) => (
                                                        <option
                                                            key={process.id}
                                                            value={process.id}
                                                        >
                                                            {process.name}
                                                        </option>
                                                    ))}
                                            </Field>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Active Status */}
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <Field
                                    name="active"
                                    type="checkbox"
                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label className="text-xs sm:text-sm font-medium text-slate-700">
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
                                {audit ? "Save Changes" : "Create Audit"}
                            </button>
                            {audit && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                >
                                    Delete Audit
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default AuditForm;
