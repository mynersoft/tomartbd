declare module "jsonwebtoken" {
	export function sign(
		payload: string | object | Buffer,
		secret: string,
		options?: object
	): string;

	export function verify(token: string, secret: string): any;
}

declare module "pdfkit";

export type ID = string;

export interface CartItem {
	productId: ID;
	quantity: number;
}

export interface LoginBody {
	email: string;
	password: string;
}
