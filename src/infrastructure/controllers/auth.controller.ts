import { Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { AuthUseCase } from "src/application/useCases/auth/AuthUseCase";
import { LoginDTO } from "../dto/login.dto";
import { RegisterUserDTO } from "../dto/register.dto";
import { User } from "src/domain/entities/User.entity";
import { Public } from "../constants/is-public.constants";
import { Role } from "src/domain/enums/role.enum";
import { Roles } from "../decorators/roles.decorator";

@Controller("auth")
export class AuthController {
    constructor(@Inject("AuthUseCase") private readonly authUseCase: AuthUseCase) { }

    @Public()
    @Post("/login")
    async login(@Body() body: LoginDTO) {
        const { email, password } = body;
        const token = await this.authUseCase.loginUser(email, password);
        return { token };
    }

    @Public()
    @Post("/register")
    async registerUser(@Body() body: RegisterUserDTO) {
        const { first_name, last_name, email, password } = body;
        return await this.authUseCase.registerUser({ first_name, last_name, email, password });
    }

    @Roles(Role.USER)
    @Get("/profile")
    async userProfile(@Req() req: any) {
        const userId = req.user.id;
        const user = await this.authUseCase.userProfile(userId);
        return user;
    }
}