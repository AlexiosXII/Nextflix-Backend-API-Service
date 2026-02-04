import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'Full name of the user',
        example: 'John Doe',
        type: String,
    })
    @IsString()
    name: string;

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
