export default class Model {
    constructor(view){        
        this.view = view;            
    }    

    checkState () {
                  return new Promise(resolve => firebase.auth().onAuthStateChanged(user => resolve(user)));       
    }
      
    create_account(userEmail, userPass) { //создание аккаунта   
        return new Promise((resolve, reject) => {
            resolve(firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                window.alert("Error: " + errorMessage);
            }));
        })   
    }
        
    login(userEmail, userPass) { //вход в систему
       return new Promise((resolve) => {
            resolve(firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                window.alert("Error: " + errorMessage);
            }));
        })
    }

    logout() {
        firebase.auth().signOut();
    }

    handleRateRoute(){
        this.view.workWithRatingParameters(); //запускаем окошко с параметрами для выбора         
    }

    getParameters_Uni() {        
        return new Promise(resolve => db.collection("Universities").get().then(querySnapshot => resolve(querySnapshot)));             
    }

    getParameters_Subj(uni) {
        return new Promise(resolve => db.collection("Universities").doc(uni).collection("Subjects").get().then(querySnapshot => resolve(querySnapshot)));
      }
    
    getParameters_Teacher(uni, subj) {
        return new Promise(resolve => db.collection("Universities").doc(uni).collection("Subjects").doc(subj).collection("teachers").get().then(querySnapshot => resolve(querySnapshot)));
    } 
    getParameters_TypeOfClass(uni, subj, teacher) {
        return new Promise(resolve => db.collection("Universities").doc(uni).collection("Subjects").doc(subj).collection("teachers").doc(teacher).collection("TypeOfClass").get().then(querySnapshot => resolve(querySnapshot)));
    }
    }
   
  


