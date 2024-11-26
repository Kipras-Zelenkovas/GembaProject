import { useEffect, useState } from "react";
import { Loader } from "../Loader";
import { Dialog } from "primereact/dialog";
import { Field, Form, Formik } from "formik";
import { CUUser, deleteUser, getUsersAdmin } from "../../../controllers/user";
import { getPlants } from "../../../controllers/plant";
import { checkAdminAccess } from "../../../controllers/auth";

export const Users = () => {
    const [plants, setPlants] = useState(null);
    const [users, setUsets] = useState(null);
    const [user, setUser] = useState(undefined);
    const [showCU, setShowCU] = useState(false);
    const [update, setUpdate] = useState(false);
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        getPlants()
            .then((res) => {
                if (res.status === 200) {
                    setPlants(res.data);
                } else {
                    setPlants([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setPlants([]);
            });

        checkAdminAccess().then((res) => {
            if (res.status === 200) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        });
    }, []);

    useEffect(() => {
        getUsersAdmin()
            .then((res) => {
                if (res.status === 200) {
                    setUsets(res.data);
                } else {
                    setUsets([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setUsets([]);
            });
    }, [update]);

    if (users === null || isAdmin === null || plants === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <div className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                            Users
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500">
                            Manage your team members and their access levels
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCU(true)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-200"
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
                        <span>Add User</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => {
                                setUser(user);
                                setShowCU(true);
                            }}
                            className="relative bg-white rounded-xl shadow-sm hover:shadow-xl p-4 sm:p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-lg sm:text-xl font-semibold text-indigo-600">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                                        {user.name} {user.surname}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100">
                                <span
                                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                        user.isAdmin
                                            ? "bg-indigo-100 text-indigo-800"
                                            : "bg-emerald-100 text-emerald-800"
                                    }`}
                                >
                                    {user.isAdmin ? "Administrator" : "User"}
                                </span>
                                <svg
                                    className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Dialog
                className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 bg-white shadow shadow-gray-500 rounded-md"
                visible={showCU}
                onHide={() => {
                    setShowCU(false);
                    setUser(undefined);
                }}
                header={
                    <div className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 border-b border-slate-200">
                        {user === undefined ? "Add New User" : "Edit User"}
                    </div>
                }
            >
                <Formik
                    initialValues={
                        user === undefined
                            ? {
                                  name: "",
                                  surname: "",
                                  email: "",
                                  password: "",
                                  isAdmin: false,
                              }
                            : user
                    }
                    onSubmit={(values) => {
                        CUUser(values)
                            .then((res) => {
                                if (res.status === 201) {
                                    setShowCU(false);
                                    setUser(undefined);
                                    setUpdate(!update);
                                } else {
                                    console.log(res);
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }}
                >
                    {({ values, errors }) => (
                        <Form className="space-y-4 sm:space-y-6 p-3 sm:p-4">
                            <div className="space-y-3 sm:space-y-4">
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
                                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="surname"
                                        className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Surname
                                    </label>
                                    <Field
                                        name="surname"
                                        type="text"
                                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter surname"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Email
                                    </label>
                                    <Field
                                        name="email"
                                        type="email"
                                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Password
                                    </label>
                                    <Field
                                        name="password"
                                        type="password"
                                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder={
                                            user
                                                ? "Leave blank to keep current"
                                                : "Enter password"
                                        }
                                    />
                                </div>
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
                                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value={null}>
                                            Select a plant
                                        </option>
                                        {plants.map((plant) => (
                                            <option
                                                key={plant.id}
                                                value={plant.id}
                                            >
                                                {plant.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>
                                {isAdmin && (
                                    <div className="flex items-center space-x-2 sm:space-x-3 pt-2">
                                        <Field
                                            name="isAdmin"
                                            type="checkbox"
                                            className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label
                                            htmlFor="isAdmin"
                                            className="text-xs sm:text-sm font-medium text-slate-700"
                                        >
                                            Grant administrator access
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200">
                                <button
                                    type="submit"
                                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium"
                                >
                                    {user === undefined
                                        ? "Create User"
                                        : "Save Changes"}
                                </button>
                                {user !== undefined && (
                                    <button
                                        onClick={() => {
                                            deleteUser(user.id)
                                                .then((res) => {
                                                    if (res.status === 200) {
                                                        setShowCU(false);
                                                        setUser(undefined);
                                                        setUpdate(!update);
                                                    } else {
                                                        console.log(res);
                                                    }
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                });
                                        }}
                                        type="button"
                                        className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium"
                                    >
                                        Delete User
                                    </button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};
