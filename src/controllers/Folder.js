const { createClient } = require("@supabase/supabase-js")
const prisma = require("../configs/prisma.js")
const supabase = createClient(`${process.env.PROJECT_URL}`, `${process.env.API_KEY}`)

const { body, validationResult, matchedData } = require("express-validator")

const { getFolder } = require("../configs/queries.js")

function formatDate(dateToFormat) {
	const string = dateToFormat.toString()
	const [_, month, date, year, time] = string.split(" ")
	const [hour, min] = time.split(":")
	return `${date}/${month}/${year}, ${hour}:${min}`
}

class Folder {
	validateFolder = [
		body("folder").trim()
			.notEmpty().withMessage("Folder name should not be empty")
			.isLength({ min: 2 }).withMessage("Folder name should be more than 2 characters")
			.escape()
	]

	async getFolders(req, res, next) {
		const folders = await prisma.folder.findMany({
      where: {
        ownerId: Number(req.user.id)
      }
    });

		res.render("home", {
			folders
		});
	}

	uploadFolder = [
		this.validateFolder,
		async (req, res, next) => {
			const folders = await prisma.folder.findMany({});
			const result = validationResult(req);
			if (!result.isEmpty()) {
				return res.status(400).render("home", {
					errors: result.array(),
					folders
				})
			}
			const { folder } = matchedData(req);

			try {
				await prisma.folder.create({
					data: {
						name: folder,
						ownerId: req.user.id
					}
				})
				res.redirect(`/`)
			} catch (error) {
				throw (error)
			}
		}
	]

	async openFolder(req, res, next) {
    console.log(req.params.folderid)
		const folder = await getFolder(req.params.folderid)

		const files = await prisma.file.findMany({
			where: { folderId: folder.id }
		})

		return res.render("folder", { folder, files, formatDate })
	}

	async deleteFolder(req, res, next) {
		const id = Number(req.params.folderid);
		await prisma.file.deleteMany({
			where: {
				folderId: id
			}
		})
		await prisma.folder.delete({
			where: { id }
		})
		res.redirect("/");
	}
}

module.exports = new Folder()
