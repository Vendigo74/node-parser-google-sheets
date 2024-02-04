import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SheetsModule } from './sheets/sheets.module';
import { ConfigModule } from '@nestjs/config';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [ConfigModule.forRoot(), SheetsModule, StatisticModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
