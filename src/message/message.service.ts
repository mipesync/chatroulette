import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, mkdir, writeFile } from 'fs';
import { Model } from 'mongoose';
import { basename, extname, join } from 'path';
import { Room, RoomDocument } from 'src/room/schemas/room.schema';

@Injectable()
export class MessageService {
    constructor(@InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>) {}

    fileNameIncrement(filePath: string, originalName: string): string {
        let fileExt = extname(originalName);
        let newFileName: string = null;
        let iter = 1;
        while(true) {
            newFileName = `${basename(originalName, fileExt)}_${iter}${fileExt}`
            if (!existsSync(filePath + newFileName)) {
                break;
            }
            iter++;
        }

        return newFileName;
    }
}
