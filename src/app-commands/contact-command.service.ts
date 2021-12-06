import { InjectRepository } from '@nestjs/typeorm';
import { Command, Console, createSpinner } from 'nestjs-console';
import { map } from 'p-iteration';
import { Repository } from 'typeorm';
import { Contact } from '../entities/Contact';
import * as fs from 'fs';

@Console()
export class ContactCommandService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  @Command({
    command: 'create-contacts',
  })
  async create(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating contacts');
    await this.make();
    spin.succeed('created');
  }

  @Command({
    command: 'investitions-contacts',
  })
  async investContacts(): Promise<void> {
    const spin = createSpinner();
    spin.start('creating contacts');
    const contacts = await this.getContacts();
    fs.writeFileSync(
      process.cwd() + '/jsons/contacts.json',
      JSON.stringify(contacts),
    );
    spin.succeed('created');
  }

  async make() {
    const contacts: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/contacts.json',
    );
    const contactsList: Array<Record<any, unknown>> = JSON.parse(
      contacts.toString(),
    );
    const contactsEntities = await this.contactRepository.create(contactsList);
    await map(contactsEntities, async (ent) => {
      await ent.save();
    });
  }

  async getContacts() {
    const contacts: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/contacts.json',
    );
    const investitions: Buffer = fs.readFileSync(
      process.cwd() + '/jsons/investitions.json',
    );
    const contactsList: Array<Record<any, any>> = JSON.parse(
      contacts.toString(),
    );
    const investitionsList: Array<Record<any, any>> = JSON.parse(
      investitions.toString(),
    );

    investitionsList.forEach((inv) => {
      const nContacts: Array<Record<any, any>> = this.getContactsFromInvest(
        inv,
      );
      nContacts.forEach((nc) => {
        let isExists = false;

        contactsList.forEach((c) => {
          if (<string>nc.email.trim() == <string>c.email.trim()) {
            isExists = true;
          }
        });

        if (!isExists) {
          const id = this.findHigestId(contactsList);
          nc.id = id;
          contactsList.push(nc);
        }
      });
    });
    return contactsList;
  }

  getContactsFromInvest(invest: Record<any, any>) {
    const contacts: Array<Record<any, any>> = [];

    if (invest.kontakt_osoba_1 && invest.kontakt_osoba_1 != '') {
      contacts.push({
        underDepartment: '',
        name: invest.kontakt_osoba_1,
        position: invest.kontakt_stanowisko_1,
        email: invest.kontakt_mail_1,
        phones:
          invest.kontakt_telefon_1 && invest.kontakt_telefon_1 != ''
            ? [invest.kontakt_telefon_1]
            : [],
        description: '',
        showForm: false,
        status: true,
      });
    }
    if (invest.kontakt_osoba_2 && invest.kontakt_osoba_2 != '') {
      contacts.push({
        underDepartment: '',
        name: invest.kontakt_osoba_2,
        position: invest.kontakt_stanowisko_2,
        email: invest.kontakt_mail_2,
        phones:
          invest.kontakt_telefon_2 && invest.kontakt_telefon_2 != ''
            ? [invest.kontakt_telefon_2]
            : [],
        description: '',
        showForm: false,
        status: true,
      });
    }
    if (invest.kontakt_osoba_3 && invest.kontakt_osoba_3 != '') {
      contacts.push({
        underDepartment: '',
        name: invest.kontakt_osoba_3,
        position: invest.kontakt_stanowisko_3,
        email: invest.kontakt_mail_3,
        phones:
          invest.kontakt_telefon_1 && invest.kontakt_telefon_3 != ''
            ? [invest.kontakt_telefon_3]
            : [],
        description: '',
        showForm: false,
        status: true,
      });
    }
    if (invest.najem_osoba && invest.najem_osoba != '') {
      contacts.push({
        underDepartment: '',
        name: invest.najem_osoba,
        position: invest.najem_stanowisko,
        email: invest.najem_mail,
        phones:
          invest.najem_telefon && invest.najem_telefon != ''
            ? [invest.najem_telefon]
            : [],
        description: '',
        showForm: false,
        status: true,
      });
    }
    if (invest.zarzadca_osoba && invest.zarzadca_osoba != '') {
      contacts.push({
        underDepartment: '',
        name: invest.zarzadca_osoba,
        position: invest.zarzadca_stanowisko,
        email: invest.zarzadca_mail,
        phones:
          invest.zarzadca_telefon && invest.zarzadca_telefon != ''
            ? [invest.zarzadca_telefon]
            : [],
        description: '',
        showForm: false,
        status: true,
      });
    }
    return contacts;
  }

  findHigestId(contacts: Array<Record<any, unknown>>) {
    let id = 0;
    contacts.forEach((contacts) => {
      if (contacts.id > id) {
        id = <number>contacts.id;
      }
    });
    id++;
    return id;
  }
}
