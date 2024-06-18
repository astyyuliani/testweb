// userController.js
import crypto from 'crypto';
import User from "../models/UserModel.js";
import dotenv from 'dotenv';

dotenv.config();

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY;

const generateIV = () => crypto.randomBytes(16);

export const encrypt = (text, iv) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text) => {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    
    try {
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.log("Error decrypting:", error);
        return null; // Handle decryption error appropriately
    }
};


export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll();
        const decryptedResponse = response.map(user => ({
            id: user.id,
            name: decrypt(user.name),
            email: decrypt(user.email),
            gender: decrypt(user.gender)
        }));
        res.status(200).json(decryptedResponse);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getUsersById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!response) {
            return res.status(404).json({ error: 'User not found' });
        }
        const decryptedResponse = {
            id: response.id,
            name: decrypt(response.name),
            email: decrypt(response.email),
            gender: decrypt(response.gender)
        };
        res.status(200).json(decryptedResponse);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createUser = async (req, res) => {
    try {
        const iv = generateIV();
        const encryptedData = {
            name: encrypt(req.body.name, iv),
            email: encrypt(req.body.email, iv),
            gender: encrypt(req.body.gender, iv)
        };
        await User.create(encryptedData);
        res.status(201).json({
            "message": "User Created"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateUser = async (req, res) => {
    try {
        const encryptedData = {
            name: encrypt(req.body.name),
            email: encrypt(req.body.email),
            gender: encrypt(req.body.gender)
        };
        await User.update(encryptedData, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            "message": "User Updated"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            "message": "User Deleted"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
