import { Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorksService {

  constructor(private prisma: PrismaService) { }

  async create(createWorkDto: CreateWorkDto, req: any) {

    return await this.prisma.work.create({
      data: {
        userId: req.id,
        title: createWorkDto.title,
        picture: createWorkDto.picture,
        tagline: createWorkDto.tagline,
        type: createWorkDto.type,
        category: createWorkDto.category,
        intro: createWorkDto.intro,
        status: createWorkDto.status,
      }
    });
  }

  async findAll() {
    return await this.prisma.work.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} work`;
  }

  update(id: number, updateWorkDto: UpdateWorkDto) {
    return `This action updates a #${id} work`;
  }

  remove(id: number) {
    return `This action removes a #${id} work`;
  }
}
