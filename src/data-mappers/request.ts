import { Request } from "express";

export interface IAuthorizedRequest extends Request {
  user: {
    given_name: string;
    family_name: string;
    email: string;
    id: string;
  };
}
