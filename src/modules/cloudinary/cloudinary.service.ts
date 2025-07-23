import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {v2 as cloudinary, UploadApiResponse} from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    async uploadFile({file, filePath = "default"}: { file: Express.Multer.File; filePath?: string }) {
        const response: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: filePath,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
            uploadStream.end(file.buffer);
        });

        return {
            url: response?.secure_url
        }
    }
}
