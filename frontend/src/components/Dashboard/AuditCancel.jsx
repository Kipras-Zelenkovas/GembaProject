import { Form, Formik } from "formik";
import { Dialog } from "primereact/dialog";
import { cancleAudit } from "../../../controllers/auditUser";
import PropTypes from "prop-types";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    message: Yup.string()
        .required("Please provide a reason for cancellation")
        .min(10, "Message must be at least 10 characters"),
});

export const AuditCancel = ({ show, setShow, audit, updateA, setUpdateA }) => {
    return (
        <Dialog
            visible={show}
            onHide={() => setShow(false)}
            className="w-full max-w-lg shadow-md shadow-gray-500 rounded-lg"
            header={
                <div className="flex items-center gap-3 text-white rounded-t-lg">
                    <svg
                        className="w-8 h-8"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L11.999 10.9384L16.7176 6.2198C17.0105 5.92691 17.4854 5.92691 17.7782 6.2198C18.0711 6.51269 18.0711 6.98757 17.7782 7.28046L13.0597 11.999L17.7782 16.7176C18.0711 17.0105 18.0711 17.4854 17.7782 17.7782C17.4854 18.0711 17.0105 18.0711 16.7176 17.7782L11.999 13.0597L7.28033 17.7784C6.98744 18.0713 6.51256 18.0713 6.21967 17.7784C5.92678 17.4855 5.92678 17.0106 6.21967 16.7177L10.9384 11.999L6.21967 7.28033Z" />
                    </svg>
                    <h2 className="text-xl font-semibold">Cancel Audit</h2>
                </div>
            }
            headerClassName="p-4 border-none bg-gradient-to-r from-red-500 to-red-600 rounded-t-lg"
            contentClassName="p-6 bg-white rounded-b-lg"
        >
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                    {audit.audit.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Type: {audit.audit.type.name}
                </p>
            </div>

            <Formik
                initialValues={{
                    id: audit.id,
                    message: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                    try {
                        const res = await cancleAudit(values);
                        if (res.status === 200) {
                            setShow(false);
                            setUpdateA(!updateA);
                        } else {
                            setStatus({
                                error: res.message || "Failed to cancel audit",
                            });
                        }
                    } catch (err) {
                        setStatus({
                            error: err.message || "An error occurred",
                        });
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    errors,
                    touched,
                    status,
                }) => (
                    <Form className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="message"
                                className="text-gray-700 font-medium"
                            >
                                Reason for Cancellation
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={values.message}
                                onChange={handleChange}
                                className={`p-3 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 ${
                                    errors.message && touched.message
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Please provide a detailed reason for canceling this audit..."
                            />
                            {errors.message && touched.message && (
                                <span className="text-red-500 text-sm">
                                    {errors.message}
                                </span>
                            )}
                        </div>

                        {status?.error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">
                                    {status.error}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShow(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    "Cancel Audit"
                                )}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

AuditCancel.propTypes = {
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired,
    audit: PropTypes.shape({
        id: PropTypes.string.isRequired,
        audit: PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }).isRequired,
    updateA: PropTypes.bool.isRequired,
    setUpdateA: PropTypes.func.isRequired,
};
