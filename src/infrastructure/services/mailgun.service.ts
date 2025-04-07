import { EmailService } from "../../domain/services/EmailService";

export class MailgunEmailService implements EmailService {
    async sendEmailActivation(email: string, name: string): Promise<void> {
        console.log(`Sending email activation to ${email} with name ${name}`);
    }
    async sendEmailOrderConfirmation(email: string, name: string): Promise<void> {
        console.log(`Sending email order confirmation to ${email} with name ${name}`);
    }
}