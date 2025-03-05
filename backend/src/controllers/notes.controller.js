import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Note } from "../models/notes.model.js";

const createNote = asyncHandler(async(req,res)=>{
    const {title,description} =req.body;
    const userId = req.user._id;

    if(!title || !description){
        throw new ApiError(400,"Title and description is required")
    }

    const note = await Note.create({
        title,
        description,
        owner:userId
    });

    const findNote = await Note.findById(note._id);
    if(!findNote){
        throw new ApiError(400,"Note doesn't exist")
    }

    return res.status(201)
    .json(new ApiResponse(200,{findNote},"Note created successfully"))

});

const updateNote = asyncHandler(async(req,res)=>{
    const {title,description}= req.body;
    const noteId = req.params.id;

    if(!(title || !description)){
        throw new ApiError(400,"Please enter the fields")
    };
    const newNote={}
    if(title){newNote.title=title}
    if(description){newNote.description=description}

    const note = await Note.findById(noteId);

    if(!note){
        throw new ApiError(400,"Note cannot be found")
    }

    if(note.owner?.toString() !== req.user._id.toString()){
        throw new ApiError(401,"You don't have permission to edit this note")
    }

    const updatedNote = await Note.findByIdAndUpdate(noteId,
        {
            $set:newNote
        },
        {
            new:true
        }
    )

    return res.status(200)
    .json( new ApiResponse(200,updatedNote,"Note updated successfully"))
});

const fetchAllNotes =asyncHandler(async(req,res)=>{
    const notes =await Note.find({});
    
    if(!notes){
        throw new ApiError("No notes found! add to see your notes")
    };

    return res.status(200)
    .json( new ApiResponse(200,notes,"Notes fetched successfully"))
    
})

const deleteNote=asyncHandler(async(req,res)=>{
    const noteId = req.params.id;
    
    let note = await Note.findById(noteId)
    if(!note){
    throw new ApiError(400,"note not found")
    }

    note =await Note.findByIdAndDelete(noteId);
    if(!note){
        throw new ApiError(400,"Note not found")
    }
    if(note.owner?.toString()!==req.user._id.toString()){
        throw new ApiError("You don't have permission to edit this note")
    }
    return res.status(200)
    .json("Note deleted successfully")
})

export {createNote,updateNote,fetchAllNotes,deleteNote}