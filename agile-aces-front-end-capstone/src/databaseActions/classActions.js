/* eslint-disable no-loop-func */
import { users, classes } from '../firebase';
import { deleteTopic } from './topicActions';

export const createClass = async (teacher, classDoc) => {
  const classRef = classes.doc();
  await classRef.set({teacher, ...classDoc})
  users.doc(teacher.id)
    .collection('teacher')
    .doc(classRef.id).set({ classRef })
    .then(() => console.log('Succesfully added class'))
    .catch(err => console.error('Error adding class', err));
};

// Required state for using component: allClasses: []
export async function startSearchAllClasses(queryString) {
  classes.where('titleSearchArray', 'array-contains', queryString)
    .orderBy('title')
    .limit(11)
    .get()
    .then(querySnapShot => {
      const allClasses = [];
      let promises = [];
      const lastClass = querySnapShot.docs[10] && querySnapShot.docs[9];
      const snapLength = querySnapShot.docs.length < 10 ? querySnapShot.docs.length : 10;
      for (let i = 0; i < snapLength; i += 1) {
        const doc = querySnapShot.docs[i];
        const data = doc.data();
        const classId = doc.id;
        const { teacher } = data;
        if(allClasses.length < 10){
          allClasses.push({classId, ...data});
          promises.push(
            teacher.get()
              .then(doc => {
                const teacherName = doc.data();
                return teacherName
              })
          )
        }
      }
      Promise.all(promises)
      .then(() => {
        let newPromises = [];
        for(let i = 0; i < allClasses.length; i++){
          newPromises.push(
            promises[i].then((value) => {
              if(value){
                allClasses[i].teacherName = value.name;
              }
            })
          )
        }
        Promise.all(newPromises).then(() => {
          this.setState({ lastClass, allClasses })
        })
      });
  });
};

export function pageSearchAllClasses(lastClass, queryString = '') {
  classes.where('titleSearchArray', 'array-contains', queryString)
    .orderBy('title')
    .startAfter(lastClass)
    .limit(11)
    .get()
    .then(querySnapShot => {
    const { allClasses: prevAllClasses } = this.state;
    const rawAllClasses = [];
    let allClasses;
    let promises = [];
    const lastClass = querySnapShot.docs[10] && querySnapShot.docs[9];

    const snapLength = querySnapShot.docs.length < 10 ? querySnapShot.docs.length : 10;

      for (let i = 0; i < snapLength; i += 1) {
        const doc = querySnapShot.docs[i];
        const data = doc.data();
        const classId = doc.id;
        const { teacher } = data;

        if(rawAllClasses.length < 10){
          rawAllClasses.push({classId, ...data});
          promises.push(
            teacher.get()
              .then(doc => {
                const teacherName = doc.data().name;
                return teacherName
              })
          )
        }
    }; 
    Promise.all(promises).then(() => {
      let newPromises = [];

      for(let i = 0; i < rawAllClasses.length; i++){
        // rawAllClasses[i].name = promises[i];
        newPromises.push(
          promises[i].then((name) => {
            rawAllClasses[i].teacherName = name;
          })
        )
      }
      Promise.all(newPromises).then(() => {
        allClasses = prevAllClasses.concat(rawAllClasses)
        this.setState({ lastClass, allClasses })
      })
    })
  });
};

// Required state for using component: currentClassObject: null
export function getOneClass(e) {
  let snapshots = [];
  snapshots.push(
    classes.doc(e.id)
    .onSnapshot(doc => {    
      const data = doc.data();
      const classObject = { id: e.id, ...data };
      if(data){

        this.setState({
          currentClassObject: classObject,
          view: e.role,
          header: 'Topics',
          }, () => {
            snapshots.push(
              users.doc(classObject.teacher.id)
              .onSnapshot(doc => {            
                const data = doc.data();
                this.setState({
                  currentClassTeacherName: data.name
                })
              })
            )
          }
        )
      }
    })
  )
  return snapshots;
};

