import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Dialog } from "primereact/dialog";

import { CUTask, getTasks } from "../../../controllers/task";
import { Loader } from "../Loader.jsx";
import { getUsersDefault } from "../../../controllers/user.js";
import {
    checkAdminAccess,
    checkPlantAdminAccess,
} from "../../../controllers/auth.js";

export const Tasks = () => {
    const [tasks, setTasks] = useState(null);
    const [users, setUsers] = useState(null);
    const [task, setTask] = useState(undefined);

    const [filter, setFilter] = useState("");

    const [picture, setPicture] = useState(undefined);
    const [showCU, setShowCU] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [update, setUpdate] = useState(false);

    const [editDSP, setEditDSP] = useState(false);
    const [editAM, setEditAM] = useState(false);

    const [admin, setAdmin] = useState(undefined);
    const [plantA, setPlantA] = useState(undefined);

    useEffect(() => {
        getUsersDefault()
            .then((res) => {
                if (res.status === 200) {
                    setUsers(res.data);
                } else {
                    setUsers([]);
                }
            })
            .catch((error) => {
                setUsers([]);
            });

        checkAdminAccess()
            .then((res) => {
                if (res.status === 200) {
                    setAdmin(true);
                } else {
                    setAdmin(false);
                }
            })
            .catch((error) => {
                setAdmin(false);
            });

        checkPlantAdminAccess()
            .then((res) => {
                if (res.status === 200) {
                    setPlantA(true);
                } else {
                    setPlantA(false);
                }
            })
            .catch((error) => {
                setPlantA(false);
            });
    }, []);

    useEffect(() => {
        getTasks()
            .then((res) => {
                if (res.status === 200) {
                    setTasks(res.data);
                } else {
                    setTasks([]);
                }
            })
            .catch((error) => {
                setTasks([]);
                console.error(error);
            });
    }, [update]);

    if (tasks === null || users === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {task === undefined && (
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                                Tasks
                            </h1>
                            <p className="text-sm sm:text-base text-slate-500">
                                Manage your plants tasks
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                onClick={() => {
                                    setTask(task);
                                    // setShowCU(true);
                                }}
                                className="relative bg-white rounded-xl shadow-sm hover:shadow-xl p-4 sm:p-6 cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                                            {task.location}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500">
                                            Submited by:{" "}
                                            {task.answer.user.name +
                                                " " +
                                                task.answer.user.surname}
                                        </p>
                                        <p className="text-xs sm:text-sm text-slate-500">
                                            Responsible:{" "}
                                            {users.find(
                                                (user) =>
                                                    user.id === task.responsible
                                            ).name +
                                                " " +
                                                users.find(
                                                    (user) =>
                                                        user.id ===
                                                        task.responsible
                                                ).surname}
                                        </p>
                                        <p className="text-xs sm:text-sm text-slate-500 capitalize">
                                            Answer: {task.answer.answer}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100">
                                    <span
                                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                            task.status === "unconfirmed"
                                                ? "bg-indigo-100 text-indigo-800"
                                                : task.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : task.status === "in-progress"
                                                ? "bg-orange-100 text-orange-800"
                                                : task.status === "completed"
                                                ? "bg-primary-100 text-primary-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {task.status}
                                    </span>
                                    <div className="flex flex-wrap">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCU(true);
                                                setTask(task);
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
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {task !== undefined && showCU == false && (
                <Formik
                    initialValues={task}
                    onSubmit={(values) => {
                        CUTask({
                            id: task.id,
                            actionsTaken: values.actionsTaken,
                            additionalMembers: values.additionalMembers,
                            answer: values.answer.id,
                            dueDate: values.dueDate,
                            notes: values.notes,
                            priority: values.priority,
                            responsible: values.responsible,
                            status: values.status,
                        })
                            .then((res) => {
                                if (res.status === 200) {
                                    setUpdate(!update);
                                    setTask(undefined);
                                    setEditAM(false);
                                    setEditDSP(false);
                                } else {
                                    console.error(res);
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }}
                    className="p-4 sm:p-6 md:p-8"
                >
                    {({ values, errors }) => (
                        <Form className="space-y-4 sm:space-y-6 p-3 sm:p-4">
                            <div className="flex flex-wrap w-full h-auto p-1 items-center gap-2 justify-between border-b-2 border-slate-200">
                                <div className="flex flex-wrap w-full md:w-auto h-auto items-center justify-between">
                                    <div className="flex flex-wrap w-auto h-auto gap-1">
                                        <button type="submit">
                                            <svg
                                                type="submit"
                                                className="w-6 h-6 cursor-pointer hover:scale-110 transition-all duration-200 ease-in-out"
                                                width="80"
                                                height="80"
                                                viewBox="0 0 25 25"
                                                fill="#343C54"
                                                transform="rotate(0 0 0)"
                                            >
                                                <path
                                                    d="M13.7335 6.78033C14.0263 6.48744 14.0263 6.01256 13.7335 5.71967C13.4406 5.42678 12.9657 5.42678 12.6728 5.71967L6.42279 11.9697C6.1299 12.2626 6.1299 12.7374 6.42279 13.0303L12.6728 19.2803C12.9657 19.5732 13.4406 19.5732 13.7335 19.2803C14.0263 18.9874 14.0263 18.5126 13.7335 18.2197L8.01379 12.5L13.7335 6.78033Z"
                                                    fill="#343C54"
                                                />
                                                <path
                                                    d="M18.2335 6.78033C18.5263 6.48744 18.5263 6.01256 18.2335 5.71967C17.9406 5.42678 17.4657 5.42678 17.1728 5.71967L10.9228 11.9697C10.6299 12.2626 10.6299 12.7374 10.9228 13.0303L17.1728 19.2803C17.4657 19.5732 17.9406 19.5732 18.2335 19.2803C18.5263 18.9874 18.5263 18.5126 18.2335 18.2197L12.5138 12.5L18.2335 6.78033Z"
                                                    fill="#343C54"
                                                />
                                            </svg>
                                        </button>

                                        <p className="text-lg text-gray-700 font-semibold">
                                            Task details
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap w-auto h-auto gap-1">
                                        <svg
                                            onClick={() => {
                                                setEditDSP(!editDSP);
                                            }}
                                            className="block md:hidden w-6 h-6 hover:scale-110 cursor-pointer transition-all duration-200 ease-in-out"
                                            width="80"
                                            height="80"
                                            viewBox="0 0 24 24"
                                            fill="#343C54"
                                            transform="rotate(0 0 0)"
                                        >
                                            <path
                                                d="M20.8749 2.51272C20.1915 1.8293 19.0835 1.8293 18.4001 2.51272L13.2418 7.67095C12.879 8.03379 12.6511 8.50974 12.5959 9.0199L12.4069 10.7668C12.3824 10.9926 12.4616 11.2173 12.6222 11.3778C12.7827 11.5384 13.0074 11.6176 13.2332 11.5931L14.9801 11.4041C15.4903 11.3489 15.9662 11.121 16.3291 10.7582L21.4873 5.59994C22.1707 4.91652 22.1707 3.80848 21.4873 3.12506L20.8749 2.51272ZM18.5981 4.43601L19.564 5.40191L15.2684 9.69751C15.1474 9.81846 14.9888 9.89443 14.8187 9.91283L13.9984 10.0016L14.0872 9.18126C14.1056 9.01121 14.1815 8.85256 14.3025 8.73161L18.5981 4.43601Z"
                                                fill="#343C54"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                d="M5.5 3.25H15.5411L14.0411 4.75H5.5C5.08579 4.75 4.75 5.08579 4.75 5.5V18.5C4.75 18.9142 5.08579 19.25 5.5 19.25H18.5C18.9142 19.25 19.25 18.9142 19.25 18.5V9.95823L20.75 8.45823V18.5C20.75 19.7426 19.7426 20.75 18.5 20.75H5.5C4.25736 20.75 3.25 19.7426 3.25 18.5V5.5C3.25 4.25736 4.25736 3.25 5.5 3.25Z"
                                                fill="#343C54"
                                            />
                                        </svg>
                                        {!editDSP ? (
                                            <div className="flex flex-wrap w-auto h-auto gap-2 items-center">
                                                <div
                                                    className={`
                                    px-3 py-1 rounded-full text-sm font-medium capitalize block md:hidden ${
                                        values.status === "unconfirmed"
                                            ? "bg-indigo-100 text-indigo-800"
                                            : values.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : values.status === "in-progress"
                                            ? "bg-orange-100 text-orange-800"
                                            : values.status === "completed"
                                            ? "bg-primary-100 text-primary-800"
                                            : "bg-red-100 text-red-800"
                                    }
                                `}
                                                >
                                                    {values.status}
                                                </div>
                                                <div
                                                    className={`
                                    px-3 py-1 rounded-full text-sm font-medium capitalize block md:hidden ${
                                        values.priority === "low"
                                            ? "bg-green-100 text-green-800"
                                            : values.priority === "medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }
                                `}
                                                >
                                                    {values.priority}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap w-auto h-auto gap-2 items-center">
                                                <Field
                                                    as="select"
                                                    name="status"
                                                    className="block md:hidden w-20 py-1 text-sm text-slate-500 rounded-lg focus:ring-2 shadow shadow-slate-400 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                >
                                                    {plantA
                                                        ? [
                                                              "select status",
                                                              "unconfirmed",
                                                              "pending",
                                                              "in-progress",
                                                              "completed",
                                                              "rejected",
                                                          ].map((status) => (
                                                              <option
                                                                  key={status}
                                                                  value={status}
                                                              >
                                                                  {status}
                                                              </option>
                                                          ))
                                                        : [
                                                              "select status",
                                                              "pending",
                                                              "in-progress",
                                                              "completed",
                                                          ].map((status) => (
                                                              <option
                                                                  key={status}
                                                                  value={status}
                                                              >
                                                                  {status}
                                                              </option>
                                                          ))}
                                                </Field>
                                                <Field
                                                    as="select"
                                                    name="priority"
                                                    className="block md:hidden w-auto py-1 text-sm text-slate-500 rounded-lg focus:ring-2 shadow shadow-slate-400 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                                >
                                                    {[
                                                        "select priority",
                                                        "low",
                                                        "medium",
                                                        "high",
                                                    ].map((status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    ))}
                                                </Field>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap md:w-auto w-full justify-end h-auto items-center gap-2">
                                    <svg
                                        onClick={() => {
                                            setEditDSP(!editDSP);
                                        }}
                                        className="hidden md:block w-6 h-6 hover:scale-110 cursor-pointer transition-all duration-200 ease-in-out"
                                        width="80"
                                        height="80"
                                        viewBox="0 0 24 24"
                                        fill="#343C54"
                                        transform="rotate(0 0 0)"
                                    >
                                        <path
                                            d="M20.8749 2.51272C20.1915 1.8293 19.0835 1.8293 18.4001 2.51272L13.2418 7.67095C12.879 8.03379 12.6511 8.50974 12.5959 9.0199L12.4069 10.7668C12.3824 10.9926 12.4616 11.2173 12.6222 11.3778C12.7827 11.5384 13.0074 11.6176 13.2332 11.5931L14.9801 11.4041C15.4903 11.3489 15.9662 11.121 16.3291 10.7582L21.4873 5.59994C22.1707 4.91652 22.1707 3.80848 21.4873 3.12506L20.8749 2.51272ZM18.5981 4.43601L19.564 5.40191L15.2684 9.69751C15.1474 9.81846 14.9888 9.89443 14.8187 9.91283L13.9984 10.0016L14.0872 9.18126C14.1056 9.01121 14.1815 8.85256 14.3025 8.73161L18.5981 4.43601Z"
                                            fill="#343C54"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                        />
                                        <path
                                            d="M5.5 3.25H15.5411L14.0411 4.75H5.5C5.08579 4.75 4.75 5.08579 4.75 5.5V18.5C4.75 18.9142 5.08579 19.25 5.5 19.25H18.5C18.9142 19.25 19.25 18.9142 19.25 18.5V9.95823L20.75 8.45823V18.5C20.75 19.7426 19.7426 20.75 18.5 20.75H5.5C4.25736 20.75 3.25 19.7426 3.25 18.5V5.5C3.25 4.25736 4.25736 3.25 5.5 3.25Z"
                                            fill="#343C54"
                                        />
                                    </svg>

                                    {!editDSP ? (
                                        <div className="flex flex-wrap w-auto h-auto gap-2 items-center">
                                            <div className="text-sm font-medium text-slate-500">
                                                Due date:{" "}
                                                {values.dueDate !== null &&
                                                values.dueDate !== undefined
                                                    ? values.dueDate.split(
                                                          "T"
                                                      )[0]
                                                    : "-"}
                                            </div>
                                            <div
                                                className={`
                                    px-3 py-1 rounded-full text-sm font-medium capitalize hidden md:block ${
                                        values.status === "unconfirmed"
                                            ? "bg-indigo-100 text-indigo-800"
                                            : values.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : values.status === "in-progress"
                                            ? "bg-orange-100 text-orange-800"
                                            : values.status === "completed"
                                            ? "bg-primary-100 text-primary-800"
                                            : "bg-red-100 text-red-800"
                                    }
                                `}
                                            >
                                                {values.status}
                                            </div>
                                            <div
                                                className={`
                                    px-3 py-1 rounded-full text-sm font-medium capitalize hidden md:block ${
                                        values.priority === "low"
                                            ? "bg-green-100 text-green-800"
                                            : values.priority === "medium"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }
                                `}
                                            >
                                                {values.priority}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap w-auto h-auto gap-2 items-center">
                                            <Field
                                                name="dueDate"
                                                type="date"
                                                className="w-auto px-3 py-1 text-sm text-slate-500 rounded-lg focus:ring-2 shadow shadow-slate-400 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            />
                                            <Field
                                                as="select"
                                                name="status"
                                                className="hidden md:block w-auto px-3 py-1 text-sm text-slate-500 rounded-lg focus:ring-2 shadow shadow-slate-400 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            >
                                                {[
                                                    "unconfirmed",
                                                    "pending",
                                                    "in-progress",
                                                    "completed",
                                                    "rejected",
                                                ].map((status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>
                                                ))}
                                            </Field>
                                            <Field
                                                as="select"
                                                name="priority"
                                                className="hidden md:block w-auto px-3 py-1 text-sm text-slate-500 rounded-lg focus:ring-2 shadow shadow-slate-400 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            >
                                                {["low", "medium", "high"].map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    )
                                                )}
                                            </Field>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap w-full h-auto justify-between">
                                <div className="w-full sm:w-1/2 p-4">
                                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 border-b border-slate-200">
                                        Task details
                                    </h2>
                                    <div className="flex flex-col md:flex-row md:flex-wrap gap-2">
                                        <p className="w-full md:w-[48%] text-sm sm:text-base text-slate-500">
                                            Location: {values.location}
                                        </p>
                                        <p className="w-full md:w-[48%] text-sm sm:text-base text-slate-500">
                                            Responsible:{" "}
                                            {users.find(
                                                (user) =>
                                                    user.id ===
                                                    values.responsible
                                            ).name +
                                                " " +
                                                users.find(
                                                    (user) =>
                                                        user.id ===
                                                        values.responsible
                                                ).surname}
                                        </p>
                                        <div className="flex flex-wrap w-full gap-2">
                                            <svg
                                                onClick={() => {
                                                    setEditAM(!editAM);
                                                }}
                                                className="w-6 h-6 hover:scale-110 cursor-pointer transition-all duration-200 ease-in-out"
                                                width="80"
                                                height="80"
                                                viewBox="0 0 24 24"
                                                fill="#343C54"
                                                transform="rotate(0 0 0)"
                                            >
                                                <path
                                                    d="M20.8749 2.51272C20.1915 1.8293 19.0835 1.8293 18.4001 2.51272L13.2418 7.67095C12.879 8.03379 12.6511 8.50974 12.5959 9.0199L12.4069 10.7668C12.3824 10.9926 12.4616 11.2173 12.6222 11.3778C12.7827 11.5384 13.0074 11.6176 13.2332 11.5931L14.9801 11.4041C15.4903 11.3489 15.9662 11.121 16.3291 10.7582L21.4873 5.59994C22.1707 4.91652 22.1707 3.80848 21.4873 3.12506L20.8749 2.51272ZM18.5981 4.43601L19.564 5.40191L15.2684 9.69751C15.1474 9.81846 14.9888 9.89443 14.8187 9.91283L13.9984 10.0016L14.0872 9.18126C14.1056 9.01121 14.1815 8.85256 14.3025 8.73161L18.5981 4.43601Z"
                                                    fill="#343C54"
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                />
                                                <path
                                                    d="M5.5 3.25H15.5411L14.0411 4.75H5.5C5.08579 4.75 4.75 5.08579 4.75 5.5V18.5C4.75 18.9142 5.08579 19.25 5.5 19.25H18.5C18.9142 19.25 19.25 18.9142 19.25 18.5V9.95823L20.75 8.45823V18.5C20.75 19.7426 19.7426 20.75 18.5 20.75H5.5C4.25736 20.75 3.25 19.7426 3.25 18.5V5.5C3.25 4.25736 4.25736 3.25 5.5 3.25Z"
                                                    fill="#343C54"
                                                />
                                            </svg>
                                            {!editAM ? (
                                                <p className="text-sm sm:text-base text-slate-500">
                                                    Additional members:{" "}
                                                    {values.additionalMembers !=
                                                        undefined &&
                                                        values.additionalMembers.map(
                                                            (member) => {
                                                                return (
                                                                    users.find(
                                                                        (
                                                                            user
                                                                        ) =>
                                                                            user.id ===
                                                                            member
                                                                    ).name +
                                                                    " " +
                                                                    users.find(
                                                                        (
                                                                            user
                                                                        ) =>
                                                                            user.id ===
                                                                            member
                                                                    ).surname +
                                                                    ", "
                                                                );
                                                            }
                                                        )}
                                                </p>
                                            ) : (
                                                <div className="w-full pr-6 flex flex-col gap-1">
                                                    <input
                                                        onChange={(e) => {
                                                            setFilter(
                                                                e.target.value
                                                            );
                                                        }}
                                                        name=""
                                                        id=""
                                                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                                    />

                                                    <div className="grid grid-cols-2 px-1">
                                                        {users.map((user) => {
                                                            return user.name
                                                                .toLowerCase()
                                                                .includes(
                                                                    filter.toLowerCase()
                                                                ) ||
                                                                user.surname
                                                                    .toLowerCase()
                                                                    .includes(
                                                                        filter.toLowerCase()
                                                                    ) ? (
                                                                <div className="flex flex-wrap w-auto">
                                                                    <Field
                                                                        id={
                                                                            user.id
                                                                        }
                                                                        key={
                                                                            user.id
                                                                        }
                                                                        name="additionalMembers"
                                                                        type="checkbox"
                                                                        value={
                                                                            user.id
                                                                        }
                                                                        className="mr-2 cursor-pointer"
                                                                    />
                                                                    <label
                                                                        htmlFor={
                                                                            user.id
                                                                        }
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {user.name +
                                                                            " " +
                                                                            user.surname}
                                                                    </label>
                                                                </div>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full sm:w-1/2 p-4 flex flex-wrap gap-2">
                                    <div className="flex flex-col w-full">
                                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 border-b border-slate-200">
                                            Answer
                                        </h2>
                                        <p className="text-sm sm:text-base text-slate-500">
                                            {task.answer.additionalAnswer}
                                        </p>
                                    </div>
                                    {task.answer.pictures.length > 0 ? (
                                        <div className="flex flex-wrap w-full h-auto gap-2">
                                            {task.answer.pictures.map(
                                                (picture) => (
                                                    <img
                                                        onClick={() => {
                                                            setPicture(picture);
                                                        }}
                                                        key={picture}
                                                        src={
                                                            import.meta.env
                                                                .VITE_BACKEND_PICTURE_ANSWER +
                                                            picture
                                                        }
                                                        alt="task"
                                                        className="w-20 h-20 rounded-md shadow-md cursor-pointer"
                                                    />
                                                )
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="w-full md:w-[48%] p-4 pt-0">
                                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 ">
                                        Actions taken
                                    </h2>
                                    <textarea
                                        onChange={(e) => {
                                            values.actionsTaken =
                                                e.target.value;
                                        }}
                                        name=""
                                        id=""
                                        className="
                                    w-full h-36 px-3 sm:px-4 py-2 text-sm sm:text-base  rounded-lg focus:ring-2 shadow shadow-slate-400 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                    >
                                        {values.actionsTaken}
                                    </textarea>
                                </div>
                                <div className="w-full md:w-[48%] p-4 pt-0">
                                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 ">
                                        Notes
                                    </h2>
                                    <textarea
                                        onChange={(e) => {
                                            values.notes = e.target.value;
                                        }}
                                        name=""
                                        id=""
                                        className="
                                    w-full h-36 px-3 sm:px-4 py-2 text-sm sm:text-base  rounded-lg focus:ring-2 shadow shadow-slate-400 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                    >
                                        {values.notes}
                                    </textarea>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}

            <Dialog
                className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 bg-white shadow shadow-gray-500 rounded-md"
                visible={picture !== undefined}
                onHide={() => {
                    setPicture(undefined);
                }}
                header={
                    <div className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 border-b border-slate-200">
                        Picture
                    </div>
                }
            >
                <img
                    src={import.meta.env.VITE_BACKEND_PICTURE_ANSWER + picture}
                    alt="task"
                    className="w-full h-auto"
                />
            </Dialog>

            {admin || plantA ? (
                <Dialog
                    className="w-[95%] sm:w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 bg-white shadow shadow-gray-500 rounded-md"
                    visible={showCU}
                    onHide={() => {
                        setShowCU(false);
                        setTask(undefined);
                        setShowAnswer(false);
                    }}
                    header={
                        <div className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 border-b border-slate-200">
                            Update task
                        </div>
                    }
                >
                    {!showAnswer ? (
                        <Formik
                            initialValues={task}
                            onSubmit={(values) => {
                                CUTask({
                                    id: task.id,
                                    actionsTaken: values.actionsTaken,
                                    additionalMembers: values.additionalMembers,
                                    answer: values.answer.id,
                                    dueDate: values.dueDate,
                                    notes: values.notes,
                                    priority: values.priority,
                                    responsible: values.responsible,
                                    status: values.status,
                                })
                                    .then((res) => {
                                        if (res.status === 200) {
                                            setUpdate(!update);
                                            setShowCU(false);
                                        } else {
                                            console.error(res);
                                        }
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    });
                            }}
                        >
                            {({ values, errors }) => (
                                <Form className="space-y-4 sm:space-y-6 p-3 sm:p-4">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label
                                                htmlFor="status"
                                                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                            >
                                                Status
                                            </label>
                                            <Field
                                                name="status"
                                                as="select"
                                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            >
                                                {[
                                                    "unconfirmed",
                                                    "pending",
                                                    "in-progress",
                                                    "completed",
                                                    "rejected",
                                                ].map((status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {status}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="priority"
                                                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                            >
                                                Priority
                                            </label>
                                            <Field
                                                name="priority"
                                                as="select"
                                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option name="" id="">
                                                    Select priority
                                                </option>
                                                {["low", "medium", "high"].map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    )
                                                )}
                                            </Field>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="dueDate"
                                                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                            >
                                                Due date
                                            </label>
                                            <Field
                                                name="dueDate"
                                                type="date"
                                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="responsible"
                                                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                            >
                                                Responsible
                                            </label>
                                            <Field
                                                name="responsible"
                                                as="select"
                                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            >
                                                <option value={null}>
                                                    Select a responsible
                                                </option>
                                                {users.map((user) => (
                                                    <option
                                                        key={user.id}
                                                        value={user.id}
                                                    >
                                                        {user.name +
                                                            " " +
                                                            user.surname}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label
                                                htmlFor="additionalMembers"
                                                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
                                            >
                                                Additionals
                                            </label>
                                            <input
                                                onChange={(e) => {
                                                    setFilter(e.target.value);
                                                }}
                                                name=""
                                                id=""
                                                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            />

                                            <div className="grid grid-cols-2 px-1">
                                                {users.map((user) => {
                                                    return user.name
                                                        .toLowerCase()
                                                        .includes(
                                                            filter.toLowerCase()
                                                        ) ||
                                                        user.surname
                                                            .toLowerCase()
                                                            .includes(
                                                                filter.toLowerCase()
                                                            ) ? (
                                                        <div className="flex flex-wrap w-auto">
                                                            <Field
                                                                id={user.id}
                                                                key={user.id}
                                                                name="additionalMembers"
                                                                type="checkbox"
                                                                value={user.id}
                                                                className="mr-2 cursor-pointer"
                                                            />
                                                            <label
                                                                htmlFor={
                                                                    user.id
                                                                }
                                                                className="cursor-pointer"
                                                            >
                                                                {user.name +
                                                                    " " +
                                                                    user.surname}
                                                            </label>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200">
                                        <button
                                            type="button"
                                            className="
                                    w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium"
                                            onClick={() => {
                                                setShowAnswer(true);
                                            }}
                                        >
                                            Show answer
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium"
                                        >
                                            Update task
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <div className="p-4 flex flex-col gap-2">
                            <div className="flex flex-col sm:flex gap-1">
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 ">
                                    Answer
                                </h2>
                                <p className="text-sm sm:text-base text-slate-500">
                                    {task.answer.answer}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex gap-1">
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 pb-2 border-t border-slate-200">
                                    Comments
                                </h2>
                                <p className="text-sm sm:text-base text-slate-500">
                                    {task.answer.additionalAnswer}
                                </p>
                            </div>
                            <div className="flex flex-wrap w-full h-auto">
                                <h2 className="w-full text-lg sm:text-xl font-semibold text-slate-800 pb-2 border-t border-slate-200">
                                    Pictures
                                </h2>
                                {task.answer.pictures.map((picture) => (
                                    <img
                                        key={picture}
                                        src={
                                            import.meta.env
                                                .VITE_BACKEND_PICTURE_ANSWER +
                                            picture
                                        }
                                        alt="task"
                                        className="w-1/3 h-auto"
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    className="
                                    w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base rounded-lg transition-all duration-200 font-medium"
                                    onClick={() => {
                                        setShowAnswer(false);
                                    }}
                                >
                                    Hide answer
                                </button>
                            </div>
                        </div>
                    )}
                </Dialog>
            ) : null}
        </div>
    );
};
