import { File, Storage } from '@google-cloud/storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GcpBucketService {
    private storage: Storage;
    private bucketName: string;

    constructor(
        private configSerivce: ConfigService
    ) {
        this.storage = new Storage({
            projectId: configSerivce.get('GCP_PROJECT_ID'),
            keyFilename: __dirname + '/configs' + '/gcp-service-account.json',
        });
        this.bucketName = this.configSerivce.get('GCP_BUCKET_NAME');
    }

    async uploadFile(file: Express.Multer.File): Promise<File> {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const key = uuidv4(); // Generate a unique key for the image
            const fileUpload = bucket.file(key);

            await fileUpload.save(file.buffer, {
                metadata: {
                    contentType: file.mimetype, // Optional: Set the content type of the image
                },
            });

            return fileUpload
        } catch (error) {
            throw new BadRequestException('Upload failed')
        }
    }

    async removeFile(url: string): Promise<void> {
        const regex = /\/([^/]+)\?/; // // Matches the part between the last slash and the question mark
        const match = url.match(regex);

        const extractedName = match ? match[1] : url

        await this.storage
            .bucket(this.bucketName)
            .file(extractedName)
            .delete({ ignoreNotFound: true });
    }
}
