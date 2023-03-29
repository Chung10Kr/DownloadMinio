const Minio = require('minio')
const readline = require("readline");

class DownloadObj
{
    constructor()
    {
        this.endPoint = 'ip',
        this.port = 9000,
        this.accessKey = 'accessKey',
        this.secretKey = 'secretKey'
        this.bucketsNm = "Bucket Name";
        this.path = null;
        this.minioClient = null;
        this.run();
    }

    async run()
    {
        this.initInput();
        await this.input();
        this.init();
        this.objDown();

    }

    async input()
    {
        let sInputed;
        while(true){
            sInputed = await this.readInput(`다운받을 경로를 입력해 주세요. ex) 폴더명/폴더명 \n`        );
            if(sInputed){
               break; 
            };
        }
        this.path = sInputed;
    }

    initInput()
    {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async readInput(sMessage,bHide = false)
    {
        let self = this;
        return (new Promise(function(resolve,reject) {
            self.rl.question(sMessage,function(sInputed) {
                resolve(sInputed);
            });
            self.rl._writeToOutput = function(stringToWrite) {
                if (bHide) {
                    self.rl.output.write("*");
                }
                else {
                    self.rl.output.write(stringToWrite);
                }
            };
        })).then(function(v){
            self.rl._writeToOutput = function(stringToWrite) {
                self.rl.output.write(stringToWrite);
            };
            return v;
        });
    }

    init()
    {
        let self = this;
        this.minioClient = new Minio.Client({
            endPoint: self.endPoint,
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
