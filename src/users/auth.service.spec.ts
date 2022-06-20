import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a Fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    // Promise.resolve({ id: 1, email, password } as User),

    //Create a module
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    //get an instans of service
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdas@asd.com', 'asdas');

    expect(user.password).not.toEqual('asdas');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: 'a' } as User]);
    await expect(service.signup('asdas@asd.com', 'asdas')).rejects.toThrow(
      BadRequestException,
    );
    // await service.signup('asasdad1@asdasda.com', 'asdsadas');
    // try {
    //   service.signup('asasdad1@asdasda.com', 'asdsadas');
    // } catch (error) {
    //   // done();
    // }
  });

  it('throws if signin is called with unused email', async () => {
    try {
      await service.signin('asasdad@asdasda.com', 'asdsadas');
    } catch (error) {
      // done();
    }
  });

  it('throws if an invalid password is provided', async () => {
    //async(done)
    await service.signup('dfgdhf@klhdsf.com', 'password');
    try {
      await service.signin('dfgdhf@klhdsf.com', 'gfjdghjgh');
    } catch (error) {
      // done();
    }
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'asasdad@asdasda.com',
    //       password:
    //         '8591a6adbeb8dbd0.951fb431043d969837629f2b265f802df726c393bcfdcddb6e9e068a292ba193',
    //     } as User,
    //   ]);
    await service.signup('asasdad@asdasda.com', 'mypassword');

    const user = await service.signin('asasdad@asdasda.com', 'mypassword');
    expect(user).toBeDefined();
    // const user = await service.signup('asasdad@asdasda.com', 'mypassword');
    // console.log(user);
  });
});
