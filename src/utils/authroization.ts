
type UserInstance = {
    role: string;
    permissions: Array<any>;
  };
 
 export const haspermission =( user:UserInstance,requiredPermission:string) : boolean=>{

    if( user.role == 'Admin'){
        return true
    }

 //   const haspermission = user.permissions.find((permission)=>permission == gatePermission);

 return user.permissions.includes(requiredPermission);
    


}

