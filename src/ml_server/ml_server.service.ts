import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import { promisify } from 'util';
import { TransformDto } from './dto/transform.dto';

@Injectable()
export class MlServerService {

    async getFileBlob(filePath: string): Promise<Blob> {
        try {
            const readFile = promisify(fs.readFile);

            const buffer = await readFile(filePath);
            return new Blob([buffer]);
        } catch (error) {
            throw new Error(`Error reading file: ${error}`);
        }
    }

    private convertUrl(fileDir: string) {
        const filename = fileDir.split('/')
        return [
            'public',
            filename[filename.length - 2],
            filename[filename.length - 1]
        ].join('/');
    }

    async uploadImage(fileDir: string, url: string): Promise<string> {
        const formData = new FormData();

        formData.append(
            'file',
            await this.getFileBlob(fileDir),
            this.convertUrl(fileDir)
        )

        const response = await axios.post(`${url}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data.filename;
    }

    async downloadImage(filename: string, url: string): Promise<string> {
        const response = await axios.get(`${url}/${filename}`, {
            responseType: 'arraybuffer',
        });

        const buffer = Buffer.from(response.data, 'binary');
        fs.writeFileSync(`uploads/anigan/${filename}`, buffer);
        return `uploads/anigan/${filename}`
    }

    async transform(transformDto: TransformDto) {
        console.log({ transformDto });

        //Upload user image
        await this.uploadImage(transformDto.source_img, process.env.ML_SERVER_URL)

        //Send request to ML server
        const response = await axios.post(
            `${process.env.ML_SERVER_URL}/transform`,
            {
                referenceImg: `/content/${this.convertUrl(transformDto.reference_img)}`,
                sourceImg: `/content/${this.convertUrl(transformDto.source_img)}`
            },
            {
                responseType: 'text'
            });

        const filename: string = response.data.split("/").pop().replace('"', '')

        return await this.downloadImage(filename, `${process.env.ML_SERVER_URL}/download`)
    }
}
