import express from 'express'
import {addMember, deleteMember, fetchMembers, updateMember} from '../controllers/memberController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

//Adding new member end point
router.post('/addMember',authMiddleware,addMember)
//Fetch members data end point
router.get('/fetchMembers',authMiddleware,fetchMembers)

router.put('/updateMember/:id',authMiddleware,updateMember);

router.delete('/deleteMember/:id',authMiddleware, deleteMember);

export default router;