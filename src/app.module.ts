import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SheetsModule } from './sheets/sheets.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), SheetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
