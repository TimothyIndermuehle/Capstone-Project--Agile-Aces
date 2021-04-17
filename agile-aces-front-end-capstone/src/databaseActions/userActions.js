import { users } from '../firebase';

export const createUser = (id, name, email) => {
  return users.doc(id).set({
      name,
      email,
    })
    .then(() => {
      return true
    })
    .catch(err => console.error(`Error adding user ${id}`, err));
};

export function getUser(userID) {
  // const { userActions: { loginUser } } = this.props;
  users.doc(userID)
  .onSnapshot(doc => {
    const { id } = doc;
    const { name } = doc.data()
    const user = users.doc(id);

    this.setState({user, name});
  })
};

export async function updateUser (user, updateFields){
  const updateFireBaseUser = {};
  this.setState({message: ''})
  let errMessage = '';

  if(updateFields.email){
    await user.updateEmail(updateFields.email)
    .then(() => {
      updateFireBaseUser.email = updateFields.email;
      this.setState({
        currentEmail: updateFields.email,
        email: ''
      })
      errMessage += "Your email has been updated"
    }).catch((err) => {
      this.setState({email: err.message})
    });
  }

  if(updateFields.name){
    await user.updateProfile({displayName: updateFields.name})
    .then(() => {
      updateFireBaseUser.name = updateFields.name;
      this.setState({
        name: ''
      })
      errMessage += "Your name has been updated"
    }).catch((err) => errMessage =  err.message);
  }

  if(updateFields.newPassword){
      user.updatePassword(updateFields.newPassword).then(() => errMessage += "Your password has been updated ").catch(err => errMessage =  err.message)
  }
  users.doc(user.uid).update(updateFireBaseUser)
    .then(() => {
      this.setState({
      message: errMessage,
      password: ''
    })
  })
    .catch(err => this.setState({
      message: err.message}));
};

export const deleteUser = (id) => {
  users.doc(id).delete()
    .then(() => console.log(`successfully deleted user ${id}`))
    .catch(err => console.error(`Error deleting user ${id}`, err));
};
