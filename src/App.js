import React, { useState, useEffect } from 'react';

import './App.css';

import { Switch, Route } from 'react-router-dom';

import UsersList from "./components/UsersList";
import User from './components/User';
import UserForm from './components/UserForm';
import rootAPI from './components/utils/API';

function App() {

  const [users, setUsers] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const deleteUser = async (id) => {

    const user = users.find( u =>{
      return u._id.toString() === id.toString();
    })
    if(!user) return;

    setUsers(state => {
      return state.filter(u => {
        return u._id != id;
      })
    })

    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    const response = await fetch(rootAPI+"/users/"+id, requestOptions);
    const result = await response.json();

    if(result.message !== 'success' ){
      users.push(user);
      setUsers(users);
      return;
    }
    
  }


  useEffect(async () => {

    const promise = await fetch(rootAPI+'/users');
    const data = await promise.json();
    if(!data){ return;}
    setUsers(data);
    setIsloading(false);
  }, []);

  return (
    <Switch>

      <Route path='/' exact>
        <UsersList users={users} setUsers={setUsers} deleteUser={deleteUser} isLoading={isLoading} />
      </Route>

      <Route path='/user/:id' exact>
        <User users={users} deleteUser={deleteUser} />
      </Route>
      <Route path='/add-user' exact>
        <UserForm userType={'new'} users={users} setUsers={setUsers} />
      </Route>
      <Route path='/update/:id' exact>
        <UserForm userType={'old'} users={users} setUsers={setUsers} />
      </Route>
    </Switch>
  );
}

export default App;
