export interface EmailService {
    sendEmailActivation(email: string, name: string): Promise<void>;
}