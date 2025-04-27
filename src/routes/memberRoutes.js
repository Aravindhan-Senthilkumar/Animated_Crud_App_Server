import express from 'express'
import {addMember,deleteMember,fetchMembers,updateMember } from '../controllers/memberController.js'

const router = express.Router();

//Adding new member end point
router.post('/addMember',addMember)
//Fetch members data end point
router.get('/fetchMembers/:email',fetchMembers)

router.put('/updateMember/:id',updateMember);

router.delete('/deleteMember/:id', deleteMember);

export default router;