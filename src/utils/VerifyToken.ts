
import { jwtVerify } from 'jose';
import { ResponseInstance } from './instances';
import { haspermission } from './authroization';


export const VerifyToken =async (req,res,policy : string | null)=>{

    const token = req.cookies.token;

    if (!token) {
      const response: ResponseInstance = {
        data: [],
        message: "unauthorised",
        status: 401
      }

   return  res.json(response);
    }

  const secretKey = new TextEncoder().encode('your_secret_key');
  const { payload } = await jwtVerify(token, secretKey);

  let isauth = haspermission(payload, `view_${policy}`);

  if(policy == null){
    return payload
  }

  if (isauth !== true && policy){
      const response: ResponseInstance = {
        message: "Unauthorised from ",
        data: [],
        status: 401,
      };

    return  res.json(response);
  }

 return payload
 
}