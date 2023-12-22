import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOkResponse({ type: AuthEntity })
    async login(@Body() { username, password }: LoginDto) {
        return this.authService.login(username, password);
    }

    @Get('getUser')
    async getUser(@Request() req: any) {
        console.log(req)
        return;
    }
}