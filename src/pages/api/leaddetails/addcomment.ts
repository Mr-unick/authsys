import { Leads } from "@/app/entity/Leads";
import { Comment } from "@/app/entity/Comment";
import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  const uploadDir = path.join(process.cwd(), '/public/uploads');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

export default async function addComment(req, res) {

    const form = formidable({
        multiples: false,
        uploadDir,
        keepExtensions: true,
      });
    
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Upload error:', err);
          return res.status(500).json({ error: 'File upload error' });
        }
    
        const file = files.file;
        const filePath = file[0]?.filepath || file.filepath; 
        const fileName = path.basename(filePath);
    
        return res.status(200).json({ message: 'Upload successful', fileName, url: `/uploads/${fileName}` });
      });
return;
    try {
        let user = await VerifyToken(req, res,null);
        const { stage, reason } = req.body;
        const leadId = req.query.id;

        //  console.log(user)

        const lead = await AppDataSource.getRepository(Leads).findOne({
            where: { id: leadId }
        });

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        let newcomment = new Comment;
        newcomment.comment = stage;
        newcomment.lead = leadId;
        newcomment.user = user.id;
     // newcomment.created_at= new Date();
        

        await AppDataSource.getRepository(Comment).save(newcomment);

        if (!stage) {
            return res.status(404).json({ message: "Stage not found" });
        }

        const response: ResponseInstance = {
            message: "Stage changed",
            data: [],
            status: 200
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        const response: ResponseInstance = {
            message: "Something went wrong",
            data: [],
            status: 500
        }

        res.json(response);
    }
}
