import { User } from "../database/Models/User.js";
import bcrypt from "bcrypt";

(async () => {
    try {
        await User.create({
            name: "Kipras",
            surname: "Zelenkovas",
            email: "kipraszelenkovas@gmail.com",
            password: bcrypt.hashSync("password", 10),
            isAdmin: true,
        });

        console.log("Default user created");
    } catch (error) {
        console.error("Default user creation failed", error);
    }
})();
