import { User } from '../models/userModel.js';



export const addMember = async (req,res) => {

  const user = req.user
  console.log('user: ', user);

  const { name,email,age,gender } = req.body;


  if(!name || !email || !age || !gender){
    return res.status(400).json({message:"Please provide all details"})
  } 

  const existingMember = user.membersList.find(member => member.email === email)
  console.log('existingMember: ', existingMember);

  if(existingMember){
    return res.status(400).json({message:"Member already registered with this email id"})
  }
  try{
    user.membersList.push({ name,email,age,gender })
  
    await user.save()

    res.status(200).json({ message:`Member successfully added with name ${name}` })
  }catch(error){
    res.status(500).json({message:"Error in internal server while adding new member"})
  }
 }

export const fetchMembers = async (req,res) => {
  const user = req.user;

  if(!user){
    return res.status(400).json({ message:"You dont have an registered account" })
  }

  try{
    const membersData = await user.membersList

    res.status(200).json({ message:"Members data fetched successfully",membersData })
  }catch(error){
    res.status(500).json({message:"Error in internal server while fetching members data"})
  }
}

export const updateMember = async (req, res) => {
  const user = req.user;
  console.log('user: ', user);
  const { id } = req.params; 
  console.log('id: ', id);

  const { name,age,gender,email } = req.body

  try {

    const member = await user.membersList.id(id);
    console.log('member: ', member);
    if (!member) {
      return res
        .status(404)
        .json({ message: `Member not found with id ${id}` });
    }

    // 2. update fields
    member.name   = name;
    member.age    = age;
    member.gender = gender;
    member.email = email;

    // 3. Save the parent document
    await user.save();

    // 4. Send response
    return res.status(200).json({
      message: "Member updated successfully",
      member
    });
  } catch (error) {
    console.error("Error updating member:", error);
    return res.status(500).json({
      message: `Error in internal server while updating member with id ${id}`
    });
  }
};

export const deleteMember = async (req, res) => {
    const user = req.user
    const { id } = req.params;
  
    try {
      const member = await user.membersList.id(id);
  
      if (!member) {
        return res.status(404).json({
        message: `No member found with email ${id}`
        });
      }
      
      user.membersList.pull({ _id: id });

      await user.save()

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