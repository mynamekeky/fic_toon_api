import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { WorksService } from './works.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createWorkDto: CreateWorkDto, @Request() req: any) {
    console.log(req.user.role)
    if (req.user.role != 'CREATOR') {
      throw new UnauthorizedException();
    }
    return this.worksService.create(createWorkDto, req.user);
  }

  @Get()
  findAll() {
    return this.worksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.worksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto) {
    return this.worksService.update(+id, updateWorkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.worksService.remove(+id);
  }
}
