import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/request.interface';
import { UpdateItemDto } from './dto/update-item.dto';
import { UpdateCollectionTemplateDto } from './dto/update-collection-template.dto';

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.collectionsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.collectionsService.findOne(id, userId);
  }

  @Patch(':id/template')
  async updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateCollectionTemplateDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.collectionsService.updateTemplate(id, dto, userId);
  }

  @Post()
  create(@Body() dto: CreateCollectionDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.collectionsService.create(dto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    await this.collectionsService.delete(id, userId);
  }

  @Post(':id/items')
  addItem(
    @Param('id') collectionId: string,
    @Body() dto: CreateItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.collectionsService.addItem(collectionId, dto, userId);
  }

  @Patch(':collectionId/items/:itemId')
  async updateItem(
    @Param('collectionId') collectionId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.collectionsService.updateItem(
      collectionId,
      itemId,
      dto,
      userId,
    );
  }

  @Delete(':collectionId/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItem(
    @Param('collectionId') collectionId: string,
    @Param('itemId') itemId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    await this.collectionsService.deleteItem(collectionId, itemId, userId);
  }
}
