import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LinkGoogleStrategy extends PassportStrategy(Strategy, "link-google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/api/auth/google-link/redirect`,
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, emails } = profile;
    
    const user = {
      id: id,
      email: emails[0].value,
      accessToken,
      refreshToken
    };
    
    done(null, user);
  }
}