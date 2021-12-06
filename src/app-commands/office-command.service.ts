import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Office } from '../entities/Office';
import * as fs from 'fs';
import { imageSize } from 'image-size';

@Console()
export class OfficeCommandService {
  constructor(
    @InjectRepository(Office)
    private officeRepository: Repository<Office>,
  ) {}

  @Command({
    command: 'create-offices',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating offices');
    await this.make();
    spin.succeed('created');
  }

  @Command({
    command: 'make-offices-map-files',
  })
  async mapFiles() {
    const spin = createSpinner();
    spin.start('creating offices maps');
    const invests = await this.makeMapFiles();
    fs.writeFileSync(
      process.cwd() + '/jsons/offices.json',
      JSON.stringify(invests),
    );
    spin.succeed('created');
  }

  async make() {
    const offices: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/offices.json',
    );
    const officesList: Array<Record<any, unknown>> = JSON.parse(
      offices.toString(),
    );
    const officesEntities = await this.officeRepository.create(officesList);
    await map(officesEntities, async (ent) => {
      await ent.save();
    });
  }

  makeMapFiles() {
    const offices: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/offices.json',
    );

    const officesList: Array<Record<any, any>> = JSON.parse(offices.toString());

    officesList.forEach((inv, i) => {
      if (officesList[i]['mapFiles']) {
        const size = imageSize(
          process.cwd() + '/static' + officesList[i]['mapFiles']['moreFile'],
        );
        officesList[i]['mapFiles']['moreFile'] = {
          src: officesList[i]['mapFiles']['moreFile'],
          sizeString: `${size.width}x${size.height}`,
        };
      }
    });
    return officesList;
  }
}
