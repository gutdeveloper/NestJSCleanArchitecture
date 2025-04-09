import { User } from "../entities/User.entity";
import { FindByEmail, FindUserById, IUser } from "../interfaces/user.interface";

export interface UserRepository {
  register(user: User): Promise<Pick<IUser, "email" | "name">>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<FindUserById | null>;
}
