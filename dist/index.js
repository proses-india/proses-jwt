"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const proses_response_1 = require("proses-response");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Jwtinstance {
    constructor() {
        this.secret = "zxcasdqwemnblkjpoi";
        this.expiry = "12h";
    }
    init({ secret, expiry, interceptor, customErrorHandler }) {
        this.secret = secret;
        this.expiry = expiry;
        this._interCeptor = interceptor;
        this._customErrorHandler = customErrorHandler;
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: this.expiry });
    }
    tokenMiddleWare(req, res, next) {
        try {
            const token = req.header("authorization");
            if (!token) {
                return (0, proses_response_1.unauthorized)(res, "Invalid token");
            }
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            if (this._interCeptor) {
                this._interCeptor(decoded);
            }
            req.user = decoded;
            this.currentUser = decoded;
            next();
        }
        catch (error) {
            if (this._customErrorHandler) {
                this._customErrorHandler(error);
            }
            else {
                (0, proses_response_1.unauthorized)(res, "token expired");
            }
        }
    }
    verifyToken(token) {
        try {
            jsonwebtoken_1.default.verify(token, this.secret);
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
let instance = new Jwtinstance();
exports.default = instance;
