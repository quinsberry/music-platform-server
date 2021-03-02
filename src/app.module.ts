import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'
import { FileModule } from './file/file.module'
import { TrackModule } from './track/track.module'
import * as path from 'path'

@Module({
    imports: [
        TrackModule,
        FileModule,
        MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.qasve.mongodb.net/music-platform?retryWrites=true&w=majority'),
        ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static') }),
    ],
})
export class AppModule {}
