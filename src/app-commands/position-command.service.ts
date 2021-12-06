import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Position } from 'src/entities/Position';
import { Repository } from 'typeorm';

@Console()
export class PositionCommandService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  @Command({
    command: 'create-positions',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating position');
    await this.make();
    spin.succeed('created');
  }

  async make() {
    const positions: Array<Record<any, unknown>> = [
      { id: 1, name: 'top', pages: [1, 2, 5, 6, 7] },
      { id: 3, name: 'bottom', pages: [9, 10, 11] },
    ];
    await map(positions, async (p) => {
      await this.positionRepository.create(p).save();
    });
  }
}
