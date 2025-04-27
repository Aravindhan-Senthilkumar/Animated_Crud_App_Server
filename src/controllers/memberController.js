import { User } from '../models/userModel.js';
import { Member } from '../models/memberModel.js'


export const addMember = async (req,res) => {
  const { name,email,age,gender } = req.body;

  if(!name || !email || !age || !gender){
    return res.status(400).json({message:"Please provide all details"})
  } 

  const existingMember = await Member.findOne({email})

  if(existingMember){
    return res.status(400).json({message:"Member already registered with this email id"})
  }
  try{
    const newMember = new Member({
      name,
      email,
      age,
      gender
    }) 
  
    await newMember.save()

    res.status(200).json({ message:`Member successfully added with name ${name}` })
  }catch(error){
    res.status(500).json({message:"Error in internal server while adding new member"})
  }
 }

export const fetchMembers = async (req,res) => {

  const {email} = req.params;

  const user = await User.findOne({email}).lean()

  if(!user){
    return res.status(400).json({ message:"You dont have an registered account" })
  }

  try{
    const membersData = await Member.find().lean()

    res.status(200).json({ message:"Members data fetched successfully",membersData })
  }catch(error){
    res.status(500).json({message:"Error in internal server while fetching members data"})
  }
}

export const updateMember = async (req, res) => {
  const { name, age, gender } = req.body;
  const { id } = req.params; 

  try {

    const member = await Member.findById(id);
    if (!member) {
      return res
        .status(404)
        .json({ message: `Member not found with id ${id}` });
    }

    // 2. Mutate fields
    member.name   = name;
    member.age    = age;
    member.gender = gender;

    // 3. Save back
    const updatedMember = await member.save();

    // 4. Send response
    return res.status(200).json({
      message: "Member updated successfully",
      updatedMember
    });
  } catch (error) {
    console.error("Error updating member:", error);
    return res.status(500).json({
      message: `Error in internal server while updating member with id ${id}`
    });
  }
};

export const deleteMember = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedMember = await Member.findByIdAndDelete(id);
  
      if (!deletedMember) {
        return res.status(404).json({
          message: `No member found with email ${id}`
        });
      }
  
      return res.status(200).json({
        message: "Member deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting member:", error);
      return res.status(500).json({
        message: `Error in internal server while deleting member with email ${id}`
      });
    }
  }