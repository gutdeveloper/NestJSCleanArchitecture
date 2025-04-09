export interface TokenService {
    generate(payloadToken: Record<string, any>): string;
    verify(token: string): string | null;
}