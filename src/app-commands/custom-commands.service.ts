import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import * as fs from 'fs';

@Console()
export class CustomCommandsService {
  @Command({
    command: 'update-contacts-jsons',
  })
  async updateContactJsons(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating update-contacts-jsons');
    await this.updateCDepartments(false);
    await this.updateCInvestitions(true);
    await this.updateCOffices(false);
    await this.updateCVariants(true);
    spin.succeed('created');
  }

  async updateCDepartments(showForm: boolean) {
    const elements: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/departments.json',
    );
    const elementsList: Array<Record<any, any>> = JSON.parse(
      elements.toString(),
    );
    elementsList.forEach((el, i) => {
      elementsList[i].contactsSections.forEach((cg, j) => {
        elementsList[i].contactsSections[j].persons.forEach((cp, k) => {
          elementsList[i].contactsSections[j].persons[k].showForm = showForm;
        });
      });
    });
    fs.writeFileSync(
      process.cwd() + '/jsons/departments.json',
      JSON.stringify(elementsList),
    );
  }
  async updateCInvestitions(showForm: boolean) {
    const elements: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const elementsList: Array<Record<any, any>> = JSON.parse(
      elements.toString(),
    );
    elementsList.forEach((el, i) => {
      elementsList[i].contacts.forEach((cg, j) => {
        elementsList[i].contacts[j].persons.forEach((cp, k) => {
          elementsList[i].contacts[j].persons[k].showForm = showForm;
        });
      });
    });
    fs.writeFileSync(
      process.cwd() + '/jsons/investitions.json',
      JSON.stringify(elementsList),
    );
  }
  async updateCOffices(showForm: boolean) {
    const elements: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/offices.json',
    );
    const elementsList: Array<Record<any, any>> = JSON.parse(
      elements.toString(),
    );
    elementsList.forEach((el, i) => {
      elementsList[i].contactsSections.forEach((cg, j) => {
        elementsList[i].contactsSections[j].persons.forEach((cp, k) => {
          elementsList[i].contactsSections[j].persons[k].showForm = showForm;
        });
      });
    });
    fs.writeFileSync(
      process.cwd() + '/jsons/offices.json',
      JSON.stringify(elementsList),
    );
  }
  async updateCVariants(showForm: boolean) {
    const elements: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/variants.json',
    );
    const elementsList: Array<Record<any, any>> = JSON.parse(
      elements.toString(),
    );
    elementsList.forEach((el, i) => {
      elementsList[i].contactsSections.forEach((cg, j) => {
        elementsList[i].contactsSections[j].persons.forEach((cp, k) => {
          elementsList[i].contactsSections[j].persons[k].showForm = showForm;
        });
      });
    });
    fs.writeFileSync(
      process.cwd() + '/jsons/variants.json',
      JSON.stringify(elementsList),
    );
  }
}
