import { useState } from "react";
import { Loader } from "../../Loader";
import AuditTypes from "./AuditTypes";
import AuditList from "./AuditList";
import QuestionList from "./Questions/QuestionList";

export const Audits = () => {
    const [auditType, setAuditType] = useState(undefined);
    const [audit, setAudit] = useState(undefined);
    const [question, setQuestion] = useState(undefined);

    if (auditType === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {!auditType && !audit && <AuditTypes onSelectType={setAuditType} />}

            {auditType && !audit && (
                <AuditList
                    auditType={auditType}
                    onBack={() => setAuditType(undefined)}
                    onSelectAudit={setAudit}
                />
            )}

            {auditType && audit && (
                <QuestionList
                    audit={audit}
                    onBack={() => setAudit(undefined)}
                />
            )}
        </div>
    );
};

export default Audits;