export function getEnrolledStudents(e) {
  let snapshots = {};
  const enrolledStudents = [];
  snapshots[e.id] = 
    classes.doc(e.id)
    .collection('students')
    .onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const studentRef = data.studentRef;
        if(change.type === "added"){
          snapshots[studentRef.id] = 
            studentRef.onSnapshot(studentDoc => {
              let newStudent = true;
              const studentData = studentDoc.data();
              for(let i = 0; i < enrolledStudents.length; i++){
                if(enrolledStudents[i].studentRef.id === studentDoc.id){
                  newStudent = false;
                  enrolledStudents[i].studentData = studentData;
                }
              }
              if(newStudent){
                enrolledStudents.push({studentRef, studentData});
              }
              this.setState({
                enrolledStudents: enrolledStudents
              })
            })
        }
        if(change.type === "removed"){
          if(this.state.getEnrolledStudentsSubs[studentRef.id]){
            this.state.getEnrolledStudentsSubs[studentRef.id]();
          }
          for(let i = 0; i < enrolledStudents.length; i++){
            if(enrolledStudents[i].studentRef.id === studentRef.id){
              enrolledStudents.splice(i, 1);
              i--;
            }
          }
        }
        this.setState({
          enrolledStudents: enrolledStudents
        })
      })
  })
  return snapshots;
}

export function getPendingStudents(e) {
  let snapshots = {};
  const pendingStudents = [];
  snapshots[e.id] = 
    classes.doc(e.id)
    .collection('pending')
    .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach((change) => {
      const data = change.doc.data();
      const studentRef = data.studentRef;
      if(change.type === "added") {
        snapshots[studentRef.id] = 
          studentRef.onSnapshot(studentDoc => {
            let newStudent = true;
            const studentData = studentDoc.data();
            for(let i = 0; i < pendingStudents.length; i++){
              if(pendingStudents[i].studentRef.id === studentDoc.id){
                newStudent = false;
                pendingStudents[i].studentData = studentData;
              }
            }
            if(newStudent){
              pendingStudents.push({studentRef, studentData});
            }
            this.setState({
              pendingStudents: pendingStudents
            })
          })
      }

      if (change.type === "removed") {
        if(this.state.getPendingStudentsSubs[studentRef.id]){
          this.state.getPendingStudentsSubs[studentRef.id]();
        }
        for(let i = 0; i < pendingStudents.length; i++){
          if(pendingStudents[i].studentRef.id === studentRef.id){
            pendingStudents.splice(i, 1);
            i--;
          }
        }
      }
      this.setState({
        pendingStudents: pendingStudents
      })

    })
  })
  return snapshots;
}

// For single role, pass single element array of the desired role
// Required state for using component: classlist: []
export function getAllUserClasses(userId, role = ['teacher', 'student']) {
  let snapshots = {};
  users.doc(userId)
  .collection('teacher').onSnapshot(querySnapshot => {
    let teacherClassList = [];
    if(querySnapshot.size === 0){
      this.setState({teacherClassList: []});
    }
    querySnapshot.forEach(doc => {
      const { classRef } = doc.data();
      const id = classRef.id;
      classes.doc(id).onSnapshot(doc => {
        teacherClassList = teacherClassList.filter(doc => doc.id !== id)
          const data = doc.data();
          if(doc.data()){
            teacherClassList.push({id, ...data})
            classes.doc(id)
            .collection('pending')
            .onSnapshot(querySnapshot => {
              let numStudents = querySnapshot.size;
              let firstAlert = numStudents > 0; 
              for(var i =0; i < teacherClassList.length; i++){
                if(teacherClassList[i].id === id){
                  teacherClassList[i].alert = firstAlert
                  this.setState({ teacherClassList })
                }
              } 
              
            })
            this.setState({ teacherClassList })
          };
      });    
    });
  });

  users.doc(userId)
  .collection('student').onSnapshot(querySnapshot => {
    let studentClassList = [];

    if(querySnapshot.size === 0){
      this.setState({studentClassList: []});
    }
    querySnapshot.forEach(doc => {
      const { classRef } = doc.data();
      const id = classRef.id;

      if(this.state.getAllUserClassesSubs[id]){
        this.state.getAllUserClassesSubs[id]();
      }
      snapshots[id] = classes.doc(id).onSnapshot(doc => {
        studentClassList = studentClassList.filter(doc => doc.id !== id)
        const data = doc.data();
        if(doc.data()){
          studentClassList.push({id, ...data})
          this.setState({ studentClassList })
        }
      });
      // snapshots.push(myObj);
    });
  });
  return snapshots;
};

