import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLog, AuditLogDocument } from "./schemas/audit-log.schema";
import { CreateAuditLogDto } from "./dto/create-audit-log.dto";

@Injectable()
export class AuditLogsService {
    constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>) {}

    async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
        const createdAuditLog = new this.auditLogModel(createAuditLogDto);
        return createdAuditLog.save();
    }

    async findAll(): Promise<AuditLog[]> {
        return this.auditLogModel.find().populate("user_id").sort({ createdAt: -1 }).exec();
    }

    async findByUserId(userId: string): Promise<AuditLog[]> {
        return this.auditLogModel.find({ user_id: userId }).sort({ createdAt: -1 }).exec();
    }

    async findByAction(action: string): Promise<AuditLog[]> {
        return this.auditLogModel.find({ action }).sort({ createdAt: -1 }).exec();
    }
}
