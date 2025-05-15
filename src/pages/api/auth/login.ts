import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { redirect } from 'next/navigation';
import { AppDataSource } from '@/app/lib/data-source';
import { Users } from '@/app/entity/Users';
import { Permissions } from '@/app/entity/Permissions';
import { Roles } from '@/app/entity/Roles';
import bcrypt from "bcrypt";

export default async function handler(req, res) {


    try {
        const { email, password } = req.body;

        let user = await AppDataSource.getRepository(Users)
            .createQueryBuilder('users')
            .leftJoinAndSelect('users.role', 'role')
            .leftJoinAndSelect('users.business', 'business')
            .addSelect('users.password')
            .where('users.email = :email', { email: email })
            .getOne();

        console.log(user , req.body,'this is user')

        if (!user) {
            return res.json({
                message: 'User not found',
                status:404
            });
        }

       let comparepass =  bcrypt.compareSync(password, user.password);

       console.log(!comparepass)

       if (!comparepass) {
        return res.json({
            message: 'Incorrect Password',
            status:401
        });
        }

       
        let permissions = (await AppDataSource.getRepository(Users)
            .createQueryBuilder('users')
            .leftJoin('users.role', 'role')
            .leftJoin('role.permissions', 'permissions')
            .select('permissions.permission', 'permission')
            .where('users.id = :id', { id: user?.id })
            .getRawMany()).map(p => p.permission);
          
        let buisness = (await AppDataSource.getRepository(Users).createQueryBuilder('users').leftJoin('users.business', 'business').where('users.id = :id', { id: user?.id }).getRawMany()).map(p => p.users_buisnesId)[0];     

      
        let newuser = {
            ...user,
            role: user?.role.name,
            business: buisness,
            permissions: permissions

        }

        const token = jwt.sign(newuser, 'your_secret_key', { expiresIn: '24h' });

        const serializedCookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 60 * 24,
            path: '/',
            sameSite: 'strict',
        });

        res.setHeader('Set-Cookie', serializedCookie);

        // sessionStorage.setItem('user',JSON.stringify({
        //     name : newuser.name,
        //     role : newuser.role
        // }))

        return res.json({
            message: 'Login successful',
            status : 200
        });

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            message: 'Login unsuccessful',
            error: error.message,
        });
    }
}
