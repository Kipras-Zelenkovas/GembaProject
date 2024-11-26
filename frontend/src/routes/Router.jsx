import { useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import { Navigation } from "../components/Navigation.jsx";
import { routes } from "./routes.js";
import { PrivateRoute } from "./PrivateRoute.jsx";

export const Router = () => {
    const location = useLocation();
    return (
        <div className="flex flex-wrap w-full h-full">
            <Navigation />
            <div className="w-full max-w-full sm:w-main-window sm:max-w-main-window h-full pt-2 sm:pt-0 ml-16">
                <Routes location={location} key={location.pathname}>
                    <Route path="/403" element={<routes.Page403 />} />
                    <Route path="*" element={<routes.Page404 />} />
                    <Route path="/500" element={<routes.Page500 />} />
                    <Route path="/" element={<routes.Login />} />

                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute
                                Component={routes.Dashboard}
                                accessType="user"
                            />
                        }
                    />

                    <Route
                        path="/plants"
                        element={
                            <PrivateRoute
                                Component={routes.Plants}
                                accessType={"plant"}
                            />
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <PrivateRoute
                                Component={routes.Users}
                                accessType={"plant"}
                            />
                        }
                    />
                    <Route
                        path="/audits"
                        element={
                            <PrivateRoute
                                Component={routes.Audits}
                                accessType={"plant"}
                            />
                        }
                    />
                    <Route
                        path="/audit-users"
                        element={
                            <PrivateRoute
                                Component={routes.AuditUsers}
                                accessType={"plant"}
                            />
                        }
                    />
                    <Route
                        path="/audit"
                        element={
                            <PrivateRoute
                                Component={routes.Audit}
                                accessType="user"
                            />
                        }
                    />
                    <Route
                        path="/tasks"
                        element={
                            <PrivateRoute
                                Component={routes.Tasks}
                                accessType="user"
                            />
                        }
                    />
                    <Route path="/charts" element={<routes.Charts />} />
                </Routes>
            </div>
        </div>
    );
};
