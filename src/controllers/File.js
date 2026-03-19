const { createClient } = require("@supabase/supabase-js")
const prisma = require("../configs/prisma.js");

const supabase = createClient(`${process.env.PROJECT_URL}`, `${process.env.API_KEY}`)

const { getFolder } = require('../configs/queries.js')
const { getFile } = require("../configs/queries.js");

class File {
  async uploadFile(req, res, next) {
    const file = req.file
    const folder = await getFolder(req.params.folderid)
    
    const { data, error } = await
      supabase.storage.from('uploads').upload(`${folder.name}/${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });
    if (error) {
      throw(error)
    }
    const response = await supabase.storage.from('uploads').getPublicUrl(data.path, {download: true})

    await prisma.file.create({
      data: {
        name: file.originalname,
        url: response.data.publicUrl,
        size: file.size,
        uploaderId: Number(req.user.id),
        folderId: Number(req.params.folderid)
      }
    })
    res.redirect(`/folder/${req.params.folderid}`)
  }

  async downloadFile(req, res, next) {
    const file = await prisma.file.findUnique({
      where: {
        id: Number(req.params.fileid)
      }
    })
    res.redirect(file.url)
  }

  async deleteFile(req, res, next) {
    const file = await getFile(req.params.fileid)
    const folder = await getFolder(file.folderId)
   
    try {
      await prisma.file.delete({
        where: {
          id: Number(req.params.fileid)
        }
      }) 
      const { data, error } = await supabase.storage.from('uploads').remove([`${folder.name}/${file.name}`])
      res.redirect(`/folder/${folder.id}`)
    } catch(error) {
      throw(error)
    }
  }
}

module.exports = new File()
