import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import cloudinary from "@/config/cloudnaryconfig";
import { getleadDetails } from "./getleaddetails";
import { activityLog } from "@/utils/activityLogs";
import { ActivityType } from "@/utils/activityTypes";
import { createNotification } from "@/utils/notifications";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function addComment(req: any, res: any) {
  const user = await VerifyToken(req, res, null);
  if (res.writableEnded) return;

  try {
    const tmpDir = path.join(process.cwd(), '/tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const form = formidable({
      multiples: false,
      uploadDir: tmpDir,
      keepExtensions: true,
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        return res.status(500).json({ message: "Form parsing error", error: err.message, status: 500 });
      }

      let fileurl = '';
      let commentData;

      const uploadedFile = files.file;
      if (uploadedFile) {
        const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;
        const filePath = file.filepath;

        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: 'crm_uploads',
            resource_type: 'auto',
          });
          fileurl = result.secure_url;
        } catch (uploadError: any) {
          console.error("Cloudinary upload failed:", uploadError);
        } finally {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        commentData = JSON.parse(Array.isArray(fields.comment) ? fields.comment[0] : fields.comment);
      } else {
        commentData = JSON.parse(Array.isArray(fields.comment) ? fields.comment[0] : fields.comment);
      }

      const leadId = Number(commentData.id);

      await prisma.comment.create({
        data: {
          lead_id: leadId,
          user_id: user.id,
          comment: commentData.text,
          created_at: new Date(commentData.timestamp || Date.now()),
          url: fileurl,
          type: 'image'
        }
      });

      const updatedLead = await getleadDetails(user, leadId);

      if (updatedLead) {
        const description = `${user.name} commented on lead`;
        await activityLog(ActivityType.COMMENT, description, user.id, leadId);

        // Parse mentions (@Name)
        const mentionRegex = /@(\w+)/g;
        const mentions = commentData.text.match(mentionRegex);

        if (mentions) {
          for (const mention of mentions) {
            const userName = mention.substring(1);
            const mentionedUser = await prisma.user.findFirst({
              where: {
                name: { contains: userName },
                business_id: user.business
              }
            });

            if (mentionedUser && mentionedUser.id !== user.id) {
              const lead = await prisma.lead.findUnique({ where: { id: leadId } });
              await createNotification(
                mentionedUser.id,
                `${user.name} mentioned you in a comment on lead ${lead?.email || `#${leadId}`}`,
                `/leads/details/${leadId}`
              );
            }
          }
        }
      }

      return res.status(200).json(updatedLead);
    });

  } catch (error: any) {
    console.error("AddComment Error:", error);
    return res.status(500).json({
      message: "Something went wrong",
      data: error.message,
      status: 500
    });
  }
}
