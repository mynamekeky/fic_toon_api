import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEspisodeDto } from './dto/create-espisode.dto';
import { UpdateEspisodeDto } from './dto/update-espisode.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EspisodesService {
  constructor(private prisma: PrismaService) { }

  async create(createEspisodeDto: CreateEspisodeDto, files: Express.Multer.File[]) {

    const createEspisode = await this.prisma.espisode.create({
      data: {
        workId: createEspisodeDto.workId,
        title: createEspisodeDto.title,
        status: createEspisodeDto.status,
        contentText: createEspisodeDto.contentText
      }
    })
    if (!createEspisode) {
      throw new InternalServerErrorException();
    }
    console.log(files)
    if (files) {
      const img = files.map((item) => {
        return {
          espisodeId: createEspisode.id,
          picture: item.originalname
        }
      })
      const createImgEp = await this.prisma.espisodePicture.createMany({
        data: img
      })
      console.log(createImgEp)
    }

    return {
      statusCode: 200,
      data: createEspisode
    };
  }

  async findAll() {
    const data = await this.prisma.espisode.findMany({ include: { pictures: true } })
    return data;
  }

  async findOne(id: number) {
    const data = await this.prisma.espisode.findFirst({ where: { id }, include: { pictures: true } })
    if (!data) {
      throw new NotFoundException()
    }
    return data;
  }

  async update(id: number, updateEspisodeDto: UpdateEspisodeDto, files: Express.Multer.File[]) {
    const findEp = await this.prisma.espisode.findFirst({ where: { id } })
    if (!findEp) {
      throw new NotFoundException()
    }

    const espisodeData: Prisma.EspisodeUncheckedUpdateInput = {
      workId: updateEspisodeDto.workId,
      title: updateEspisodeDto.title,
      status: updateEspisodeDto.status,
      contentText: updateEspisodeDto.contentText
    }
    console.log(files)
    if (updateEspisodeDto.pictures) {
      const getData = await this.prisma.espisodePicture.findMany({ where: { espisodeId: id } })

      if (getData.length < 1) {
        const img = files.map((item) => {
          return {
            espisodeId: id,
            picture: item.originalname
          }
        })
        const createImgEp = await this.prisma.espisodePicture.createMany({
          data: img
        })
        console.log(createImgEp)
      }

      const espisodePictureData: Prisma.EspisodePictureWhereUniqueInput[] = await Promise.all(
        updateEspisodeDto.pictures.map(async (item, index) => {
          const foundImage = files.find(
            (image) => image.fieldname === `pictures[${index}][image]`,
          );

          // console.log(foundImage)
          if (foundImage) {
            const findImage =
              await this.prisma.espisodePicture.findMany({ where: { espisodeId: id } });
            return {
              id: item?.id,
              picture: foundImage?.filename
            }
          }
        }),
      );
      espisodeData.pictures = {
        updateMany: espisodePictureData?.map((item) => {
          return {
            where: { id: item.id },
            data: { ...item }
          }
        })
      }
    }

    const updateEspisode = await this.prisma.espisode.update({
      where: { id },
      data: espisodeData
    })

    return {
      statusCode: 200,
      data: updateEspisode
    };
  }

  async remove(id: number) {
    return await this.prisma.espisode.delete({ where: { id } })
  }
}
