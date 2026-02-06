import {
    Controller,
    Get,
    Inject,
    UseGuards,
    Req,
    Query,
    Param,
    Post,
    Body,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiInternalServerErrorResponse,
    ApiHeader,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { InternalServerErrorResponseDto } from 'src/common/dto/error-response.dto';
import { AddFavoriteUseCase } from 'src/core/usecase/favorite/add-favorite.usecase';
import { AddFavoriteDto } from './dto/favorite.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { DeleteFavoriteUseCase } from 'src/core/usecase/favorite/delete-favorite.usecase';
import { GetFavoritesUseCase } from 'src/core/usecase/favorite/get-favorites.usecase';
import { Favorite } from 'src/core/domain/favorite/entities/favorite.entiry';
import { PaginationType } from 'src/common/type/pagination.type';
import { Movie } from 'src/core/domain/movie/entities/movie.entity';
import { MovieSuccessResponseDto } from '../../movie/controllers/dto/movie.dto';

@ApiTags('Favorites')
@ApiHeader({
    name: 'x-language',
    description: 'Language header',
    required: false,
    schema: {
        type: 'string',
        example: 'en',
    },
})
@Controller('favorites')
export class FavoriteController {
    constructor(
        @Inject(AddFavoriteUseCase.providerName)
        private readonly addFavoriteUseCase: AddFavoriteUseCase,
        @Inject(DeleteFavoriteUseCase.providerName)
        private readonly deleteFavoriteUseCase: DeleteFavoriteUseCase,
        @Inject(GetFavoritesUseCase.providerName)
        private readonly getFavoritesUseCase: GetFavoritesUseCase,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Add a favorite',
        description: "Adds an item to the user's favorites",
    })
    @ApiResponse({
        status: 201,
        description: 'Favorite added successfully',
        type: SuccessResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard)
    async addFavorite(@Req() req: any, @Body() addFavoriteDto: AddFavoriteDto): Promise<void> {
        const userId = req.user?.userId;
        await this.addFavoriteUseCase.execute(userId, addFavoriteDto.favoriteId);
        return;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a favorite',
        description: "Removes an item from the user's favorites",
    })
    @ApiResponse({
        status: 200,
        description: 'Favorite deleted successfully',
        type: SuccessResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard)
    async deleteFavorite(@Req() req: any, @Param('id', ParseIntPipe) favoriteId: number): Promise<void> {
        const userId = req.user?.userId;
        await this.deleteFavoriteUseCase.execute(userId, favoriteId);
        return;
    }

    @Get()
    @ApiOperation({
        summary: 'Get user favorites',
        description: "Retrieves a list of the user's favorite items",
    })
    @ApiResponse({
        status: 200,
        description: 'Favorites retrieved successfully',
        type: MovieSuccessResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'Internal server error',
        type: InternalServerErrorResponseDto,
    })
    @ApiBearerAuth('access-token')
    @UseGuards(AuthGuard)
    async getFavorites(
        @Req() req: any,
        @Query('page', ParseIntPipe) page: number = 1,
        @Query('pageSize', ParseIntPipe) pageSize: number = 10,
    ): Promise<PaginationType<Movie>> {
        const userId = req.user?.userId;
        const favoriteMovies = await this.getFavoritesUseCase.execute(userId, page, pageSize);
        return favoriteMovies;
    }
}
