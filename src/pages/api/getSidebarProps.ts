import { haspermission } from "@/utils/authorization";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, null);
  if (res.writableEnded) return;

  const data = [
    {
      title: "Dashboard",
      url: `/`,
      permissionRequired: "view_dashboard",
    },
    {
      title: "Notifications",
      url: `/notifications`,
      permissionRequired: null, // Temporarily bypass for visibility
    },
    {
      title: "Activity",
      url: `/activity`,
      permissionRequired: null, // Temporarily bypass for visibility
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
      url: "/leads",
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
      title: "Settings",
      url: `/settings`,
      permissionRequired: "update_settings",
    },
  ];

  // Filter based on user permissions
  const filteredData = data.filter((nav: any) => {
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
      nav.nestedRoutes = nav.nestedRoutes.filter((nestedNav: any) => {
        return haspermission(user, nestedNav.permissionRequired);
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