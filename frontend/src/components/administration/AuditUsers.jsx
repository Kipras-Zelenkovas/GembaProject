import { useEffect, useState } from "react";
import { Loader } from "../Loader.jsx";
import { getTypes } from "../../../controllers/type.js";
import { CUUser, getUsersAdmin } from "../../../controllers/user.js";

export const AuditUsers = () => {
    const [users, setUsers] = useState(null);
    const [types, setTypes] = useState(null);
    const [updateU, setUpdateU] = useState(false);

    useEffect(() => {
        getTypes()
            .then((res) => {
                if (res.status === 200) {
                    setTypes(res.data);
                } else {
                    console.log(res.message);
                    setTypes([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setTypes([]);
            });
    }, []);

    useEffect(() => {
        getUsersAdmin()
            .then((res) => {
                if (res.status === 200) {
                    setUsers(res.data);
                } else {
                    console.log(res.message);
                    setUsers([]);
                }
            })
            .catch((error) => {
                console.log(error);
                setUsers([]);
            });
    }, [updateU]);

    if (users === null || types === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 ">
            <div className="p-4 sm:p-6 md:p-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
                        Audit Users
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500">
                        Manage audit permissions for team members across
                        different audit types
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-200">
                                        Name
                                    </th>
                                    {types.map((type) => (
                                        <th
                                            key={type.id}
                                            className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-200"
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs sm:text-sm">
                                                    {type.name}
                                                </span>
                                                <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
                                                    {type.plant?.name ||
                                                        "No Plant"}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center">
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 sm:mr-3">
                                                    <span className="text-xs sm:text-sm font-semibold text-indigo-600">
                                                        {user.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm sm:text-base font-medium text-slate-700">
                                                        {user.name}{" "}
                                                        {user.surname}
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-slate-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {types.map((type) => (
                                            <td
                                                key={type.id}
                                                className="px-4 sm:px-6 py-3 sm:py-4 text-center"
                                            >
                                                {
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={user.audits.includes(
                                                                type.id
                                                            )}
                                                            onChange={() => {
                                                                CUUser({
                                                                    id: user.id,
                                                                    audits: user.audits?.find(
                                                                        (
                                                                            audit
                                                                        ) =>
                                                                            audit ===
                                                                            type.id
                                                                    )
                                                                        ? user.audits.filter(
                                                                              (
                                                                                  audit
                                                                              ) =>
                                                                                  audit !==
                                                                                  type.id
                                                                          )
                                                                        : [
                                                                              ...(user.audits ||
                                                                                  []),
                                                                              type.id,
                                                                          ],
                                                                }).then(
                                                                    (res) => {
                                                                        if (
                                                                            res.status ===
                                                                            201
                                                                        ) {
                                                                            setUpdateU(
                                                                                !updateU
                                                                            );
                                                                        } else {
                                                                            console.log(
                                                                                res.message
                                                                            );
                                                                        }
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                        <div className="w-9 sm:w-11 h-5 sm:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </label>
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
