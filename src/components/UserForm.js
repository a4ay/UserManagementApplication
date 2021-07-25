import React, { useEffect, useState } from 'react';

import { Link, useHistory, useParams } from 'react-router-dom';

import "./UserForm.css";
import Loading from './Loading';
import rootAPI from './utils/API';

export default function UserForm(props) {
    let history = useHistory();
    const { users, setUsers, userType } = props;
    const { id } = useParams();
    const [userFormData, setUserFormData] = useState({
        name: "",
        email: "",
        phone: "",
        profilePreview: "/images/profile.svg",
    })
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(async () => {
        if (id) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            const response = await fetch(rootAPI+`/users/${id}`, requestOptions)
            const result = await response.json();
            if (result.message) return history.push('/');
            setUserFormData({
                name: result.name,
                email: result.email,
                phone: result.phone,
                profilePreview: rootAPI+result.profile,
            })
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    }, [])
    const handleFormData = (e) => {
        setUserFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('profile', selectedFile);
        formData.append('name', userFormData.name);
        formData.append('email', userFormData.email.toLowerCase());
        formData.append('phone', userFormData.phone);

        if (userType === "new") { //FOR CREATING NEW USER

            var requestOptions = {
                method: 'POST',
                body: formData,
                redirect: 'follow'
            };
            const response = await fetch(rootAPI+"/users", requestOptions);
            const result = await response.json();
            if (!result.message) {
                setUsers(state => {
                    state.push(result);
                    return state;
                });
            }

            history.push('/');

            return
        }

        // FOR UPDATING USER
        let newUsersList = users.filter((u) => {
            return u._id != id;
        })
        var requestOptions = {
            method: 'PUT',
            body: formData,
            redirect: 'follow'
        };
        const response = await fetch(rootAPI+"/users/" + id, requestOptions);
        const result = await response.json();
        if (!result.message) {
            newUsersList.push(result);
            setUsers(newUsersList);
        }
        history.push('/');
    }

    // IMAGE UPLOAD HANDLER
    const readURL = (input) => {
        if (input.target.files && input.target.files[0]) {

            setSelectedFile(input.target.files[0]);
            setIsFilePicked(true);

            var reader = new FileReader();
            reader.onload = function (e) {
                setUserFormData(prevState => ({
                    ...prevState,
                    ['profilePreview']: e.target.result,
                }))
            };

            reader.readAsDataURL(input.target.files[0]);
        }
    }

    return (
        <section className="users-section">
            <div className="users-container">
                <Link to="/" className="back-button">
                    <svg
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M21 11L6.414 11 11.707 5.707 10.293 4.293 2.586 12 10.293 19.707 11.707 18.293 6.414 13 21 13z"
                        ></path>
                    </svg>
                </Link>
                {isLoading ? (<Loading/>):(
                    <form onSubmit={handleSubmit} action="/update" className="user-form">
                    <input hidden readOnly name='id' value='thisisanid' />
                    <input
                        onChange={readURL}
                        className='profile-pic'
                        type='file'
                        name='profilePreview'
                        id='profile'
                    />
                    <label className='profile-input-label' htmlFor='profile'>
                        <img id='preview' src={userFormData.profilePreview} />
                    </label>
                    <div className="user-details-input">
                        <input
                            type="text"
                            className="user-input"
                            placeholder="Name"
                            name="name"
                            onChange={handleFormData}
                            value={userFormData.name}
                        />
                        <input
                            type="email"
                            className="user-input"
                            placeholder="Email"
                            name="email"
                            onChange={handleFormData}
                            value={userFormData.email}
                        />
                        <input
                            type="number"
                            className="user-input"
                            placeholder="Phone"
                            name="phone"
                            onChange={handleFormData}
                            value={userFormData.phone}
                        />
                        <input
                            className="user-form-submit"
                            type="submit"
                            value={userType === 'new' ? "Create" : "Update"}
                        />
                    </div>
                </form>
            
                )}
                
            </div>
        </section>
    )
}