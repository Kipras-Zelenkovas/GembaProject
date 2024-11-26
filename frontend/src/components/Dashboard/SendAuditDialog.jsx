import { Dialog } from "primereact/dialog";
import { Formik, Form, Field } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    message: Yup.string().required("Message is required"),
    user_id: Yup.string().required("Please select a user"),
});

export const SendAuditDialog = ({ visible, onHide, onSubmit, users }) => {
    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 bg-white shadow shadow-gray-500 rounded-lg"
            header={
                <div className="flex items-center gap-3 text-white rounded-t-lg">
                    <svg
                        className="w-8 h-8 fill-white"
                        viewBox="0 0 24 24"
                        fill="inherit"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M22 6.25649V17.25C22 18.4926 20.9926 19.5 19.75 19.5H4.25C3.00736 19.5 2 18.4926 2 17.25V6.23398C2 6.22372 2.00021 6.2135 2.00061 6.20334C2.01781 5.25972 2.78812 4.5 3.73592 4.5H20.2644C21.2229 4.5 22 5.27697 22.0001 6.23549C22.0001 6.24249 22.0001 6.24949 22 6.25649ZM3.5 8.187V17.25C3.5 17.6642 3.83579 18 4.25 18H19.75C20.1642 18 20.5 17.6642 20.5 17.25V8.18747L13.2873 13.2171C12.5141 13.7563 11.4866 13.7563 10.7134 13.2171L3.5 8.187ZM20.5 6.2286L20.5 6.23398V6.24336C20.4976 6.31753 20.4604 6.38643 20.3992 6.42905L12.4293 11.9867C12.1716 12.1664 11.8291 12.1664 11.5713 11.9867L3.60116 6.42885C3.538 6.38481 3.50035 6.31268 3.50032 6.23568C3.50028 6.10553 3.60577 6 3.73592 6H20.2644C20.3922 6 20.4963 6.10171 20.5 6.2286Z"
                            fill="inherit"
                        />
                    </svg>
                    <h2 className="text-xl font-semibold">Send Audit</h2>
                </div>
            }
            headerClassName="border-none p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-lg"
            contentClassName="p-6 bg-white rounded-b-lg"
        >
            <Formik
                initialValues={{
                    message: "",
                    user_id: "",
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="message"
                                className="text-gray-700 font-medium"
                            >
                                Message
                            </label>
                            <Field
                                as="textarea"
                                name="message"
                                className={`p-3 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 ${
                                    errors.message && touched.message
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="Enter your message here..."
                            />
                            {errors.message && touched.message && (
                                <span className="text-red-500 text-sm">
                                    {errors.message}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="user_id"
                                className="text-gray-700 font-medium"
                            >
                                Select User
                            </label>
                            <Field
                                as="select"
                                name="user_id"
                                className={`p-3 border rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 ${
                                    errors.user_id && touched.user_id
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            >
                                <option value="">Select a user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} {user.surname}
                                    </option>
                                ))}
                            </Field>
                            {errors.user_id && touched.user_id && (
                                <span className="text-red-500 text-sm">
                                    {errors.user_id}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={onHide}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : "Send Audit"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

SendAuditDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            surname: PropTypes.string.isRequired,
        })
    ).isRequired,
};
