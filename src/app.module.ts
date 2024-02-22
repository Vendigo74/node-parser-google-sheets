import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SheetsModule } from "./sheets/sheets.module";
import { ConfigModule } from "@nestjs/config";
import { StatisticModule } from "./statistic/statistic.module";
import { MongooseModule } from "@nestjs/mongoose";
import { KnexModule } from "nest-knexjs";
import { AnalyticsModule } from "./analytics/analytics.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    SheetsModule,
    StatisticModule,
    KnexModule.forRoot({
      config: {
        client: process.env.DB_CLIENT,
        connection: {
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        },
      },
    }),
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
