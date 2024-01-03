import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const users = await this.findAll();
    let data = {
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
      name: createUserDto.name,
      role: createUserDto.role
    }
    for (const item of users) {
      if (createUserDto.username == item.username) {
        return {
          status: 500,
          massage: 'Username Already Exits'
        }
      }

      if (createUserDto.email == item.email) {
        return {
          status: 500,
          massage: 'Email Already Exits'
        }
      }
    }
    if (createUserDto.passwordConfirm == createUserDto.password) {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        roundsOfHashing,
      );
      createUserDto.password = hashedPassword;
      data.password = createUserDto.password
    } else {
      return {
        status: 500,
        message: 'Password Are Not Same'
      }
    }
    const createUser = await this.prisma.user.create({ data })
    return {
      status: 200,
      data: createUser
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}