import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt); // делаем промис из функции

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email); //See if email is in use
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    //Hash the users password
    const salt = randomBytes(8).toString('hex'); //Generate a salt
    const hash = (await scrypt(password, salt, 32)) as Buffer; //Hash the salt and the password together
    const result = salt + '.' + hash.toString('hex'); //Join the hashed result and the salt together
    const user = await this.usersService.create(email, result); //Create a new user and save it

    return user; //Return the user
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong password');
    }
    return user;
  }
}
