export interface TokenService {
    generate(payloadToken: Record<string, any>): string;
    verify(token: string): { id: string; role: string } | null;
}