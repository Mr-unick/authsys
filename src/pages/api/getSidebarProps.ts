import { haspermission } from "@/utils/authorization";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
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
        url: `/`,
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
        url: `/`,
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
            title: "Business Details",
            url: `/buisnessettings/buisness/buisness`,
            permissionRequired: "view_business",
          },
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
  }

  // Filter based on user permissions for non-PortalAdmin roles
  const filteredData = isPortalAdmin ? data : data.filter((nav: NavItem) => {
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

  const response: ResponseInstance = {
    message: "Request successful",
    data: filteredData,
    status: 200,
  };

  return res.status(200).json(response);
}
