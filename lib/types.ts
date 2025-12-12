export interface TokenPayload {
    id: string;
    _id?: string;        // optional now
    email: string;
    name: string;
    role: "admin" | "seller" | "user";
    iat?: number;
    exp?: number;
}