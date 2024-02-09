import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class FileDownloadService {
    async downloadImage(filename: string, url: string): Promise<void> {
        const response = await axios.get(`${url}/${filename}`, {
            responseType: 'arraybuffer',
        });

        const buffer = Buffer.from(response.data, 'binary');
        fs.writeFileSync(`anigan_photo/${filename}`, buffer);
    }
}
