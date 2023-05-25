import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUsernameDto } from './dto/updateUsername.dto';
import { User, UserDocument } from './schemas/user.schema';
import { DetailsViewModel } from './viewModel/details.viewModel';
import { UserViewModel } from './viewModel/user.viewModel';
import { Roles } from 'src/common/permissions-manager/roles';
import { BlockUserDto } from './dto/block-user.dto';
import { UnblockUserDto } from './dto/unblock-user.dto';
import { Queue } from 'src/gateways/room-gateway/queue';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async getUserById(userId: string): Promise<UserDocument> {
        let user = await this.userModel.findById(userId).catch(e => {
            console.log(e.message);
            
            throw new BadRequestException("Неверный id");
        });  

        if (!user) throw new NotFoundException('Пользователь не найден');

        return user;
    }

    async getAll(redis: any) {
        let queuesKey = await redis.keys("*");

        let queues: Queue[] = [];

        queuesKey.forEach(async queueKey => {
            let queue: Queue = JSON.parse(await redis.get(queueKey)) as Queue;
            queues.push(queue);
        });
        
        let users = await this.userModel.find();

        let usersVM: any[] = [];        

        users.forEach((user) => {
            const item = queues.find(item => item.userId === user.id);

            if (!user.blocked) {
                usersVM.push({
                    id: user.id,
                    username: user.username,
                    fullname: `${user.lastname} ${user.firstname}`,
                    isActive: item ? true : false
                });                
            }
        });

        return usersVM;
    }

    async getBlocked() {        
        let users = await this.userModel.find();

        let usersVM: any[] = [];        

        users.forEach((user) => {
            if (user.blocked) {
                usersVM.push({
                    id: user.id,
                    username: user.username,
                    fullname: `${user.lastname} ${user.firstname}`,
                    reason: user.reason,
                    lockdownEnd: user.lockdownEnd
                });                
            }
        });

        return usersVM;
    }

    async getOnline(redis: any) {
        let queuesKey = await redis.keys("*");

        let queues: Queue[] = [];

        queuesKey.forEach(async queueKey => {
            let queue: Queue = JSON.parse(await redis.get(queueKey)) as Queue;
            queues.push(queue);
        });

        let busy = queues.filter(item => item.isBusy).length;
        let online = queues.length;

        return {
            busy,
            online
        }
    }

    async getDetails(userId: string, host?: string) {
        let user = await this.getUserById(userId);

        let result = {
            id: user.id,
            username: user.username,
            fullname: `${user.lastname} ${user.firstname}`,
            role: user.role,
            email: user.email,
            gender: user.gender,
            country: user.country,
            blocked: user.blocked
        };

        return result;
    }

    async updateUsername(updateUsernameDto: UpdateUsernameDto) {
        let user = await this.getUserById(updateUsernameDto.userId);

        user.username = updateUsernameDto.newUserName;
        user.save();
    }

    async block(dto: BlockUserDto): Promise<any> {        
        let user = await this.getUserById(dto.userId);

        const judge = await this.getUserById(dto.judgeId);
        if (judge.role !== Roles.ADMINISTRATOR) throw new ForbiddenException("Вы не являетесь администратором");

        user.lockdownEnd = dto.lockdownEnd;
        user.blocked = true;
        user.reason = dto.reason;
        await user.save();
    }

    async unBlock(dto: UnblockUserDto): Promise<any> {        
        let user = await this.getUserById(dto.userId);

        const judge = await this.getUserById(dto.judgeId);
        if (judge.role !== Roles.ADMINISTRATOR) throw new ForbiddenException("Вы не являетесь администратором");

        user.lockdownEnd = null;
        user.blocked = false;
        user.reason = null;
        await user.save();
    }
}
