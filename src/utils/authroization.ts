
type UserInstance = {
    role: string;
    permissions: Array<any>;
  };
 
 export const haspermission =( user,requiredPermission:string) : boolean=>{

    if( user.role == 'Admin'){
        return true
    }

 //   const haspermission = user.permissions.find((permission)=>permission == gatePermission);

 return user?.permissions?.includes(requiredPermission);
    
}



export const hasroutepermission = (user: UserInstance, route: string): boolean => {
    // Gates array with route and required permissions
   
    const Gates = [
        {
            "route": "/",
            "permissionRequired": "view_dashboard"
        },
        {
            "route": "boardleads",
            "permissionRequired": "view_dashboard"
        },
        {
            "route": "tableleads",
            "permissionRequired": "view_nested_dashboard"
        },
        {
            "route": "users",
            "permissionRequired": "view_contact"
        },
        {
            "route": "branches",
            "permissionRequired": "view_nested_about"
        },
        {
            "route": "leadstages",
            "permissionRequired": "view_nested_about"
        },
        {
            "route": "settings",
            "permissionRequired": "view_settings"
        }
    ];
    

    // If the user's role is 'Admin', grant access to all routes
    if (user.role === 'Admin') {
        return true;
    }

    // Find the required permission for the route the user is trying to access
    const gate = Gates.find(gate => gate.route === route);

    // If the route is not found in the Gates array, deny access (or you can customize the behavior)
    if (!gate) {
        return false;
    }


    // Check if the user has the required permission for the found route
    return user.permissions.includes(gate.permissionRequired);
};