export const updateClass = (classID, updateFields) => {
  classes.doc(classID).update(updateFields)
  .then(() => console.log('Succesfully updated class'))
  .catch(err => console.error(`Error updating class `, err));
};

// classId is the ID assigned to the class in the classes collection. Student is the current user object.
export const requestEnrollment = (studentRef, classId) => {
  let classRef = classes.doc(classId);
      classRef.collection('pending').doc(studentRef.id).set({ studentRef }).then(function(){
        console.log(" success");
      }).catch(function(err){
        console.error(" err ", err);
      });
      studentRef.collection('pending').doc(classId).set({ classRef }).then(function(){
        console.log(" success");
      }).catch(function(err){
        console.error(" err ", err);
      });
}

export const enroll = (studentId, classId) => {
  const classRef = classes.doc(classId);
  const studentRef = users.doc(studentId)
  studentRef.collection('pending')
  .doc(classId).delete()
  .then(function() {
    console.log(" successfully deleted class from users pending array")
  }).catch(function(err){
    console.error(" unable to delete class from users pending array ", err);
  })

  studentRef.collection('student')
  .doc(classId).set({ classRef })
  .then(function(){
    console.log(" successfully added classReference to users student list")
  }).catch(function(err){
    console.error(" unable to add class reference to users student list ")
  })

  classRef.collection('pending')
  .doc(studentId).delete()
  .then(function(){
    console.log(" successfully deleted user ref in class pending list ");
  }).catch(function(err){
    console.error(" unable to delete user reference from class pending list ", err);
  })
  classRef.collection('students')
  .doc(studentId).set({ studentRef })
  .then(function(){
    console.log(" successfully added student ref to students list in class ");
  }).catch(function(err){
    (" unable to add student ref to classes student list ");
  })
}

export const deny = (studentId, classId) => {
  const classRef = classes.doc(classId);
  const studentRef = users.doc(studentId);
  let promises = [];
  promises.push(
    studentRef.collection('pending')
    .doc(classId).delete()
    .catch(function(err){
      console.error(" unable to delete class from users pending array ", err);
    })
  )
  promises.push(
    classRef.collection('pending')
    .doc(studentId).delete()
    .catch(function(err){
      console.error(" unable to delete user reference from class pending list ", err);
    })
  )
  return Promise.all(promises);
}

export const deleteStudent = (studentId, classId) => {
  const studentRef = users.doc(studentId);
  const classRef = classes.doc(classId);
  let promises = [];
  promises.push(
    studentRef.collection('student')
    .doc(classId).delete()
    .catch(function(err){
      console.error(" unable to delete class from students student list ", err);
    })
  )
  promises.push(
    classRef.collection('students')
    .doc(studentId).delete()
    .catch(function(err){
      console.error(" unable to delete student from classes student list ", err);
    })
  )

  return Promise.all(promises);
}

export const deleteEnrolled = (classId) => {
  return classes.doc(classId).collection('students').get().then((data) => {
    let promises = [];
    data.forEach((doc) => {
      promises.push(deleteStudent(doc.id, classId));
    })
    return Promise.all(promises);
  })
}

export const deletePending = (classId) => {
  return classes.doc(classId).collection('pending').get().then((data) => {
    let promises = [];
    data.forEach((doc) => {
      promises.push(deny(doc.id, classId));
    })
    return Promise.all(promises);
  })
}

export const deleteTeacher = (teacherId, classId) => {
  return users.doc(teacherId).collection('teacher').doc(classId).delete();
}

export const deleteTopics = (classId) => {
  return classes.doc(classId).collection('topics').get().then((data) => {
    let promises = [];
    data.forEach((doc) => {
      promises.push(deleteTopic(classId, doc.id));
    })
    return Promise.all(promises);
  })
}

export function deleteClass(classId, teacherId){
  let promises = [];
  classes.doc(classId).onSnapshot(function(){});
  promises.push(deleteEnrolled(classId));
  promises.push(deletePending(classId));
  promises.push(deleteTopics(classId));
  promises.push(deleteTeacher(teacherId, classId));
  return Promise.all(promises).then(() => {
    return classes.doc(classId).delete();
  })
}
