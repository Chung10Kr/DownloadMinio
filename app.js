const Minio = require('minio')

class DownloadObj
{
    constructor()
    {
        this.endPoint = 'ip',
        this.port = 9000,
        this.accessKey = 'accessKey',
        this.secretKey = 'secretKey'
        this.bucketsNm = "Bucket Name";
        this.path = null; //폴더경로 , prefix
        this.minioClient = null;
        this.run();
    }

    async run()
    {
        this.init();
        this.objDown();
    }

    init()
    {
        let self = this;
        this.minioClient = new Minio.Client({
            endPoint:self.endPoint,
            port: self.port,
            useSSL: false,
            accessKey: self.accessKey,
            secretKey: self.secretKey
        });
    }

    objDown()
    {
        let self = this;
        let stream = this.minioClient.extensions.listObjectsV2WithMetadata(this.bucketsNm,this.path, true,'')

        stream.on('data', function(obj) { 
             self.download( obj.name )
        });
        stream.on('error', function(err) { 
            console.log( err )
        });
    }

    download(sFileNm){
        this.minioClient.fGetObject(this.bucketsNm, sFileNm, `./${this.bucketsNm}/${sFileNm}`, function(err) {
            if (err) {
                console.log(`[ ### Download fail ] ${sFileNm}`)
            }else{
                console.log(`[ Download success ] ${sFileNm}`)
            }
        });
    }
}
new DownloadObj();
