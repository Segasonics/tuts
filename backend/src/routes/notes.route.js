import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { createNote, deleteNote, fetchAllNotes, updateNote } from "../controllers/notes.controller.js";

const router = Router()

router.route('/createnote').post(verifyUser,createNote);
router.route('/updatenote/:id').put(verifyUser,updateNote);
router.route('/fetchallnote').get(fetchAllNotes);
router.route('/deletenote/:id').delete(verifyUser,deleteNote)

export default router