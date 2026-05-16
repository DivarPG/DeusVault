import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateItemDto } from './dto/create-item.dto';

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
        ...dto, // name, description, template
        userId, // обязательно передаём владельца
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
    return this.prisma.collectionItem.create({
      data: {
        status: dto.status,
        values: dto.values,
        collectionId,
      },
    });
  }

  // Удалить элемент, предварительно убедившись, что его коллекция принадлежит пользователю
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
}
