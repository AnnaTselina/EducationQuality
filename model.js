export default class Model {
    constructor(view){        
        this.view = view;  
        
        this.chosen_parameters = {};
        this.evaluated_criterias = {}; //тут должны храниться критерии и оценки
        this.addedComment = null;
    }    
    setChosenParameters(field, chosen_option) {
        this.chosen_parameters[field] = chosen_option;
    }
    setEvaluatedCriterias(criteria, value) {
        this.evaluated_criterias[criteria] = value;
    }
    setComment(com) {
        this.addedComment = com;
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

//ФУНКЦИЯ ПРОВЕРКИ ОЦЕНИВАЛ ЛИ ПОЛЬЗОВАТЕЛЬ СУЩНОСТЬ РАНЬШЕ
    async checkUserPast(){        
        return db.collection("Universities").doc(this.chosen_parameters["uni_choice"]).collection("Subjects").doc(this.chosen_parameters["subject_choice"]).collection("teachers").doc(this.chosen_parameters["teacher_choice"]).collection("TypeOfClass").doc(this.chosen_parameters["type_of_class"]).get().then(documentSnapshot => {
            if (Object.keys(documentSnapshot.data()).length == 0){ //если документ пока пустой, то все ок
                return 0;  //0-все ок, 1 -пользователь уже оценивал
            } else {
                let list = documentSnapshot.data()["Оценившие"];
                if (list.includes(firebase.auth().currentUser.email)) {
                    return 1;
                } else {
                    return 0;
                }
            }
            
        })
        
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
        this.sendData();      
        let values = Object.entries(this.evaluated_criterias);
        this.view.evaluation_closure(values);
        //очищаем данные
        this.chosen_parameters = {};
        this.evaluated_criterias = {};
        this.addedComment = null;
    }

    //отправка оценок в Firestore
    sendData(){   
        var self = this;
        //считаем общий балл
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let values = Object.values(self.evaluated_criterias).map(function (item) {
            return Number(item);
        })
        let avgPoint = values.reduce(reducer)/values.length; //среднее арифметическое всех оценок
        let currentUser = firebase.auth().currentUser.email;
        let comment = {
            [currentUser]: self.addedComment
        };
        let marks = self.evaluated_criterias;
        
        
        let currentRef = db.collection("Universities").doc(self.chosen_parameters["uni_choice"]).collection("Subjects").doc(self.chosen_parameters["subject_choice"]).collection("teachers").doc(self.chosen_parameters["teacher_choice"]).collection("TypeOfClass").doc(self.chosen_parameters["type_of_class"]);
            currentRef.get().then(documentSnapshot => {           
                if (Object.keys(documentSnapshot.data()).length == 0) { //если до этого никогда не оценивали
                    console.log('never evaluated before');
                    setValues();
                } else {
                    console.log('there is something');
                    getValues().then(result => updateValues(result)); //получаем текущие значения полей и переписываем их
                }
            });

      //функция в случае если не было оценок
        let setValues = function() {
        currentRef.set({
            "Количество оценивших": 1,
            "Общая оценка": avgPoint,
            "Оценившие": [currentUser],
            "Комментарии": []
        }).then(function() {             
          if (comment[currentUser]) { //если есть коммент, то записываем его            
            currentRef.update({
                "Комментарии": [comment]                                  
            })
        } 
        for(let i =0; i < Object.entries(marks).length; i++) {
            currentRef.update({
                "Критерии": marks
            });
        }
        })
        }
        //функция автоматического инкрементирования в firesore
        const increment = firebase.firestore.FieldValue.increment(1);

        //функции в случае если оценки уже выставлялись
        async function getValues() {            
            return currentRef.get().then(function(doc){                
                let curAvgPoint = doc.data()['Общая оценка']; //достаем текущую общую оценку
                let curCriterias = doc.data()['Критерии']; //достаем текущие общие значения критериев
                let curNumEval = doc.data()["Количество оценивших"] 
                return [curAvgPoint, curCriterias, curNumEval];
            });            
        }

        let updateValues = function(result) {
            let curAvgPoint = result[0];
            let curCriterias = Object.entries(result[1]);
            let curNumEval = result[2];

            let newCriterias = Object.entries(marks);
            let finalCriterias = {};


            //подсчитываем новые общие критерии перебрав оба массива
            for (let i=0; i<curCriterias.length; i++) {
                for (let j=0; j<newCriterias.length; j++) {                        
                    if (curCriterias[i][0] === newCriterias[j][0]) {                        
                        finalCriterias[curCriterias[i][0]] = ((Number(curCriterias[i][1])*curNumEval + Number(newCriterias[j][1]))/(curNumEval+1)).toFixed(1);
                    }
                }                
            }
            
            

            //находим новую общую оценку
            let newAvgPoint = ((curAvgPoint*curNumEval + avgPoint)/(curNumEval+1)).toFixed(1); //(общая текущая оценка*текущее кол-во оценивших + средняя оценка от конкретного пользователя) / (текущее количество оценивших + текущий пользователь) .....ну и округляем до десятых
            
            currentRef.update({
                "Количество оценивших": increment, //Инкрементируем количество оценивших
                "Общая оценка": newAvgPoint, //записываем новую рассчитанную общую оценку
                "Критерии": finalCriterias, //записываем новые общие оценки для критериев
                "Оценившие": firebase.firestore.FieldValue.arrayUnion(currentUser) //добавляем нового пользователя в массив  (добавляется только в случае если до этого не был)              
            }).then(function() {
                if (comment[currentUser]) {                    
                    currentRef.update({
                        "Комментарии": firebase.firestore.FieldValue.arrayUnion(comment) //добавляем комментарий
                    })
                }
            })
        }


    }



    }



