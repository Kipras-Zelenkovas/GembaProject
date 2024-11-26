import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import {
    check_cookie,
    checkAdminAccess,
    checkPlantAdminAccess,
    logout,
} from "../../controllers/auth.js";

export const Navigation = () => {
    const [cookieExist, setCookieExist] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [accessPA, setAccessPA] = useState(null);
    const [accessA, setAccessA] = useState(null);

    useEffect(() => {
        check_cookie().then((res) => {
            if (res.status === 200) {
                setCookieExist(true);
            } else {
                setCookieExist(false);
            }
        });

        checkAdminAccess().then((res) => {
            if (res.status === 200) {
                setAccessA(true);
            } else {
                setAccessA(false);
            }
        });

        checkPlantAdminAccess().then((res) => {
            if (res.status === 200) {
                setAccessPA(true);
            } else {
                setAccessPA(false);
            }
        });
    }, []);

    if (cookieExist === null || accessA === null || accessPA === null) {
        return <Loader />;
    }

    const NavLink = ({ to, title, icon, onClick }) => {
        const isActive = window.location.pathname === to;
        return (
            <Link
                to={to}
                title={title}
                onClick={onClick}
                className={`group flex items-center w-full p-2 rounded-xl transition-all duration-500 hover:scale-[1.1] ${
                    isActive
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20"
                        : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                }`}
            >
                <div
                    className={`flex items-center w-full ${
                        mobileMenu ? "gap-3" : "justify-center"
                    }`}
                >
                    <div
                        className={`w-6 h-6 transition-all duration-500 ${
                            isActive
                                ? "text-white"
                                : "text-primary-500 group-hover:text-primary-600"
                        }`}
                    >
                        {icon}
                    </div>
                    {mobileMenu && (
                        <span
                            className={`text-sm font-medium transition-all duration-500 ${
                                mobileMenu
                                    ? "opacity-100"
                                    : "opacity-0 sm:hidden"
                            }`}
                        >
                            {title}
                        </span>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white/80 backdrop-blur-lg border-r border-gray-100 shadow-xl transition-all duration-500 ${
                mobileMenu ? "w-64" : "w-16"
            }`}
        >
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
                {mobileMenu && (
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-primary-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                            <img
                                src="./LFUS.png"
                                alt="Logo"
                                className="h-8 w-8 relative"
                            />
                        </div>
                        <span
                            className={`font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent transition-all duration-500 ${
                                mobileMenu ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            GembaLean
                        </span>
                    </div>
                )}
                <button
                    onClick={() => setMobileMenu(!mobileMenu)}
                    className="p-2 rounded-lg hover:bg-gray-50 transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-200 relative"
                    style={{ marginRight: mobileMenu ? "0" : "-8px" }}
                >
                    <div className="relative w-5 h-5">
                        <svg
                            className={`w-5 h-5 text-gray-500 absolute transition-all duration-500 ${
                                mobileMenu
                                    ? "opacity-0 rotate-90 scale-0"
                                    : "opacity-100 rotate-0 scale-100"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                        <svg
                            className={`w-5 h-5 text-gray-500 absolute transition-all duration-500 ${
                                mobileMenu
                                    ? "opacity-100 rotate-0 scale-100"
                                    : "opacity-0 -rotate-90 scale-0"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                <NavLink
                    to="/dashboard"
                    title="Dashboard"
                    icon={
                        <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                    }
                />

                <NavLink
                    to="/tasks"
                    title="Tasks"
                    icon={
                        <svg
                            viewBox="0 0 512 512"
                            version="1.1"
                            fill="currentColor"
                        >
                            <g stroke-width="0"></g>
                            <g strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <g
                                    stroke="none"
                                    strokeWidth="1"
                                    fill="inherit"
                                    fillRule="evenodd"
                                >
                                    <g
                                        fill="inherit"
                                        transform="translate(70.530593, 46.125620)"
                                    >
                                        <path d="M185.469407,39.207713 L356.136074,39.207713 L356.136074,81.8743797 L185.469407,81.8743797 L185.469407,39.207713 Z M185.469407,188.541046 L356.136074,188.541046 L356.136074,231.207713 L185.469407,231.207713 L185.469407,188.541046 Z M14.8027404,295.207713 L121.469407,295.207713 L121.469407,401.87438 L14.8027404,401.87438 L14.8027404,295.207713 Z M46.8027404,327.207713 L46.8027404,369.87438 L89.4694071,369.87438 L89.4694071,327.207713 L46.8027404,327.207713 Z M185.469407,337.87438 L356.136074,337.87438 L356.136074,380.541046 L185.469407,380.541046 L185.469407,337.87438 Z M119.285384,-7.10542736e-15 L144.649352,19.5107443 L68.6167605,118.353113 L1.42108547e-14,58.3134476 L21.0721475,34.2309934 L64.0400737,71.8050464 L119.285384,-7.10542736e-15 Z M119.285384,149.333333 L144.649352,168.844078 L68.6167605,267.686446 L1.42108547e-14,207.646781 L21.0721475,183.564327 L64.0400737,221.13838 L119.285384,149.333333 Z"></path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    }
                />

                {accessPA && (
                    <NavLink
                        to="/plants"
                        title="Plants"
                        icon={
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        }
                    />
                )}

                {accessPA && (
                    <>
                        <NavLink
                            to="/users"
                            title="Users"
                            icon={
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            }
                        />

                        <NavLink
                            to="/audits"
                            title="Audits"
                            icon={
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                    />
                                </svg>
                            }
                        />

                        <NavLink
                            to="/audit-users"
                            title="Audit Users"
                            icon={
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                    />
                                </svg>
                            }
                        />
                    </>
                )}
                <NavLink
                    to="/charts"
                    title="Charts"
                    icon={
                        <svg
                            viewBox="0 0 24 24"
                            fill="#currentColor"
                            transform="rotate(0 0 0)"
                        >
                            <path
                                d="M3.5 5.25C3.5 4.83579 3.16421 4.5 2.75 4.5C2.33579 4.5 2 4.83579 2 5.25V17.25C2 18.4926 3.00736 19.5 4.25 19.5H21.25C21.6642 19.5 22 19.1642 22 18.75C22 18.3358 21.6642 18 21.25 18H4.25C3.83579 18 3.5 17.6642 3.5 17.25V5.25Z"
                                fill="currentColor"
                            />
                            <path
                                d="M7 10.2773C5.89543 10.2773 5 11.1728 5 12.2773V15.7501C5 16.1643 5.33579 16.5001 5.75 16.5001H8.25C8.66421 16.5001 9 16.1643 9 15.7501V12.2773C9 11.1728 8.10457 10.2773 7 10.2773ZM6.5 12.2773C6.5 12.0012 6.72386 11.7773 7 11.7773C7.27614 11.7773 7.5 12.0012 7.5 12.2773V15.0001H6.5V12.2773Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            />
                            <path
                                d="M10.5 6.5C10.5 5.39543 11.3954 4.5 12.5 4.5C13.6046 4.5 14.5 5.39543 14.5 6.5V15.7501C14.5 16.1643 14.1642 16.5001 13.75 16.5001H11.25C10.8358 16.5001 10.5 16.1643 10.5 15.7501V6.5ZM12.5 6C12.2239 6 12 6.22386 12 6.5V15.0001H13V6.5C13 6.22386 12.7761 6 12.5 6Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            />
                            <path
                                d="M18 8.05859C16.8954 8.05859 16 8.95402 16 10.0586V15.7501C16 16.1643 16.3358 16.5001 16.75 16.5001H19.25C19.6642 16.5001 20 16.1643 20 15.7501V10.0586C20 8.95402 19.1046 8.05859 18 8.05859ZM17.5 10.0586C17.5 9.78245 17.7239 9.55859 18 9.55859C18.2761 9.55859 18.5 9.78245 18.5 10.0586V15.0001H17.5V10.0586Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                            />
                        </svg>
                    }
                />
            </nav>

            {/* Auth Button */}
            <div className="p-3 border-t border-gray-100">
                {cookieExist ? (
                    <button
                        onClick={() => {
                            logout().then((res) => {
                                if (res.status === 200) {
                                    window.location.href = "/";
                                } else {
                                    console.error("Error logging out");
                                }
                            });
                        }}
                        className="group flex items-center w-full p-2 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-500 hover:scale-[1.02]"
                    >
                        <div
                            className={`flex items-center w-full ${
                                mobileMenu ? "gap-3" : "justify-center"
                            }`}
                        >
                            <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            {mobileMenu && (
                                <span
                                    className={`text-sm font-medium transition-all duration-500 ${
                                        mobileMenu ? "opacity-100" : "opacity-0"
                                    }`}
                                >
                                    Logout
                                </span>
                            )}
                        </div>
                    </button>
                ) : (
                    <Link
                        to="/"
                        className="group flex items-center w-full p-2 rounded-xl text-primary-600 hover:bg-primary-50 transition-all duration-500 hover:scale-[1.02]"
                    >
                        <div
                            className={`flex items-center w-full ${
                                mobileMenu ? "gap-3" : "justify-center"
                            }`}
                        >
                            <svg
                                className="w-5 h-5 text-primary-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                            </svg>
                            {mobileMenu && (
                                <span
                                    className={`text-sm font-medium transition-all duration-500 ${
                                        mobileMenu ? "opacity-100" : "opacity-0"
                                    }`}
                                >
                                    Login
                                </span>
                            )}
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};
