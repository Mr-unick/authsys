
import { ResponseInstance } from '@/utils/instances';
import { jwtVerify } from 'jose';


export default async function handler(req,res){
    try{

        const token = req.cookies.get('token');

        if(!token){
            const response: ResponseInstance = {
                data: [],
                message: "unauthorised",
                status: 401
            }

            res.json(response)
        }

        const secretKey = new TextEncoder().encode('your_secret_key');  
        const { payload } = await jwtVerify(token.value, secretKey);

        const response : ResponseInstance = {
            data:payload,
            message:"Succesfull",
            status:200
        }
        res.json(response)
    }catch(e){
        const response: ResponseInstance = {
            data: e,
            message: "failed",
            status: 500
        }
        res.json(response)
    }
}