import { Department } from './../entities/Department';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Department)
export class DepartmentRespository extends Repository<Department> {}
