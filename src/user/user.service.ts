import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { USERNAME_ALREADY_USED } from '../constant/error.constant';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  findOne(username: string) {
    return this.userModel.findOne({ username });
  }

  async createUser(createUserDto: SignUpDto) {
    const existingUser = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (existingUser) {
      throw new BadRequestException({ ...USERNAME_ALREADY_USED });
    }

    const password = await this.hashPassword(createUserDto.password);
    const user = this.userModel.create({ ...createUserDto, password });
    return user;
  }

  private hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}
