import React,{useEffect, useState} from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import "./User.css";
import Loading from './Loading';
import rootAPI from './utils/API';

export default function User(props){
  const[user,setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const {id} = useParams();
  const history = useHistory();
  const {users, deleteUser} = props;
  useEffect(async ()=>{
    if(!id) return history.push('/');

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    const response = await fetch(rootAPI+"/users/"+id, requestOptions);
    const result = await response.json();
    if(result.message) history.push('/');
    setIsLoading(false);
    setUser(result);

  },[])

    return(
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
        { isLoading ? (<Loading />) : (
            <div className="user-details">
          <div className="profile-pic-display">
            <img
              src={rootAPI+user.profile}
              alt={user.name}
            />
          </div>
          <div className="details">
            <h3 className="name">{user.name}</h3>
            <div className="contacts">
              <span className="email">✉️ {user.email}</span>
              <span className="phone_no">📞 +91 {user.phone}</span>
              <div className="buttons">
                <Link to={"/update/"+user._id} className="edit-btn">Edit</Link>
                <a onClick={()=>{
                  deleteUser(user._id);
                  history.push('/');
                }} className="delete-btn">Delete</a>
              </div>
            </div>
          </div>
        </div>
      
          )
        }
        
      </div>
    </section>
    )

}