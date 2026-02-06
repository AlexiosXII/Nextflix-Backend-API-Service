import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteRepositoryImpl } from './favorite.repository';
import { PrismaService } from '../../prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { ApplicationError } from 'src/common/errors/application.error';
import { FavoriteError } from 'src/core/domain/favorite/error/favorite.error';

describe('FavoriteRepositoryImpl', () => {
    let repository: FavoriteRepositoryImpl;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FavoriteRepositoryImpl,
                {
                    provide: PrismaService,
                    useValue: {
                        favorite: {
                            create: jest.fn(),
                            delete: jest.fn(),
                            findMany: jest.fn(),
                            count: jest.fn(),
                        },
                        $transaction: jest.fn(),
                    },
                },
            ],
        }).compile();

        repository = module.get<FavoriteRepositoryImpl>(FavoriteRepositoryImpl);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('addFavorite', () => {
        it('should add a favorite successfully', async () => {
            const userId = 1;
            const itemId = 100;
            const mockFavorite = {
                id: 1,
                userId,
                itemId,
                createdAt: new Date(),
            };

            jest.spyOn(prismaService.favorite, 'create').mockResolvedValueOnce(mockFavorite as any);

            const result = await repository.addFavorite(userId, itemId);

            expect(result).toEqual(mockFavorite);
            expect(prismaService.favorite.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    itemId,
                },
            });
        });

        it('should throw ApplicationError when favorite already exists (P2002)', async () => {
            const userId = 1;
            const itemId = 100;
            const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
                code: 'P2002',
                clientVersion: '2.0.0',
            });

            jest.spyOn(prismaService.favorite, 'create').mockRejectedValueOnce(prismaError);

            await expect(repository.addFavorite(userId, itemId)).rejects.toThrow(ApplicationError);
            expect(prismaService.favorite.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    itemId,
                },
            });
        });

        it('should rethrow other Prisma errors', async () => {
            const userId = 1;
            const itemId = 100;
            const prismaError = new Prisma.PrismaClientKnownRequestError('Some other error', {
                code: 'P3001',
                clientVersion: '2.0.0',
            });

            jest.spyOn(prismaService.favorite, 'create').mockRejectedValueOnce(prismaError);

            await expect(repository.addFavorite(userId, itemId)).rejects.toThrow(prismaError);
        });

        it('should rethrow non-Prisma errors', async () => {
            const userId = 1;
            const itemId = 100;
            const error = new Error('Database connection failed');

            jest.spyOn(prismaService.favorite, 'create').mockRejectedValueOnce(error);

            await expect(repository.addFavorite(userId, itemId)).rejects.toThrow(error);
        });
    });

    describe('removeFavorite', () => {
        it('should remove a favorite successfully', async () => {
            const userId = 1;
            const itemId = 100;

            jest.spyOn(prismaService.favorite, 'delete').mockResolvedValueOnce(undefined as any);

            const result = await repository.removeFavorite(userId, itemId);

            expect(result).toBeUndefined();
            expect(prismaService.favorite.delete).toHaveBeenCalledWith({
                where: {
                    userId_itemId: {
                        userId,
                        itemId,
                    },
                },
            });
        });

        it('should throw error when favorite does not exist', async () => {
            const userId = 1;
            const itemId = 100;
            const error = new Error(
                'An operation failed because it depends on one or more records that were required but not found.',
            );

            jest.spyOn(prismaService.favorite, 'delete').mockRejectedValueOnce(error);

            await expect(repository.removeFavorite(userId, itemId)).rejects.toThrow(error);
        });
    });

    describe('getFavoritesByUser', () => {
        it('should return paginated favorites for a user', async () => {
            const userId = 1;
            const page = 1;
            const pageSize = 10;
            const skip = 0;

            const mockFavorites = [
                { id: 1, userId: 1, itemId: 100, createdAt: new Date() },
                { id: 2, userId: 1, itemId: 101, createdAt: new Date() },
            ];

            jest.spyOn(prismaService, '$transaction').mockResolvedValueOnce([mockFavorites, 2] as any);

            const result = await repository.getFavoritesByUser(userId, page, pageSize);

            expect(result).toEqual({
                page: 1,
                totalPages: 1,
                totalResults: 2,
                result: mockFavorites,
            });

            expect(prismaService.$transaction).toHaveBeenCalled();
        });

        it('should handle multiple pages correctly', async () => {
            const userId = 1;
            const page = 2;
            const pageSize = 10;
            const skip = 10;

            const mockFavorites = [{ id: 11, userId: 1, itemId: 200, createdAt: new Date() }];

            jest.spyOn(prismaService, '$transaction').mockResolvedValueOnce([mockFavorites, 21] as any);

            const result = await repository.getFavoritesByUser(userId, page, pageSize);

            expect(result).toEqual({
                page: 2,
                totalPages: 3,
                totalResults: 21,
                result: mockFavorites,
            });
        });

        it('should return empty result when user has no favorites', async () => {
            const userId = 1;
            const page = 1;
            const pageSize = 10;

            jest.spyOn(prismaService, '$transaction').mockResolvedValueOnce([[], 0] as any);

            const result = await repository.getFavoritesByUser(userId, page, pageSize);

            expect(result).toEqual({
                page: 1,
                totalPages: 0,
                totalResults: 0,
                result: [],
            });
        });

        it('should calculate correct skip and take values', async () => {
            const userId = 1;
            const page = 3;
            const pageSize = 5;
            const expectedSkip = 10;
            const expectedTake = 5;

            jest.spyOn(prismaService, '$transaction').mockResolvedValueOnce([[], 15] as any);

            await repository.getFavoritesByUser(userId, page, pageSize);

            expect(prismaService.$transaction).toHaveBeenCalled();
        });
    });
});
