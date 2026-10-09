import React, { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export const AuditLogsViewer: React.FC = () => {
  const { auditLogs, refreshAuditLogs } = useStore();

  useEffect(() => {
    void refreshAuditLogs();
  }, [refreshAuditLogs]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-950">Admin Activity</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Recent actions recorded by the authenticated admin session.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp (PKT)</th>
                <th className="py-3.5 px-4">Admin</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4">Request Origin</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block">{log.adminUser}</span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-gray-900">{log.action}</td>

                  <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                    {log.ipAddress}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 px-4 text-center text-sm text-gray-500">
                    No admin activity recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
