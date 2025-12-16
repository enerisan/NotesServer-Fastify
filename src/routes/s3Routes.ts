import { FastifyInstance, FastifyRequest } from "fastify"
import s3 from '../s3';


interface FileParams {
    fileName: string;
}

export default function s3Routes(app: FastifyInstance) {



    // Upload file (CREATE)
    // Only one file expected    
    app.post('/upload', async (req, reply) => {
        try {
            const data = await req.file();
            if (!data) {
                return reply.code(400).send({ error: "No file uploaded" });
            }
            //Fastify requires to convert data to toBuffer()

            const fileBuffer = await data.toBuffer();
            const fileName = data.filename;

            const params: AWS.S3.PutObjectRequest = {
                Bucket: process.env.AWS_BUCKET_NAME!, // ! means it is not undefined
                Key: fileName,
                Body: fileBuffer,
                ACL: 'private',

            }
            // Upload to S3
            const result = await s3.upload(params).promise();

        } catch (e: any) {
            return reply.code(500).send({ error: "Upload failed", details: e.message })
        }
    });

    // File List (READ)
    app.get('/files/', async (req, reply) => {
        try {
            const data = await s3.listObjectsV2({ Bucket: process.env.AWS_BUCKET_NAME! }).promise();
            return reply.send(data.Contents); // only file list

        } catch (e) {
            console.error(e);
            return reply.code(500).send(e);
        }
    })


    //Download  file (READ)

    app.get('/files/:fileName', async (req: FastifyRequest<{ Params: FileParams }>, reply) => {

        const { fileName } = req.params;
        const params: AWS.S3.GetObjectRequest = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName
        }
        try {

            const url = s3.getSignedUrl('getObject', { ...params, Expires: 60 });
            return reply.send({ message: 'Download URL', url })

        } catch (e) {
            console.error(e);
            return reply.code(500).send(e);

        }
    })

    // Delete File
    app.delete('/delete/:fileName', async (req: FastifyRequest<{ Params: FileParams }>, reply) => {

        const { fileName } = req.params;

        const params: AWS.S3.DeleteObjectRequest = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileName,
        };

        try {
            await s3.deleteObject(params).promise();
            return reply.code(200).send({ message: "File deleted" });

        } catch (e: any) {
            console.error(e);
            return reply.code(500).send({ error: "Error deleting file", details: e.message });
        }
    });

};
