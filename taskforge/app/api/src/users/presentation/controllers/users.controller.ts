import { Controller, Param, UseGuards, Delete, Get } from "@nestjs/common";
import { Role } from '@taskforge/shared';
import { Roles } from "src/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UsersService } from "src/users/business.logic/services/users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUsers() {
        return await this.userService.findAllUsers();
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteUser(@Param() userId: string) {
        await this.userService.deleteUserById(userId);
        return {message: `User ${userId} deleted successfully`};
    }
    
}