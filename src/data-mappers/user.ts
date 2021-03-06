import { IUserFull, IUser } from "../db/modelsType";

const userToDTO = (user: IUserFull): IUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
};

export default userToDTO;
