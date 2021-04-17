import { classes, users } from '../firebase';

export const createQuestion = (classId, topic, question, time, author) => {
  if(question === "") {
    alert("Please enter requested information.")
  } else {
    classes.doc(classId).collection('topics').doc(topic).collection('questions').add({
      author,
      question,
      time,
      votes: 0
    })
    .then(() => console.log('Succesfully added question'))
    .catch(err => console.error('Error adding question', err));
  }  
};

export const updateQuestion = (classId, topic, questionId, updateFields) => {
  classes.doc(classId).collection('topics').doc(topic).collection('questions').doc(questionId).update(updateFields)
    .then(() => console.log('Succesfully updated question'))
    .catch(err => console.error(`Error updating question ${questionId}`, err));
};

export const deleteQuestion = (classId, questionId, topic) => {
  classes.doc(classId).collection('topics').doc(topic).collection('questions').doc(questionId).delete()
    .then(() => console.log(`successfully deleted question ${questionId}`))
    .catch(err => console.error(`Error deleting question ${questionId}`, err));
};

export const addQuestionVoter = (classId, topic, questionId, voterId) => {
  const voterRef = users.doc(voterId);
  classes.doc(classId).collection('topics').doc(topic).collection('questions').doc(questionId).collection('voters')
  .doc(voterId).set({ voterRef })
  .then(function(){
    console.log(" successfully added voter to questions list of voters");
  }).catch(function(err){
    console.error(" unable to add voter ref to questions list of voters ", err);
  })
}

export const deleteQuestionVoter = (classId, topic, questionId, voterId) => {
  classes.doc(classId).collection('topics').doc(topic).collection('questions').doc(questionId).collection('voters')
  .doc(voterId).delete()
  .then(function(){
    console.log(" successfully deleted voter from questions list of voters");
  }).catch(function(err){
    console.error(" unable to delete voter ref from questions list of voters ", err);
  })
}

export function getTopicQuestions(classId, topic) {
  let snapshots = [];
  snapshots.push(
    classes.doc(classId)
    .collection('topics')
    .doc(topic)
    .collection('questions').orderBy("time")
    .onSnapshot(snapShot => {
      const {topics} = this.state;
      if (snapShot.docs.length) {
      topics[topic].questions = [];
      snapShot.forEach(doc => {
        const data = doc.data();
        const id = doc.id;
        let voters = [];
        snapshots.push(
          classes.doc(classId).collection('topics').doc(topic).collection('questions').doc(id).collection('voters').onSnapshot(querySnapshot => {
            voters = [];
            querySnapshot.forEach(voterDoc => {
              voters.push(voterDoc.id);
            })
            for(var i = 0; i < topics[topic].questions.length; i++){
              if(topics[topic].questions[i].id === id){
                topics[topic].questions[i].voters = voters;
                break;
              }
            }
            this.setState({topics})
          })
        )
        topics[topic].questions.push({id, ...data, voters})
      });
    } else {
      topics[topic].questions = ['no questions'];
    }
      this.setState({topics})
    })
  )
  return snapshots;
}
