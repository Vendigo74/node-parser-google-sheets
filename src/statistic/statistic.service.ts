import { Injectable } from '@nestjs/common';
import * as fs from 'fs'

@Injectable()
export class StatisticService {
    async getFile() {
        const fileData = fs.readFileSync("config/static_data.json");
        return JSON.parse(fileData.toString());
    };
}
