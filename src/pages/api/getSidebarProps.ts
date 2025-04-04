import { permission } from "process";

import { UsserData } from "../../../const";
import { haspermission } from "../../utils/authroization";
import { ResponseInstance } from "../../utils/instances";
import { jwtVerify } from 'jose';





export default async function handler(req, res) {

  const token = req.cookies.token;

  if (!token) {
    const response: ResponseInstance = {
      data: [],
      message: "unauthorised",
      status: 401
    }

    res.json(response)
  }

  const secretKey = new TextEncoder().encode('your_secret_key');
  const { payload } = await jwtVerify(token, secretKey);

  const url = process.env.BASEURL;

  

  let data = [
    {
      title: "Dashboard",
      url: `${url}/`,
      permissionRequired: "view_dashboard",

    },
    {
      title: "Notifications",
      url: `${url}/notifications`,
      permissionRequired: "view_notifications",

    },
    {
      title: "Activity",
      url: `${url}/activity`,
      permissionRequired: "view_activity",
    },
    {
      title: "Leads",
      url: `${url}/#`,
      permissionRequired: "view_leads",
      nestedRoutes: [
        {
          title: "New Leads",
          url: `${url}/leads/newleads`,
          permissionRequired: "view_freshleads",
        },
        {
          title: "Board Leads",
          url: `${url}/leads/boardleads`,
          permissionRequired: "view_leads",
        },
        {
          title: "Table Leads",
          url: `${url}/leads/tableleads`,
          permissionRequired: "view_leads",
        },
      ],

    },
    {
      title: "Mange Users",
      url: `${url}/user/users`,
      permissionRequired: "view_users",

    },
    {
      title: "Buisness Settings",
      url: "#",
      permissionRequired: 'view_business',
      nestedRoutes: [
        {
          title: "Roles",
          url: `${url}buisnessettings/rolesadnpermissions/roles`,
          permissionRequired: "view_roles",
        },
        {
          title: "Buisnes Details",
          url: `${url}buisnessettings/buisness/buisness`,
          permissionRequired: 'view_business',
        },

        {
          title: "Area Of Operation",
          url: `${url}buisnessettings/areaofsales/areaofsales`,
          permissionRequired: "view_area_of_operation",
        },
        {
          title: "Lead Stages",
          url: `${url}buisnessettings/leadstages/leadstages`,
          permissionRequired: "view_leadstages",
        },
        {
          title: "Branches",
          url: `${url}buisnessettings/branches/branches`,
          permissionRequired: "view_branches",
        },
      ],

    },
    {
      title: "Settings",
      url: `${url}/settings`,
      permissionRequired: "update_settings",
    },

  ];


  data = data.filter(nav => {
    const hasNavPermission = haspermission(payload, nav.permissionRequired);
    // return false if user dont have permission 

    if (!hasNavPermission) {
      return false;
    }

    // filter nested routes  

    if (nav.nestedRoutes) {
      nav.nestedRoutes = nav.nestedRoutes.filter(nestedNav => {
        return haspermission(payload, nestedNav.permissionRequired);
      });
    }


    return true;
  });


  const response: ResponseInstance = {
    message: "Request successful",
    data: data,
    status: 200,
  };

  res.json(response);
}