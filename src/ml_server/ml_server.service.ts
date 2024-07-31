import { BadRequestException, Injectable } from '@nestjs/common';
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
        try {
            const response = await axios.post(`${url}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data.filename;
        } catch (error) {
            console.log(error);
            if (error.response.status === 404) {
                throw new BadRequestException("Cannot reach Machine Learning server");
            } else {
                throw new BadRequestException("Unknown message")
            }
        }
    }

    async downloadImage(filename: string, mlServerUrl: string): Promise<string> {
        const temp = filename.split("/")
        const name = temp[temp.length - 1]
        const response = await axios.post(
            mlServerUrl,
            {
                url: filename
            },
            {
                responseType: 'arraybuffer',
            });

        const buffer = Buffer.from(response.data, 'binary');
        fs.writeFileSync(filename, buffer);
        return filename
    }

    async transform(transformDto: TransformDto): Promise<string> {
        try {
            //Send request to ML server
            const response = await axios.post(
                `${process.env.ML_SERVER_URL}/transform`,
                {
                    sourceImg: `/content/${this.convertUrl(transformDto.source_img)}`,
                    referenceImg: transformDto.reference_img
                },
                {
                    responseType: 'text'
                });

            if (response.data === '""') throw new BadRequestException("Cannot detect your face")
            console.log(response);

            const filename: string = response.data.split("/").pop().replace('"', '')
            return await this.downloadImage(`public/anigan/${filename}`, `${process.env.ML_SERVER_URL}/download`)
        } catch (error) {
            console.log(error);
            if (error.response.status === 404) {
                throw new BadRequestException("Cannot reach Machine Learning server");
            } else {
                throw new BadRequestException(error?.response?.message ?? "Unknown error")
            }
        }
    }
}
