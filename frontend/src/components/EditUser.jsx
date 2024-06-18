import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";

const EditUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("Male");
    const navigate = useNavigate();
    const { id } = useParams();

    const secretKey = import.meta.env.VITE_SECRET_KEY;

    const encryptData = (data) => {
        return CryptoJS.AES.encrypt(data, secretKey).toString();
    };

    const decryptData = (encryptedData) => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    };

    useEffect(() => {
        getUserById();
    }, []);

    const updateUser = async (e) => {
        e.preventDefault();
        try {
            const encryptedName = encryptData(name);
            const encryptedEmail = encryptData(email);
            const encryptedGender = encryptData(gender);

            await axios.patch(`http://localhost:5000/users/${id}`, {
                name: encryptedName,
                email: encryptedEmail,
                gender: encryptedGender
            });
            setName("");
            setEmail("");
            setGender("Male");
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const getUserById = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${id}`);
            const decryptedName = decryptData(response.data.name);
            const decryptedEmail = decryptData(response.data.email);
            const decryptedGender = decryptData(response.data.gender);
            setName(decryptedName);
            setEmail(decryptedEmail);
            setGender(decryptedGender);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="columns mt-5 is-centered">
                <div className="column is-half">
                    <form onSubmit={updateUser}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    type="text"
                                    className="input"
                                    placeholder="Name"
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    type="text"
                                    className="input"
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Gender</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <button className="button is-success" type="submit">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditUser;
