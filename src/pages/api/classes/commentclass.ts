import { AppDataSource } from "@/app/lib/data-source";
import { Comment } from "@/app/entity/Comment";
import { Users } from "@/app/entity/Users";
import { Leads } from "@/app/entity/Leads";

class CommentClass {
    private commentId?: number;

    constructor(commentId?: number) {
        this.commentId = commentId;
    }

    // Create a new comment
    async createComment(commentData: Partial<Comment>) {
        const commentRepository = AppDataSource.getRepository(Comment);
        const newComment = commentRepository.create(commentData);
        return await commentRepository.save(newComment);
    }

    // Get comment by ID with relations
    async getCommentById() {
        if (!this.commentId) throw new Error("Comment ID is required");
        
        return await AppDataSource.getRepository(Comment)
            .createQueryBuilder("comment")
            .leftJoinAndSelect("comment.user", "user")
            .leftJoinAndSelect("comment.lead", "lead")
            .where("comment.id = :id", { id: this.commentId })
            .getOne();
    }

    // Update comment
    async updateComment(updateData: Partial<Comment>) {
        if (!this.commentId) throw new Error("Comment ID is required");
        
        const commentRepository = AppDataSource.getRepository(Comment);
        await commentRepository.update(this.commentId, updateData);
        return await this.getCommentById();
    }

    // Delete comment
    async deleteComment() {
        if (!this.commentId) throw new Error("Comment ID is required");
        
        const commentRepository = AppDataSource.getRepository(Comment);
        return await commentRepository.delete(this.commentId);
    }

    // Get all comments for a lead
    async getLeadComments(leadId: number) {
        return await AppDataSource.getRepository(Comment)
            .createQueryBuilder("comment")
            .leftJoinAndSelect("comment.user", "user")
            .leftJoinAndSelect("comment.lead", "lead")
            .where("comment.leadId = :leadId", { leadId })
            .orderBy("comment.created_at", "DESC")
            .getMany();
    }

    // Get all comments by a user
    async getUserComments(userId: number) {
        return await AppDataSource.getRepository(Comment)
            .createQueryBuilder("comment")
            .leftJoinAndSelect("comment.user", "user")
            .leftJoinAndSelect("comment.lead", "lead")
            .where("comment.userId = :userId", { userId })
            .orderBy("comment.created_at", "DESC")
            .getMany();
    }
}

export default CommentClass; 