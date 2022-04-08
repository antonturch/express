export interface OrderAttributes {
  id: number;
  uId: number;
  pId: number;
}

export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  img: string;
}

export interface UsersAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken: string;
}
