import { ApiProperty } from "@nestjs/swagger"
import { Category, Status, Type } from "@prisma/client"
import { IsEnum } from "class-validator"

export class CreateWorkDto {

    @ApiProperty()
    title: string

    @ApiProperty()
    picture: string

    @ApiProperty()
    tagline: string

    @IsEnum(Type)
    @ApiProperty()
    type: Type

    @IsEnum(Category)
    @ApiProperty()
    category: Category

    @ApiProperty()
    intro: string

    @IsEnum(Status)
    @ApiProperty()
    status: Status

}
