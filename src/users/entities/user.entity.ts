import { ApiProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';

export class UserEntity implements User {
    
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    userName: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    createdAt: Date;
    
    @ApiProperty()
    updatedAt: Date;

    role: $Enums.Role;
}