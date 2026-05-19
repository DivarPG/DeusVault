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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/request.interface';
import { UpdateItemDto } from './dto/update-item.dto';
import { UpdateCollectionTemplateDto } from './dto/update-collection-template.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Post(':collectionId/items/:itemId/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadItemImage(
    @Param('collectionId') collectionId: string,
    @Param('itemId') itemId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    const imagePath = `/uploads/${file.filename}`;
    await this.collectionsService.updateItemImage(
      collectionId,
      itemId,
      userId,
      imagePath,
    );
    return { imageUrl: imagePath };
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
