import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('families')
export class FamiliesController {
  @Get()
  getFamilies(): any {
    return 'obtener families';
  }

  @Get(':id')
  getFamily(@Param('id') id: string): any {
    console.log(id);
    return 'obtener familia';
  }

  @Post()
  saveFamily(@Body() body: any): any {
    console.log(body);
    return 'crear familia';
  }

  @Patch(':id')
  editFamily(@Param('id') id: string, @Body() body: any) {
    console.log(id);
    console.log(body);
    return 'editar familia';
  }

  @Delete(':id')
  deleteFamily(@Param('id') id: string) {
    console.log(id);
    return 'eliminar marca';
  }
}
