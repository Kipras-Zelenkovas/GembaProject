import { useState } from "react";
import { Loader } from "../components/Loader";
import {
    check_cookie,
    checkAdminAccess,
    checkPlantAdminAccess,
} from "../../controllers/auth";

/*
    This component is used to protect routes that require authentication.
    It checks if the user is logged in and has the required access type to access the route.

    @param Component: The component to be rendered if the user is authenticated.    
    @param accessType: "user", "plant", "admin"
*/
export const PrivateRoute = ({ Component, accessType }) => {
    const [access, setAccess] = useState(null);
    const [cookieExists, setCookieExists] = useState(null);

    const [update, setUpdate] = useState(false);

    useState(() => {
        check_cookie()
            .then((res) => {
                if (res.status === 200) {
                    if (accessType === "user") {
                        setAccess(true);
                    } else if (accessType === "plant") {
                        checkPlantAdminAccess()
                            .then((res) => {
                                if (res.status === 200) {
                                    setAccess(true);
                                } else {
                                    setAccess(false);
                                }
                            })
                            .catch((err) => {
                                setAccess(false);
                            });
                    } else if (accessType === "admin") {
                        checkAdminAccess()
                            .then((res) => {
                                if (res.status === 200) {
                                    setAccess(true);
                                } else {
                                    setAccess(false);
                                }
                            })
                            .catch((err) => {
                                setAccess(false);
                            });
                    }
                    setCookieExists(true);
                } else {
                    setCookieExists(false);
                    setAccess(false);
                }
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    setAccess(false);
                    setCookieExists(false);
                } else {
                    window.location.href = "/500";
                }
            });

        setTimeout(() => {
            setUpdate(!update);
        }, 1000 * 60 * 3);
    }, [update]);

    if (access === null || cookieExists === null) {
        return <Loader />;
    }

    if (cookieExists === false) {
        localStorage.removeItem("id");
        localStorage.removeItem("name");
        localStorage.removeItem("email");

        window.location.href = "/";

        return null;
    } else if (access === false) {
        window.location.href = "/403";
        return null;
    } else if (access === true) {
        return <Component />;
    } else {
        window.location.href = "/500";
        return null;
    }
};
