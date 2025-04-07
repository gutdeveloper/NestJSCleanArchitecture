export interface TokenService {
    generate(id: string): string;
    verify(token: string): string | null;
}