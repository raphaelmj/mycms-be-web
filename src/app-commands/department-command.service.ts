import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Department } from '../entities/Department';
import * as fs from 'fs';

@Console()
export class DepartmentCommandService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  @Command({
    command: 'create-departments',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating departments');
    await this.make();
    spin.succeed('created');
  }

  async make() {
    const departments: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/departments.json',
    );
    const departmentsList: Array<Record<any, unknown>> = JSON.parse(
      departments.toString(),
    );
    const departmentsEntities = await this.departmentRepository.create(
      departmentsList,
    );
    await map(departmentsEntities, async (ent) => {
      await ent.save();
    });
  }
}
