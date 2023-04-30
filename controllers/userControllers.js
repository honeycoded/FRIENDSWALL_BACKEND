import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.js'

export const signin = async(req,res)=>{
    const { email, password } = req.body;
    
    try {
        const existingUser = await UserModel.findOne({email})

        if(!existingUser) return res.status(404).json({message: 'User not found!'})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(404).json({ message: "Incorrect password."})

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: '1h'})

        res.status(200).json({ result: existingUser, token})

    } catch (error) {
        res.status(500).json({'message': 'something went wrong'})
    }
}

export const signup = async(req,res)=>{
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    try {
        const existingUser = await UserModel.findOne({email});

        if(existingUser) return res.status(400).json({message: 'Email already exist.'})

        if(password !== confirmPassword) return res.status(400).json({message: 'Passwords do not match'})

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await UserModel.create({email, password: hashedPassword, name: `${firstName} ${lastName}`})

        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: '1h'})

        res.status(201).json({result, token})

    } catch (error) {
        res.status(500).json({'message': 'something went wrong'})
    }
}