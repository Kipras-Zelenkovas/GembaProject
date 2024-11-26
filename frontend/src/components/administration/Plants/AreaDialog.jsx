import React from "react";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";

export const AreaDialog = ({
    visible,
    onHide,
    area,
    users,
    plantId,
    onSubmit,
    onDelete,
}) => {
    return (
        <Dialog
            visible={visible}
            onHide={onHide}
            className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 bg-white shadow shadow-gray-500 rounded-md"
            header={
                <div className="text-lg sm:text-xl font-semibold text-slate-800 pb-2">
                    {area === undefined ? "Add New Area" : "Edit Area"}
                </div>
            }
        >
            <Formik
                initialValues={
                    area === undefined
                        ? { name: "", supervisor: "", plant: plantId }
                        : area
                }
                onSubmit={onSubmit}
            >
                {({ values }) => (
                    <Form className="space-y-4 sm:space-y-6 p-3 sm:p-4">
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                >
                                    Area Name
                                </label>
                                <Field
                                    name="name"
                                    type="text"
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter area name"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="supervisor"
                                    className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                >
                                    Supervisor
                                </label>
                                <Field
                                    name="supervisor"
                                    as="select"
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">
                                        Select a supervisor
                                    </option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} {user.surname}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200">
                            <button
                                type="submit"
                                className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium"
                            >
                                {area === undefined
                                    ? "Create Area"
                                    : "Save Changes"}
                            </button>
                            {area !== undefined && (
                                <button
                                    onClick={onDelete}
                                    type="button"
                                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium"
                                >
                                    Delete Area
                                </button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
