import { useEffect, useState } from "react";
import { logout } from "../../../controllers/auth";
import { Loader } from "../Loader";
import { getAuditUser, sendAuditUser } from "../../../controllers/auditUser";
import { AuditCancel } from "./AuditCancel.jsx";
import { getUsersAudit } from "../../../controllers/user.js";
import { AuditCard } from "./AuditCard";
import { SendAuditDialog } from "./SendAuditDialog";

const AVAILABLE_VISUALIZATIONS = ["7A1CAC", "4B4376", "A64D79", "E8BCB9"];

export const Dashboard = () => {
    const [audits, setAudits] = useState(null);
    const [users, setUsers] = useState(null);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsersAudit();
                if (res.status === 200) {
                    setUsers(res.data);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchAudits = async () => {
            try {
                const res = await getAuditUser();
                if (res.status === 200) {
                    const typeColorMap = {};
                    let colorIndex = 0;

                    const processedAudits = res.data.map((audit) => {
                        const auditType = audit.audit.type.name;
                        if (!typeColorMap[auditType]) {
                            typeColorMap[auditType] =
                                AVAILABLE_VISUALIZATIONS[
                                    colorIndex % AVAILABLE_VISUALIZATIONS.length
                                ];
                            colorIndex++;
                        }
                        return { ...audit, color: typeColorMap[auditType] };
                    });

                    setAudits(processedAudits);
                } else {
                    setAudits([]);
                }
            } catch (error) {
                console.error("Error fetching audits:", error);
                setAudits([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAudits();
    }, [updateTrigger]);

    const handleSendAudit = async (values, { setSubmitting }) => {
        try {
            const res = await sendAuditUser({
                id: selectedAudit.id,
                message: values.message,
                user_id: values.user_id,
            });

            if (res.status === 200) {
                setShowSendDialog(false);
                setUpdateTrigger(!updateTrigger);
            } else {
                console.error("Error sending audit:", res);
                logout();
            }
        } catch (error) {
            console.error("Error sending audit:", error);
            logout();
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen pl-16">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="flex flex-wrap flex-col w-full min-h-screen pt-20 pb-6 overflow-y-auto no-scrollbar items-center content-center justify-center">
                {audits.length === 0 ? (
                    <div className="text-center w-full mt-8">
                        <h1 className="text-2xl font-bold">No audits found</h1>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4 justify-items-center">
                        {audits.map((audit) => (
                            <AuditCard
                                key={audit.id}
                                audit={audit}
                                onCancel={() => {
                                    setSelectedAudit(audit);
                                    setShowCancelDialog(true);
                                }}
                                onSend={() => {
                                    setSelectedAudit(audit);
                                    setShowSendDialog(true);
                                }}
                                onComplete={() => {
                                    window.location.href = `/audit?id=${audit.audit.id}&audit_id=${audit.id}`;
                                }}
                            />
                        ))}
                    </div>
                )}

                {selectedAudit && (
                    <>
                        <SendAuditDialog
                            visible={showSendDialog}
                            onHide={() => setShowSendDialog(false)}
                            onSubmit={handleSendAudit}
                            users={users || []}
                        />

                        <AuditCancel
                            show={showCancelDialog}
                            setShow={setShowCancelDialog}
                            audit={selectedAudit}
                            updateA={updateTrigger}
                            setUpdateA={setUpdateTrigger}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
