import jwt from "jsonwebtoken";
import { Plant } from "../../database/Models/Plant.js";

export const checkForGuest = (req, res, next) => {
    if (req.cookies.token) {
        return res.status(403).json({
            errors: {
                status: 403,
                statusText: false,
                message: "You are already logged in",
            },
        });
    }

    next();
};

export const checkForLogged = (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({
            errros: {
                status: 401,
                statusText: false,
                message: "You are not logged in",
            },
        });
    }

    next();
};

export const checkForAccessAdmin = (req, res, next) => {
    const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
        algorithms: "HS512",
    });

    if (user.isAdmin !== true) {
        return res.status(401).json({
            errors: {
                status: 401,
                statusText: false,
                message: "You are not allowed",
            },
        });
    }

    next();
};

// export const checkForPlantAdmin = (req, res, next) => {
//     const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
//         algorithms: "HS512",
//     });

//     const plant = Plant.findOne({
//         where: {
//             administrator: user.id,
//         },
//     });

//     if (user.isAdmin !== true || plant[0] === undefined) {
//         return res.status(401).json({
//             errors: {
//                 status: 401,
//                 statusText: false,
//                 message: "You are not allowed",
//             },
//         });
//     }

//     next();
// };
