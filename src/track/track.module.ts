import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileService } from 'src/file/file.service'
import { Comment, CommentSchema } from './schema/comment.schema'
import { Track, TrackSchema } from './schema/track.schema'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'

@Module({
    controllers: [TrackController],
    providers: [TrackService, FileService],
    imports: [
        MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    ],
})
export class TrackModule {}
