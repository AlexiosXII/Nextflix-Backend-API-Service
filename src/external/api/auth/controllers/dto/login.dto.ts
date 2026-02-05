import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'Email address of the user',
        example: 'john.doe@example.com',
        type: String,
        format: 'email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password for the user account',
        example: 'strongpassword123',
        type: String,
    })
    @IsString()
    password: string;
}
