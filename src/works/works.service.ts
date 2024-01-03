import { Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorksService {

  constructor(private prisma: PrismaService) { }

  async create(createWorkDto: CreateWorkDto, req: any, file: any) {
    console.log(file)
    const createWork = await this.prisma.work.create({
      data: {
        userId: req.id,
        title: createWorkDto.title,
        picture: file.filename,
        tagline: createWorkDto.tagline,
        type: createWorkDto.type,
        category: createWorkDto.category,
        intro: createWorkDto.intro,
        status: createWorkDto.status,
      }
    });
    return {
      status: 200,
      data: createWork
    }
  }

  async findAll() {
    return await this.prisma.work.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.work.findFirst({ where: { id } });
  }

  async update(id: number, updateWorkDto: UpdateWorkDto, file: any) {
    const data = {
      title: updateWorkDto?.title,
      picture: file?.filename,
      tagline: updateWorkDto?.tagline,
      type: updateWorkDto?.type,
      category: updateWorkDto?.category,
      intro: updateWorkDto?.intro,
      status: updateWorkDto?.status,
    }
    const work = await this.prisma.work.findFirst({ where: { id } })
    const updateWork = await this.prisma.work.update({
      where: { id },
      data,
    });
    return {
      status: 200,
      data: updateWork
    }
  }

  async remove(id: number) {
    const work = await this.prisma.work.findFirst({ where: { id } })
    if (work) {
      await this.prisma.work.delete({ where: { id } })
    } else {
      return {
        status: 404,
        massage: `Not Found Work ID: ${id}`
      }
    }
    return {
      status: 200,
      massage: 'Success'
    };
  }
}
