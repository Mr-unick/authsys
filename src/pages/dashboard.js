import React, { useState } from "react";
import { Loader2, Calendar, RefreshCcw, Filter } from "lucide-react";
import { SuperAdminDashboard } from "../app/components/dashboard/SuperAdminDashboard";
import { TenantAdminDashboard } from "../app/components/dashboard/TenantAdminDashboard";
import { SalespersonDashboard } from "../app/components/dashboard/SalespersonDashboard";

const Dashboard = ({ data }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <p className="font-bold text-xs text-gray-400 uppercase tracking-widest">Compiling Intelligence...</p>
    </div>
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Refresh logic is controlled by Index.js via SSE or manual trigger
    window.location.reload();
  };

  const renderDashboardByRole = () => {
    switch (data.role) {
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard data={data} />;
      case 'TENANT_ADMIN':
        return <TenantAdminDashboard data={data} />;
      case 'SALES_PERSON':
        return <SalespersonDashboard data={data} />;
      default:
        // Fallback for unexpected roles
        return <SalespersonDashboard data={data} />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-1 sm:px-2 lg:px-4 py-4 space-y-6 pb-32">
      {/* Dynamic Content Based on Role */}
      {renderDashboardByRole()}
    </div>
  );
};

export default Dashboard;
