const prisma = require("./prisma.js")

async function getFolder(folderId) {
    return await prisma.folder.findUnique({
        where: {
            id: Number(folderId)
        }
    })
}

async function getFile(fileId) {
    return await prisma.file.findUnique({
        where: {
            id: Number(fileId)
        }
    })
}

module.exports = {
    getFolder, 
    getFile
}