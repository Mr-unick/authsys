import { haspermission } from "@/utils/authorization";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import prisma from "@/app/lib/prisma";
import fs from 'fs';

interface NavItem {
  title: string;
  url: string;
  permissionRequired: string | null;
  nestedRoutes?: NavItem[];
}

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, null);
  if (res.writableEnded) return;

  const rawRole = (typeof user.role === 'string' ? user.role : (user.role?.name || 'USER'));
  const role = rawRole.trim().toUpperCase().replace(/\s+/g, '_');
  const businessId = user.business;
  const permissions = user.permissions || [];

  // Identify if this is a platform-level administrator
  // Fallback to permission wildcard if role matching fails
  const isPortalAdmin = role.includes('SUPER') ||
    (role.includes('ADMIN') && (!businessId || businessId === 0)) ||
    permissions.includes('*');

  let data: NavItem[] = [];

  if (isPortalAdmin) {
    // Portal Admin Navigation
    data = [
      {
        title: "Dashboard",
        url: `/crm`,
        permissionRequired: null,
      },
      {
        title: "Businesses",
        url: `/admin/businesses`,
        permissionRequired: null,
      },
      {
        title: "Integrations",
        url: `/admin/integrations`,
        permissionRequired: null,
      },
      {
        title: "Activity",
        url: `/activity`,
        permissionRequired: null,
      },
      {
        title: "Manage Staff",
        url: `/admin/staff`,
        permissionRequired: null,
      },
      {
        title: "Staff Roles",
        url: `/admin/roles`,
        permissionRequired: null,
      },
      {
        title: "Support",
        url: `/support`,
        permissionRequired: null,
      },
      {
        title: "Pricing",
        url: `/admin/pricing`,
        permissionRequired: null,
      },
      {
        title: "Settings",
        url: `/settings`,
        permissionRequired: null,
      },
    ];
  } else {
    // Tenant User Navigation
    data = [
      {
        title: "Dashboard",
        url: `/crm`,
        permissionRequired: "view_dashboard",
      },
      {
        title: "Notifications",
        url: `/notifications`,
        permissionRequired: null,
      },
      {
        title: "Activity",
        url: `/activity`,
        permissionRequired: null,
      },
      {
        title: "Leads",
        url: `#`,
        permissionRequired: "view_leads",
        nestedRoutes: [
          {
            title: "New Leads",
            url: `/leads/newleads`,
            permissionRequired: "view_freshleads",
          },
          {
            title: "Board Leads",
            url: `/leads/boardleads`,
            permissionRequired: "view_leads",
          },
          {
            title: "Table Leads",
            url: `/leads/tableleads`,
            permissionRequired: "view_leads",
          },
        ],
      },
      {
        title: "Manage Users",
        url: `/user/users`,
        permissionRequired: "view_users",
      },
      {
        title: "Business Settings",
        url: "#",
        permissionRequired: "view_business",
        nestedRoutes: [
          {
            title: "Roles",
            url: `/buisnessettings/rolesadnpermissions/roles`,
            permissionRequired: "view_roles",
          },
          {
            title: user.is_branch_admin ? "Enterprise Details" : "Business Details",
            url: `/buisnessettings/buisness/buisness`,
            permissionRequired: "view_business",
          },
          ...(user.branch ? [{
            title: "Branch Details",
            url: `/buisnessettings/branches/details`,
            permissionRequired: "view_branches",
          }] : []),
          {
            title: "Area Of Operation",
            url: `/buisnessettings/areaofsales/areaofsales`,
            permissionRequired: "view_area_of_operation",
          },
          {
            title: "Lead Stages",
            url: `/buisnessettings/leadstages/leadstages`,
            permissionRequired: "view_leadstages",
          },
          {
            title: "Branches",
            url: `/buisnessettings/branches/branches`,
            permissionRequired: "view_branches",
          },
        ],
      },
      {
        title: "Integrations",
        url: `/integrations`,
        permissionRequired: "view_integrations",
      },
      {
        title: "Support",
        url: `/support`,
        permissionRequired: null,
      },
      {
        title: "Settings",
        url: `/settings`,
        permissionRequired: "update_settings",
      },
    ];

    // Additional safeguard: Forcibly remove Leads for anyone with SuperAdmin traits 
    // even if they somehow fell into the tenant-level block
    if (role.includes('SUPER') || permissions.includes('*')) {
      data = data.filter(item => item.title !== 'Leads');
    }

    // ── FEATURE CONTROL ──────────────────────────────────────────
    // Fetch enabled features for this business
    if (businessId) {
      const enabledFeatures = await prisma.businessFeature.findMany({
        where: { business_id: Number(businessId), is_enabled: true },
        select: { feature_key: true }
      });
      const featureKeys = enabledFeatures.map(f => f.feature_key);

      data = data.filter(item => {
        if (item.title === 'Integrations') {
          return featureKeys.includes('integration_suite');
        }
        if (item.title === 'Support') {
          return featureKeys.includes('support_system');
        }
        if (item.title === 'Activity') {
          return featureKeys.includes('activity_log');
        }
        return true;
      });

      // Filter nested items
      data.forEach(item => {
        if (item.nestedRoutes) {
          item.nestedRoutes = item.nestedRoutes.filter(nested => {
            if (nested.title === 'Branches' && (!featureKeys.includes('multi_branch') || user.is_branch_admin)) return false;
            if (nested.title === 'Lead Stages' && !featureKeys.includes('custom_lead_stages')) return false;
            if (nested.title === 'Area Of Operation' && !featureKeys.includes('area_of_operations')) return false;
            return true;
          });
        }
      });
    }
  }

  // Filter based on user permissions for non-PortalAdmin roles
  let filteredData = isPortalAdmin ? data : data.filter((nav: NavItem) => {
    // If no permission is required, show it to everyone
    if (!nav.permissionRequired) {
      return true;
    }

    const hasNavPermission = haspermission(user, nav.permissionRequired);

    if (!hasNavPermission) {
      return false;
    }

    // Filter nested routes
    if (nav.nestedRoutes) {
      nav.nestedRoutes = nav.nestedRoutes.filter((nestedNav: NavItem) => {
        return haspermission(user, nestedNav.permissionRequired as string);
      });
    }

    return true;
  });

  // Role-specific secondary filtering & Transformation
  const isBusinessAdmin = (role === 'BUSINESS_ADMIN' || role === 'BUISNESS_ADMIN' || role === 'ADMIN' || role === 'TENANT_ADMIN') && businessId && !user.is_branch_admin;

  if (isBusinessAdmin) {
    const branchCount = await prisma.branch.count({ where: { business_id: Number(businessId), deleted_at: null } });

    if (branchCount > 0) {
      // Re-map the navigation to look like Super Admin but for this Business
      const businessNav: NavItem[] = [
        { title: "Dashboard", url: "/crm", permissionRequired: "view_dashboard" },
        { title: "Branches", url: "/buisnessettings/branches/branches", permissionRequired: "view_branches" },
        { title: "Activity", url: "/activity", permissionRequired: null },
        { title: "Manage Team", url: "/user/users", permissionRequired: "view_users" },
        { title: "Team Roles", url: "/buisnessettings/rolesadnpermissions/roles", permissionRequired: "view_roles" },
        { title: "Support", url: "/support", permissionRequired: null },
        { title: "Business Profile", url: "/buisnessettings/buisness/buisness", permissionRequired: "view_business" }
      ];

      // Filter by features (Activity/Support/etc)
      const enabledFeatures = await prisma.businessFeature.findMany({
        where: { business_id: Number(businessId), is_enabled: true },
        select: { feature_key: true }
      });
      const featureKeys = enabledFeatures.map(f => f.feature_key);

      filteredData = businessNav.filter(item => {
        if (item.title === 'Activity' && !featureKeys.includes('activity_log')) return false;
        if (item.title === 'Support' && !featureKeys.includes('support_system')) return false;
        return true;
      });
    } else {
      // Basic Business Admin filtering (if no branches yet)
      filteredData = filteredData.filter(item => !['Settings', 'Notifications'].includes(item.title));
    }
  }

  const response: ResponseInstance = {
    message: "Request successful",
    data: filteredData,
    status: 200,
  };

  return res.status(200).json(response);
}
