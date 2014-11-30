module.exports =  {
    publicDir: './../../public',
    db:'mongodb://localhost:27017/coapp',
    token: {
        secret: 'this.is.sparta',
        expires: 7 // days
    },
    upload: {
        uploadsDir: './../../public/media/uploads',
        tmpDir: './../../public/media/tmp',
        size: 2000000, // 2mb
        types: ['.jpg', '.jpeg', '.png']
    }
};
