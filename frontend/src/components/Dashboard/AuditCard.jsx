import PropTypes from "prop-types";

export const AuditCard = ({ audit, onCancel, onSend, onComplete }) => {
    const getStatusColor = (dueDate) => {
        const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
        return dueDate < today ? "FF0000" : audit.color;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div
            className="w-4/5 md:w-full p-4 bg-white rounded-lg shadow-custom flex flex-wrap flex-row items-center justify-between"
            style={{
                "--tw-shadow": `0 6px 12px -2px #${getStatusColor(
                    audit.color
                )}`,
            }}
        >
            <div className="flex flex-wrap flex-col">
                <h1 className="text-xl font-bold">{audit.audit.name}</h1>
                <p className="text-lg">{audit.audit.type.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                    Due: {formatDate(audit.dueDate)}
                </p>
            </div>
            <div className="flex flex-row gap-1">
                <svg
                    onClick={onCancel}
                    className="w-8 h-8 hover:scale-110 hover:fill-red-600 cursor-pointer transition-all duration-500 ease-in-out"
                    viewBox="0 0 24 24"
                    fill="inherit"
                >
                    <path
                        d="M6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L11.999 10.9384L16.7176 6.2198C17.0105 5.92691 17.4854 5.92691 17.7782 6.2198C18.0711 6.51269 18.0711 6.98757 17.7782 7.28046L13.0597 11.999L17.7782 16.7176C18.0711 17.0105 18.0711 17.4854 17.7782 17.7782C17.4854 18.0711 17.0105 18.0711 16.7176 17.7782L11.999 13.0597L7.28033 17.7784C6.98744 18.0713 6.51256 18.0713 6.21967 17.7784C5.92678 17.4855 5.92678 17.0106 6.21967 16.7177L10.9384 11.999L6.21967 7.28033Z"
                        fill="inherit"
                    />
                </svg>

                <svg
                    onClick={onSend}
                    className="w-8 h-8 hover:scale-110 hover:fill-orange-600 cursor-pointer transition-all duration-500 ease-in-out"
                    viewBox="0 0 24 24"
                    fill="inherit"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M22 6.25649V17.25C22 18.4926 20.9926 19.5 19.75 19.5H4.25C3.00736 19.5 2 18.4926 2 17.25V6.23398C2 6.22372 2.00021 6.2135 2.00061 6.20334C2.01781 5.25972 2.78812 4.5 3.73592 4.5H20.2644C21.2229 4.5 22 5.27697 22.0001 6.23549C22.0001 6.24249 22.0001 6.24949 22 6.25649ZM3.5 8.187V17.25C3.5 17.6642 3.83579 18 4.25 18H19.75C20.1642 18 20.5 17.6642 20.5 17.25V8.18747L13.2873 13.2171C12.5141 13.7563 11.4866 13.7563 10.7134 13.2171L3.5 8.187ZM20.5 6.2286L20.5 6.23398V6.24336C20.4976 6.31753 20.4604 6.38643 20.3992 6.42905L12.4293 11.9867C12.1716 12.1664 11.8291 12.1664 11.5713 11.9867L3.60116 6.42885C3.538 6.38481 3.50035 6.31268 3.50032 6.23568C3.50028 6.10553 3.60577 6 3.73592 6H20.2644C20.3922 6 20.4963 6.10171 20.5 6.2286Z"
                        fill="inherit"
                    />
                </svg>

                <svg
                    onClick={onComplete}
                    className="w-8 h-8 hover:scale-110 hover:fill-primary-800 cursor-pointer transition-all duration-500 ease-in-out"
                    viewBox="0 0 24 24"
                    fill="inherit"
                >
                    <path
                        d="M15.5071 10.5245C15.8 10.2316 15.8 9.75674 15.5071 9.46384C15.2142 9.17095 14.7393 9.17095 14.4464 9.46384L10.9649 12.9454L9.55359 11.5341C9.2607 11.2412 8.78582 11.2412 8.49293 11.5341C8.20004 11.827 8.20004 12.3019 8.49294 12.5947L10.4346 14.5364C10.7275 14.8293 11.2023 14.8292 11.4952 14.5364L15.5071 10.5245Z"
                        fill="inherit"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12Z"
                        fill="inherit"
                    />
                </svg>
            </div>
        </div>
    );
};

AuditCard.propTypes = {
    audit: PropTypes.shape({
        id: PropTypes.string.isRequired,
        audit: PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
        color: PropTypes.string.isRequired,
        dueDate: PropTypes.string.isRequired,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
};
