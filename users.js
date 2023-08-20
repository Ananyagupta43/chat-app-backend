const users=[];

const addUsers=({id,name,room})=>{
//Javascript Mastery=javascriptmastery

name=name.trim().toLowerCase();
room=room.trim().toLowerCase();

const existingUser=users.find((user)=>user.room == room && user.name==name);

if(existingUser){
    return {error:'User already exists'}

}

const user={id,name,room};
console.log(id);
users.push(user);

return {user};
}


const removeUsers=(id)=>{
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) return users.splice(index, 1)[0];
}

const getUsers=(id)=>{
    const ourUser=users.find((user)=>user.id === id);

 return ourUser;

}

const getUsersInRoom=(room)=>{
const getRoom=users.filter((user)=>user.room===room);
return getRoom;

}

module.exports={addUsers,removeUsers,getUsers,getUsersInRoom};