import { UserRepositoryImpl } from './user.repository';
import { ApplicationError } from 'src/common/errors/application.error';
import { UserError } from 'src/core/domain/user/user.error';

describe('UserRepositoryImpl', () => {
    let repo: UserRepositoryImpl;
    let mockPrisma: any;

    beforeEach(() => {
        mockPrisma = {
            user: {
                findUnique: jest.fn(),
                create: jest.fn(),
            },
        };
        // @ts-ignore - inject mocked prisma
        repo = new UserRepositoryImpl(mockPrisma);
    });

    describe('findById', () => {
        it('returns a mapped user when found', async () => {
            const prismaUser = { id: 1, name: 'Alice', email: 'a@x.com', password: 'secret' };
            mockPrisma.user.findUnique.mockResolvedValue(prismaUser);

            const result = await repo.findById(1);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ id: 1, name: 'Alice', email: 'a@x.com' });
        });

        it('throws ApplicationError when user not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(repo.findById(999)).rejects.toBeInstanceOf(ApplicationError);
            await expect(repo.findById(999)).rejects.toThrow(UserError.USER_NOT_FOUND);
        });
    });

    describe('create', () => {
        it('throws when password is missing', async () => {
            const user = { name: 'Bob', email: 'b@x.com' } as any;

            await expect(repo.create(user)).rejects.toBeInstanceOf(ApplicationError);
            await expect(repo.create(user)).rejects.toThrow(UserError.PASSWORD_REQUIRED);
        });

        it('creates and returns the new user when password provided', async () => {
            const input = { name: 'Carol', email: 'c@x.com', password: 'pw' } as any;
            const created = { id: 42, name: 'Carol', email: 'c@x.com' };
            mockPrisma.user.create.mockResolvedValue(created);

            const result = await repo.create(input);

            expect(mockPrisma.user.create).toHaveBeenCalled();
            expect(result).toEqual({ id: 42, name: 'Carol', email: 'c@x.com' });
        });
    });

    describe('findByEmail', () => {
        it('returns a mapped user when found', async () => {
            const prismaUser = { id: 3, name: 'Dana', email: 'd@x.com', password: 'secret' };
            mockPrisma.user.findUnique.mockResolvedValue(prismaUser);

            const result = await repo.findByEmail('d@x.com');

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'd@x.com' } });
            expect(result).toEqual({ id: 3, name: 'Dana', email: 'd@x.com', password: 'secret' });
        });

        it('returns null when user not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const result = await repo.findByEmail('nope@x.com');

            expect(result).toBeNull();
        });
    });
});
