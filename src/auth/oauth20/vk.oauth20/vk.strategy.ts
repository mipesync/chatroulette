import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-vkontakte";

@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, "vkontakte") {
    constructor() {
        super({
            clientID: process.env.VK_CLIENT_ID,
            clientSecret: process.env.VK_CLIENT_SECRET,
            callbackURL: `http://${process.env.HOST}:${process.env.PORT}/api/auth/vk/redirect`,
            scope: ["email"],
            lang: "ru"
        },
        async function myVerifyCallbackFn(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) { 
            const { id, username, emails, gender, name, _json, photos } = profile;

            const user = {
                id: id,
                email: emails[0].value,
                username: username,
                firstName: name.familyName,
                lastName: name.givenName,
                gender: gender || 'empty',
                accessToken,
                refreshToken,
                photo: photos[0].value
            };
            
            done(null, user);
        });
    }

    async validate(accessToken: string, refreshToken: string, params, profile: Profile, done) {
        const { id, email } = profile;
        const user = {
            id: id,
            email: email
        };
        
        done(null, user);
    }
}