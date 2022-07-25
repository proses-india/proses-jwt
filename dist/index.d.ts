interface config {
    secret: string;
    expiry: string;
    interceptor?: Function;
    customErrorHandler?: Function;
}
declare class Jwtinstance {
    secret: string;
    expiry: string;
    currentUser: any;
    private _interCeptor;
    private _customErrorHandler;
    init({ secret, expiry, interceptor, customErrorHandler }: config): void;
    generateToken(payload: any): string;
    tokenMiddleWare(req: any, res: any, next: any): void;
    verifyToken(token: any): boolean;
}
declare let instance: Jwtinstance;
export default instance;
