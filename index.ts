import { unauthorized } from "proses-response";
import jwt from "jsonwebtoken";

interface config {
  secret: string;
  expiry: string;
  interceptor?: Function;
  customErrorHandler?: Function;
}

class Jwtinstance {
  secret: string = "zxcasdqwemnblkjpoi";
  expiry: string = "12h";
  currentUser: any;
  private _interCeptor!: Function|undefined;
  private _customErrorHandler!: Function|undefined;

  init({secret, expiry, interceptor, customErrorHandler}: config) {
    this.secret = secret;
    this.expiry = expiry;
    this._interCeptor = interceptor;
    this._customErrorHandler = customErrorHandler;
  }

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiry });
  }

  tokenMiddleWare(req: any, res: any, next: any) {
    try {
      const token = req.header("authorization");

      if (!token) {
        return unauthorized(res, "Invalid token");
      }

      const decoded: any = jwt.verify(token, this.secret);
      if (this._interCeptor) {
        this._interCeptor(decoded);
      }
      req.user = decoded;
      this.currentUser = decoded;
      next();
    } catch (error) {
      if (this._customErrorHandler) {
        this._customErrorHandler(error);
      } else {
        unauthorized(res, "token expired");
      }
    }
  }

  verifyToken(token: any): boolean {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch (error) {
      return false;
    }
  }
}

let instance = new Jwtinstance();

export default instance;
