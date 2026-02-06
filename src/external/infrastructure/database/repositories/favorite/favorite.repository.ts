import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { MethodTracer } from 'src/common/decorators/method-tracer/method-tracer.decorator';
import { FavoriteRepository } from 'src/core/domain/favorite/repository/favorite.repository.interface';
import { Favorite } from 'src/core/domain/favorite/entities/favorite.entiry';
import { PaginationType } from 'src/common/type/pagination.type';
import { Prisma } from 'src/generated/prisma/client';
import { ApplicationError } from 'src/common/errors/application.error';
import { FavoriteError } from 'src/core/domain/favorite/error/favorite.error';

/**
 * Implementation of the UserRepository interface.
 * Provides methods to interact with the user data storage.
 */
@MethodTracer()
@Injectable()
export class FavoriteRepositoryImpl implements FavoriteRepository {
    private readonly logger = new Logger(FavoriteRepositoryImpl.name);
    constructor(private prismaService: PrismaService) {}

    async addFavorite(userId: number, itemId: number): Promise<Favorite> {
        try {
            const createdFavorite = await this.prismaService.favorite.create({
                data: {
                    userId,
                    itemId,
                },
            });
            return createdFavorite;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ApplicationError(FavoriteError.FAVORITE_ALREADY_EXISTS);
                }
            }
            throw error;
        }
    }

    async removeFavorite(userId: number, itemId: number): Promise<void> {
        try {
            await this.prismaService.favorite.delete({
                where: {
                    userId_itemId: {
                        userId,
                        itemId,
                    },
                },
            });
            return;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new ApplicationError(FavoriteError.FAVORITE_NOT_FOUND);
                }
            }
            throw error;
        }
    }

    async getFavoritesByUser(userId: number, page: number, pageSize: number): Promise<PaginationType<Favorite>> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const [items, totalItems] = await this.prismaService.$transaction([
            this.prismaService.favorite.findMany({
                where: { userId },
                skip,
                take,
            }),
            this.prismaService.favorite.count({
                where: { userId },
            }),
        ]);
        const totalPages = Math.ceil(totalItems / pageSize);
        return {
            page: page,
            totalPages: totalPages,
            totalResults: totalItems,
            result: items.map((fav) => ({
                id: fav.id,
                userId: fav.userId,
                itemId: fav.itemId,
                createdAt: fav.createdAt,
            })),
        };
    }
}
