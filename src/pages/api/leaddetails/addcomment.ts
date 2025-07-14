import { Leads } from "@/app/entity/Leads";
import { Comment } from "@/app/entity/Comment";
import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import cloudinary from "@/config/cloudnaryconfig";
import { getleadDetails } from "./getleaddetails";
import { activityLog } from "@/utils/activityLogs";
import { ActivityType } from "@/app/entity/Activity";

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

  try {


    let user = await VerifyToken(req, res, null);
    let fileurl;
    let comment;
    let leadId = req.query.id;
    let id;
    let updatedlead ;

    const uploadDir = path.join(process.cwd(), '/tmp');

    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    });

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    form.parse(req, async (err, fields, files) => {

      const uploadedFile = files.file;
      if (uploadedFile) {
        const filePath = Array.isArray(uploadedFile)
          ? uploadedFile[0].filepath
          : uploadedFile.filepath;

        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'crm_uploads',
          resource_type: 'auto',
        });


        fs.unlinkSync(filePath);


        fileurl = result.secure_url;

        comment = JSON.parse(fields.comment)
      } else {
        comment = JSON.parse(fields.comment)
      }

      const leadId = comment.id;

      const lead = await AppDataSource.getRepository(Leads).findOne({
        where: { id: leadId }
      });


      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      let newcomment = new Comment;
      newcomment.lead = leadId;
      newcomment.user = user.id;
      newcomment.comment = comment.text
      newcomment.created_at= comment.timestamp;
      newcomment.url = fileurl;
      newcomment.type = 'image'


      await AppDataSource.getRepository(Comment).save(newcomment);

      updatedlead = await getleadDetails(user,leadId);

   if(updatedlead){
    let discription = `${user.name} commented on lead `
    await activityLog(ActivityType.COMMENT,discription,user,lead)
    res.json(updatedlead);
   }

    });

    

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
