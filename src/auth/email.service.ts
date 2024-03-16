import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { EmailOptions } from "src/email/interfaces/email-options.interface";



@Injectable()
export class EmailService {

  constructor(
    private readonly mailerService: MailerService
  ){
  }

  public async sendEmailVerification( emailOptions: EmailOptions){
      try{
        await this.mailerService.sendMail({
          to: emailOptions.to,
          subject: emailOptions.subject,
           html: emailOptions.html
      });

        return true;
      } catch( error ){
        return false;
      }
  }



}
