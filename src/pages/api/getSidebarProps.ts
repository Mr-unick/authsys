import { permission } from "process";

import { UsserData } from "../../../const";
import { haspermission } from "../../utils/authroization";
import { ResponseInstance } from "../../utils/instances";





  
  export default async function handler(req ,res) {


    let data = [
      {
        title: "Dashboard",
        url: "/",
        permissionRequired: "view_dashboard",
        
      },
      {
        title: "Leads",
        url: "/users",
        permissionRequired: "view_about",
        nestedRoutes: [
          
          {
            title: "Board Leads",
            url: "/leads/boardleads",
            permissionRequired: "nikhil",
          },
          {
            title: "Table Leads",
            url: "/leads/tableleads",
            permissionRequired: "view_nested_dashboard",
          },
        ],
        
      },
      {
        title: "Mange Users",
        url: "/users",
        permissionRequired: "view_contact",
        
      },
      {
        title: "Buisness Settings",
        url: "/home",
        permissionRequired: "view_buisness",
        nestedRoutes: [
          {
            title: "Roles And Permissions",
            url: "/buisnessettings/rolesadnpermissions/roles",
            permissionRequired: "view_nested_dashboard",
          },
          {
            title: "Buisnes Details",
            url: "/buisnessettings/buisness",
            permissionRequired: "view_nested_dashboard",
          },
          
          {
            title: "Area Of Operation",
            url: "/buisnessettings/areaofsales",
            permissionRequired: "view_nested_about",
          },
          {
            title: "Lead Stages",
            url: "/buisnessettings/leadstages",
            permissionRequired: "view_nested_about",
          },
          {
            title: "Branches",
            url: "/buisnessettings/branches",
            permissionRequired: "view_nested_about",
          },
        ],

      },
      {
        title: "Settings",
        url: "/settings",
        permissionRequired: "view_settings",
      },
    
    ];
    

    data = data.filter(nav => {
    
        const hasNavPermission = haspermission(UsserData, nav.permissionRequired);
        
    
        // return false if user dont have permission 

        if (!hasNavPermission) {
            return false;
        }
        
       // filter nested routes  

        if (nav.nestedRoutes) {
            nav.nestedRoutes = nav.nestedRoutes.filter(nestedNav => {
              
                return haspermission(UsserData, nestedNav.permissionRequired);
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