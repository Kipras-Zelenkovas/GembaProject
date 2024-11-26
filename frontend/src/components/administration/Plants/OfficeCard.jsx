import React from "react";

export const OfficeCard = ({ office, users, onClick }) => {
    const supervisor = users.find((user) => user.id === office.supervisor);

    return (
        <div
            onClick={onClick}
            className="group flex flex-col w-full min-h-[7rem] sm:min-h-[8rem] bg-white rounded-xl shadow-sm hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex-1 p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="text-lg sm:text-xl font-semibold text-amber-600">
                            {office.name.charAt(0)}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
                            {office.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Office
                        </p>
                    </div>
                    <div className="shrink-0">
                        <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-600 transition-colors"
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
            <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <span className="text-slate-600">Supervisor:</span>
                    <span className="font-medium text-slate-800 truncate">
                        {supervisor
                            ? `${supervisor.name} ${supervisor.surname}`
                            : "Not assigned"}
                    </span>
                </div>
            </div>
        </div>
    );
};
