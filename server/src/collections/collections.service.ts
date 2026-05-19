import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Prisma } from '@prisma/client';
import {
  createItemValuesSchema,
  CollectionTemplate,
} from './validation/template.validator';
import { UpdateCollectionTemplateDto } from './dto/update-collection-template.dto';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  // Получить все коллекции ТОЛЬКО этого пользователя
  async findAllByUser(userId: string) {
    return this.prisma.collection.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Найти коллекцию по id с проверкой принадлежности пользователю
  async findOne(id: string, userId: string) {
    const collection = await this.prisma.collection.findFirst({
      where: { id, userId },
      include: { items: true },
    });
    if (!collection) {
      throw new NotFoundException(`Collection with ID "${id}" not found`);
    }
    return collection;
  }

  // Создать коллекцию, привязав её к пользователю
  async create(dto: CreateCollectionDto, userId: string) {
    return this.prisma.collection.create({
      data: {
        name: dto.name,
        description: dto.description,
        template: dto.template as unknown as Prisma.InputJsonValue,
        userId,
      },
    });
  }

  // Удалить коллекцию, только если она принадлежит пользователю
  async delete(id: string, userId: string) {
    // deleteMany с where гарантирует, что удалится только запись, принадлежащая userId
    const result = await this.prisma.collection.deleteMany({
      where: { id, userId },
    });
    if (result.count === 0) {
      throw new NotFoundException(`Collection with ID "${id}" not found`);
    }
    return result;
  }

  // Добавить элемент в коллекцию с проверкой прав
  async addItem(collectionId: string, dto: CreateItemDto, userId: string) {
    // Проверяем, существует ли коллекция и принадлежит ли она пользователю
    const collection = await this.prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });
    if (!collection) {
      throw new NotFoundException(
        `Collection with ID "${collectionId}" not found`,
      );
    }

    // Валидация values по шаблону
    this.validateItemValues(collection.template, dto.values);

    return this.prisma.collectionItem.create({
      data: {
        status: dto.status,
        values: dto.values as Prisma.InputJsonValue,
        collectionId,
      },
    });
  }

  async updateItem(
    collectionId: string,
    itemId: string,
    dto: UpdateItemDto,
    userId: string,
  ) {
    const collection = await this.prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });
    if (!collection) {
      throw new NotFoundException(
        `Collection with ID "${collectionId}" not found`,
      );
    }

    const item = await this.prisma.collectionItem.findFirst({
      where: { id: itemId, collectionId },
    });
    if (!item) {
      throw new NotFoundException(`Item with ID "${itemId}" not found`);
    }

    if (dto.values !== undefined) {
      this.validateItemValues(collection.template, dto.values);
    }

    const data: Prisma.CollectionItemUpdateInput = {};
    if (dto.status !== undefined) {
      data.status = dto.status;
    }
    if (dto.values !== undefined) {
      data.values = dto.values as Prisma.InputJsonValue;
    }

    return this.prisma.collectionItem.update({
      where: { id: itemId },
      data,
    });
  }

  async updateItemImage(
    collectionId: string,
    itemId: string,
    userId: string,
    imagePath: string,
  ) {
    const item = await this.prisma.collectionItem.findFirst({
      where: { id: itemId, collection: { id: collectionId, userId } },
    });
    if (!item) throw new NotFoundException('Item not found');

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}${imagePath}`;

    return this.prisma.collectionItem.update({
      where: { id: itemId },
      data: { image: fullUrl },
    });
  }

  async deleteItem(collectionId: string, itemId: string, userId: string) {
    const item = await this.prisma.collectionItem.findFirst({
      where: {
        id: itemId,
        collectionId,
        collection: { userId }, // проверяем пользователя через связь
      },
    });
    if (!item) {
      throw new NotFoundException(`Item not found`);
    }
    return this.prisma.collectionItem.delete({ where: { id: itemId } });
  }

  async updateTemplate(
    collectionId: string,
    dto: UpdateCollectionTemplateDto,
    userId: string,
  ) {
    const collection = await this.prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });
    if (!collection) {
      throw new NotFoundException(
        `Collection with ID "${collectionId}" not found`,
      );
    }

    const newTemplate = dto.template;
    const newFields = newTemplate.fields;

    // Обновляем шаблон коллекции
    await this.prisma.collection.update({
      where: { id: collectionId },
      data: {
        template: newTemplate as unknown as Prisma.InputJsonValue,
      },
    });

    // Получаем все элементы коллекции
    const items = await this.prisma.collectionItem.findMany({
      where: { collectionId },
    });

    // Применяем изменения к каждому элементу
    const defaultValues: Record<string, unknown> = {
      text: '',
      number: 0,
      boolean: false,
      date: '',
      multiline: '',
    };

    const updatePromises = items.map((item) => {
      const currentValues = (item.values as Record<string, unknown>) || {};
      const newValues: Record<string, unknown> = {};

      for (const field of newFields) {
        if (Object.prototype.hasOwnProperty.call(currentValues, field.name)) {
          newValues[field.name] = currentValues[field.name];
        } else {
          newValues[field.name] = defaultValues[field.type] ?? '';
        }
      }

      return this.prisma.collectionItem.update({
        where: { id: item.id },
        data: {
          values: newValues as Prisma.InputJsonValue,
        },
      });
    });

    await Promise.all(updatePromises);

    return this.prisma.collection.findUnique({
      where: { id: collectionId },
      include: { items: true },
    });
  }

  /**
   * Валидирует значения элемента на соответствие шаблону коллекции.
   * Выбрасывает BadRequestException, если данные не прошли проверку.
   */
  private validateItemValues(
    template: Prisma.JsonValue,
    values: Record<string, any>,
  ) {
    const templateObj = template as unknown as CollectionTemplate;
    const valuesSchema = createItemValuesSchema(templateObj);
    const parseResult = valuesSchema.safeParse(values);
    if (!parseResult.success) {
      const errors = parseResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new BadRequestException(`Invalid item values: ${errors}`);
    }
  }
}
