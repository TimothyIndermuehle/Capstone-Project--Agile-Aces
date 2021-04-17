import {
  users, classes
} from '../firebase';

export const createTopic = (classId, topic, time) => {
  classes.doc(classId).collection('topics').add({
    title: topic,
    time: time
  })
};

export function getAllTopics (classId) {
  let snapshots = [];
  snapshots.push(
    classes.doc(classId)
    .collection('topics').orderBy("time")
    .onSnapshot(querySnapshot => {
      const topics = {};
      if(querySnapshot.size === 0){
        this.setState({topics : {}});
      }
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const title = doc.id;
        let voters = [];
        snapshots.push(
          classes.doc(classId).collection('topics').doc(title).collection('voters').onSnapshot(querySnapshot2 => {
            voters = [];
            querySnapshot2.forEach(voterDoc => {
              voters.push(voterDoc.id)
            })
            let questions = [];
            if(this.state.topics[title]){
              if(this.state.topics[title].questions){
                questions = this.state.topics[title].questions;
              }
            }
            snapshots.push(
              classes.doc(classId).collection('topics').doc(doc.id)
              .onSnapshot(doc => {   
                if(doc.data()){
                  if(doc.data().title){
                    topics[title] = {...data, questions: questions, voters, title: doc.data().title};
                    this.setState({topics});
                  }
                }
              })
            )
            topics[title] = {...data, questions: questions, voters};
            this.setState({topics});
          })
        )
      });
    })
  );
    return snapshots;
};

export const updateTopic = (classId, topic, updateFields) => {
  return classes.doc(classId).collection('topics').doc(topic).update(updateFields)
    .then(() => console.log('Succesfully updated topic'))
    .catch(err => console.error(`Error updating topic ${topic}`, err));
};

export const deleteTopicQuestions = async (classId, topic) => {
  const classRef = classes.doc(classId);
  const topicRef = classRef.collection('topics').doc(topic);
  const questions = topicRef.collection('questions');
  return questions.get().then((data) => {
    let promises = [];
    data.forEach(doc => {
      deleteQuestion(classId, topic, doc.id).then((res) => {
        promises.push(res);
        Promise.all(res).then(() => {
          promises.push(questions.doc(doc.id).delete())
        })
      })
    })
    return promises;
  })
}

export const deleteTopicVoters = async (classId, topic) => {
  return classes.doc(classId).collection('topics').doc(topic).collection('voters').get().then((voterData) => {
    let promises = [];
    voterData.forEach(doc => {
      promises.push(classes.doc(classId).collection('topics').doc(topic).collection('voters').doc(doc.id).delete())
    })
    return promises;
  })
}

export const deleteQuestion = (classId, topic, questionId) => {
  return classes.doc(classId).collection('topics').doc(topic).collection('questions').doc(questionId).collection("voters").get().then((questionData => {
    let promises = [];
    questionData.forEach(questionDoc => {
      promises.push(
        classes.doc(classId).collection('topics').doc(topic).collection('questions').doc(questionId).collection("voters").doc(questionDoc.id).delete()
      )
    })
    return promises;
  }))
}



export const addVoter = (classId, topic, voterId) => {
  const voterRef = users.doc(voterId);
  classes.doc(classId).collection('topics').doc(topic).collection('voters')
  .doc(voterId).set({ voterRef })
  .then(function(){
    console.log(" successfully added voter ref to topics list of voters");
  }).catch(function(err){
    console.error(" unable to add voter ref to classes list of voters ", err);
  })
}

export const removeVoter = (classId, topic, voterId) => {
  classes.doc(classId).collection('topics').doc(topic).collection('voters')
  .doc(voterId).delete().then(function(){
    console.log(" successfully removed voter ref from topics list of voters")
  }).catch(function(err){
    console.error(" unable to remove voter ref from topics list of voters ", err);
  })
}


export const deleteTopic = (classId, topic) => {
  let promises = [];
  promises.push(deleteTopicQuestions(classId, topic));
  promises.push(deleteTopicVoters(classId, topic));
  return Promise.all(promises).then(() => {
    return classes.doc(classId).collection('topics').doc(topic).delete();
  })
};
