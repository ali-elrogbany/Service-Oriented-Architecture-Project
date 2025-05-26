"use client";

import React, { useEffect, useState } from "react";
import { auditLogService } from "../../services/api";

interface AuditLog {
    _id: string;
    action: string;
    user_id: {
        _id: string;
        username: string;
        email: string;
    };
    timestamp: string;
    createdAt: string;
}

const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await auditLogService.getAllAuditLogs();
            setLogs(response);
            setError(null);
        } catch (err) {
            setError("Failed to fetch audit logs");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>User</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log._id}>
                            <td>{formatDate(log.timestamp || log.createdAt) || "-"}</td>
                            <td>{log.action}</td>
                            <td>
                                {log.user_id?.username || "Unknown User"}
                                <br />
                                <small className="text-muted">{log.user_id?.email}</small>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditLogs;
