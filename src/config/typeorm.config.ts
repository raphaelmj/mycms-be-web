import { InvestitionSubscriber } from './../entities/subscriptions/InvestitionSubscriber';
import { Message } from './../entities/Message';
import { Article } from './../entities/Article';
import { Variant } from './../entities/Variant';
import { Office } from './../entities/Office';
import { Department } from './../entities/Department';
import { Contact } from './../entities/Contact';
import { Investition } from './../entities/Investition';
import { Position } from './../entities/Position';
import { Category } from './../entities/Category';
import { Page } from './../entities/Page';
import { User } from './../entities/User';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { PageSubscriber } from '../entities/subscriptions/PageSubscriber';
import { PositionSubscriber } from '../entities/subscriptions/PositionSubscriber';
import { VariantSubscriber } from '../entities/subscriptions/VariantSubscriber';
import { DepartmentSubscriber } from '../entities/subscriptions/DepartmentSubscriber';
import { OfficeSubscriber } from '../entities/subscriptions/OfficeSubscriber';
import { ContactSubscriber } from '../entities/subscriptions/ContactSubscriber';
import { MessageSubscriber } from '../entities/subscriptions/MessageSubscriber';
import { PopupSubscriber } from '../entities/subscriptions/PopupSubscriber';
import { Popup } from '../entities/Popup';

const dbConfig = config.get('db');

export const entitiesList: EntityClassOrSchema[] = [
  User,
  Page,
  Variant,
  Position,
  Investition,
  Department,
  Office,
  Contact,
  Category,
  Article,
  Message,
  Department,
  Popup,
];

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: process.env.DB_PORT || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  password: process.env.DB_PASSWORD || dbConfig.password,
  database: process.env.DB_DATABASE || dbConfig.database,
  entities: entitiesList,
  subscribers: [
    InvestitionSubscriber,
    PageSubscriber,
    PositionSubscriber,
    VariantSubscriber,
    DepartmentSubscriber,
    OfficeSubscriber,
    ContactSubscriber,
    MessageSubscriber,
    PopupSubscriber,
  ],
  synchronize: dbConfig.synchronize,
  // debug: true,
};
