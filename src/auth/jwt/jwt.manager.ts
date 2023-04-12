import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class JwtManager {
	createJwtService(expires: string): JwtService {
		return new JwtService({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: expires },
		});
	}

	generateAccessToken(user: any) {
		let jwtService = this.createJwtService('30m');

		const payload = {
			email: user.email,
			username: user.username,
			userid: user.id,
			role: user.role,
		}

		return {
			access_token: jwtService.sign(payload),
			expires: this.addMinutes(30).getTime()
		}
	}

	generateRefreshToken(userId: string, hash: string) {
		let jwtService = this.createJwtService('7d');

		const payload = {
			userId,
			hash,
			type: 'refresh_token'
		}

		return {
			refresh_token: jwtService.sign(payload),
			expires: this.addDays(7).getTime()
		};
	}

	parseToken(token: string) {
		let jwtService = this.createJwtService('30m');

		const user = jwtService.verify(token);
		return user;
	}

	decodeToken(token: string) {
        const base64Payload = token.split('.')[1];
        const payloadBuffer = Buffer.from(base64Payload, 'base64');
        const updatedJwtPayload: JwtPayload = JSON.parse(payloadBuffer.toString()) as JwtPayload;

		return updatedJwtPayload;
	}

	private addMinutes(minutes : number){
		var futureDate = new Date();
		futureDate.setMinutes(futureDate.getMinutes() + minutes);
		return futureDate;
	}

	private addDays(days : number){
		var futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + days);
		return futureDate;
	}
}