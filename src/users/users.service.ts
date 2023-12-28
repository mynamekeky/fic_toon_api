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
    if (createUserDto.passwordConfirm == createUserDto.password) {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        roundsOfHashing,
      );
      createUserDto.password = hashedPassword;

      return this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
          email: createUserDto.email,
          name: createUserDto.name,
          role: createUserDto.role
        },
      });
    } else {
      return {
        status: 500,
        message: 'Password Are Not Same'
      }
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

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}