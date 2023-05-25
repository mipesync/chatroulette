import { CanActivate, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "src/user/user.service";
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from "@nestjs/common/exceptions";

@Injectable()
export class WsGuard implements CanActivate {
	constructor(private userService: UserService) {}

	canActivate(context: any,): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
		const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
		console.log("asd");
		
		try {
			const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET) as any;			
			
			return new Promise((resolve, reject) => {
				return this.userService.getUserById(decoded.userid).then(user => {					
					if (user) {
						resolve(user);
					} else {
						reject(false);
					}
				}).catch((err) => 
					context.args[0].emit('onException', err));
			});
		} catch (ex) {
			context.args[0].emit('onException', new UnauthorizedException('Пользователь не авторизован'));
			return false;
		}
	}
}