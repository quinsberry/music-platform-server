import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { CreateTrackDto } from './dto/create-track.dto'
import { Comment, CommentDocument } from './schema/comment.schema'
import { Track, TrackDocument } from './schema/track.schema'
import { CreateCommentDto } from './dto/create-comment.dto'
import { FileService, FileType } from 'src/file/file.service'

@Injectable()
export class TrackService {
    constructor(
        @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
        @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
        private fileService: FileService
    ) {}

    async create(dto: CreateTrackDto, picture, audio): Promise<Track> {
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio)
        const picturePath = this.fileService.createFile(FileType.IMAGE, picture)
        return await this.trackModel.create({ ...dto, listens: 0, audio: audioPath, picture: picturePath })
    }

    async getAll(count = 10, offset = 0): Promise<Track[]> {
        return await this.trackModel.find().skip(Number(offset)).limit(Number(count))
    }

    async getOne(id: ObjectId): Promise<Track> {
        return await this.trackModel.findById(id).populate('comments')
    }

    async delete(id: ObjectId): Promise<Track> {
        const track = await this.trackModel.findByIdAndDelete(id)
        return track._id
    }

    async addComment(dto: CreateCommentDto): Promise<Comment> {
        const track = await this.trackModel.findById(dto.trackId)
        const comment = await this.commentModel.create({ ...dto })
        track.comments.push(comment._id)
        await track.save()

        return comment
    }

    async listen(id: ObjectId): Promise<any> {
        const track = await this.trackModel.findById(id)
        track.listens++
        await track.save()
        return new HttpException('success', HttpStatus.OK)
    }

    async search(query: string) {
        return await this.trackModel.find({
            name: { $regex: new RegExp(query, 'i') },
        })
    }
}
