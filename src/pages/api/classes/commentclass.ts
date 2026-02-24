import prisma from "@/app/lib/prisma";
import { Comment } from "@prisma/client";

class CommentClass {
    private commentId?: number;

    constructor(commentId?: number) {
        this.commentId = commentId;
    }

    // Create a new comment
    async createComment(commentData: any) {
        return await prisma.comment.create({
            data: commentData
        });
    }

    // Get comment by ID with relations
    async getCommentById() {
        if (!this.commentId) throw new Error("Comment ID is required");

        return await prisma.comment.findUnique({
            where: { id: this.commentId },
            include: {
                user: true,
                lead: true
            }
        });
    }

    // Update comment
    async updateComment(updateData: any) {
        if (!this.commentId) throw new Error("Comment ID is required");

        await prisma.comment.update({
            where: { id: this.commentId },
            data: updateData
        });
        return await this.getCommentById();
    }

    // Delete comment
    async deleteComment() {
        if (!this.commentId) throw new Error("Comment ID is required");

        return await prisma.comment.delete({
            where: { id: this.commentId }
        });
    }

    // Get all comments for a lead
    async getLeadComments(leadId: number) {
        return await prisma.comment.findMany({
            where: { lead_id: leadId },
            include: {
                user: true,
                lead: true
            },
            orderBy: {
                created_at: "desc"
            }
        });
    }

    // Get all comments by a user
    async getUserComments(userId: number) {
        return await prisma.comment.findMany({
            where: { user_id: userId },
            include: {
                user: true,
                lead: true
            },
            orderBy: {
                created_at: "desc"
            }
        });
    }
}

export default CommentClass; 