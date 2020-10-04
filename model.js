export default class Model {
    constructor(view){        
        this.view = view;  
        
        this.chosen_parameters = {};
        this.evaluated_criterias = {}; //тут должны храниться критерии и оценки
    }    
    setChosenParameters(field, chosen_option) {
        this.chosen_parameters[field] = chosen_option;
    }
    setEvaluatedCriterias(criteria, value) {
        this.evaluated_criterias[criteria] = value;
        
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


    /*методы для RateRoute*/ 
    async handleParameters(){
       this.view.workWithRatingParameters(); //запускаем окошко с параметрами для выбора         
    }

    handleChosenOption(field, chosen_option) {        
        this.setChosenParameters(field.id, chosen_option); //запоминаем выбранные параметры                
        this.view.handleParameterTypes(field, chosen_option); //обрабатываем выбор во View
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

    async confirmEvaluation(){        
        this.view.chosenParamConfirm(Object.values(this.chosen_parameters)); //передаем во View итоговые параметры для подтверждения
    }

  
    async startEvaluation() {
        var self = this;
        //достаем в модели критерии для выбранного типа занятий и передаем во View
        this.getCriterias_Evaluation().then(result => {
            let sortedData = Object.keys(result.data()).sort();
            for (let i=0; i<sortedData.length; i++) {
                self.setEvaluatedCriterias(sortedData[i], null); //записываем в модель критерии
            }
            self.view.evaluationProcess(sortedData);           
        });
        
    }

    getCriterias_Evaluation() {        
        return new Promise(resolve => db.collection("Criterias").doc(this.chosen_parameters["type_of_class"]).get().then(documentSnapshot => resolve(documentSnapshot)));
    }

    async askForComment() {
        this.view.leave_comment();
    }

    async evaluationFinished() {
        console.log(this.evaluated_criterias);
        //TODO: отправить критерии по параметрам в firestore

        //TODO: отобразить окошко с благодарностью и кнопкой "Оценить ещё"
        let values = Object.entries(this.evaluated_criterias);
        this.view.evaluation_closure(values);
    }


    }
   
  


