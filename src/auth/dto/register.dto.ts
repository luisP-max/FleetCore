import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength} from 'class-validator'
import { Role } from '../../users/enums/role.enum.js'

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}