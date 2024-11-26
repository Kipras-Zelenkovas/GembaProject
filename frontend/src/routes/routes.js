import { Audits } from "../components/administration/Audits/Audits";
import { AuditUsers } from "../components/administration/AuditUsers";
import { Plants } from "../components/administration/Plants/Plants.jsx";
import { Users } from "../components/administration/Users";
import { Audit } from "../components/Audit/Audit.jsx";
import { Login } from "../components/Auth/Login";
import { Charts } from "../components/Charts/Charts.jsx";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { Page403 } from "../components/Errors/Page403";
import { Page404 } from "../components/Errors/Page404";
import { Page500 } from "../components/Errors/Page500";
import { Tasks } from "../components/Tasks/Tasks.jsx";

export const routes = {
    Login: Login,
    Dashboard: Dashboard,
    Plants: Plants,
    Users: Users,
    Audits: Audits,
    AuditUsers: AuditUsers,
    Audit: Audit,
    Tasks: Tasks,
    Charts: Charts,
    Page403: Page403,
    Page404: Page404,
    Page500: Page500,
};
