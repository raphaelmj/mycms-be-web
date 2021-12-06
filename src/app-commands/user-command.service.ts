import { Command, Console, createSpinner } from 'nestjs-console';
import { join } from 'path';
import * as fs from 'fs';
import { map } from 'p-iteration';
import { User } from 'src/entities/User';
import { PasswordService } from 'src/services/password.service';
import { UserRole } from '../enums/user-role.enum';

@Console()
export class UserCommandService {
  constructor(private passwordService: PasswordService) {}

  @Command({
    command: 'create-users',
  })
  async createUsers(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating users');

    await this.createAdmin();

    spin.succeed('created');
  }

  async createAdmin() {
    const admin = {
      password: await this.passwordService.getHash('4Deco123!'),
      email: 'admin@napollo.pl',
      status: true,
      role: UserRole.admin,
    };

    await User.create(admin).save();

    const redactor = {
      password: await this.passwordService.getHash('4Deco123!'),
      email: 'redactor@napollo.pl',
      status: true,
      role: UserRole.redactor,
    };

    await User.create(redactor).save();
  }
}
