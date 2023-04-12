import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-yandex";

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, "yandex") {
    constructor() {
        super({            
            clientID: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
            callbackURL: `http://${process.env.HOST}:${process.env.PORT}/api/auth/yandex/redirect`
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done) {
        const { id, emails, gender, name, _json, photos } = profile;

        const user = {
            id: id,
            email: emails[0].value,
            username: _json.login,
            firstName: name.familyName,
            lastName: name.givenName,
            gender: gender || 'empty',
            accessToken,
            refreshToken,
            photo: photos[0].value
        };
        
        done(null, user);
    }
}