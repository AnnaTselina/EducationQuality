export default class Model {
    constructor(view){        
        this.view = view;  
        
        //rateRoute
        this.chosen_parameters = {};
        this.evaluated_criterias = {}; //тут должны храниться критерии и оценки
        this.addedComment = null;

        //showRatingRoute
        this.uniToSearchIn = null;
        this.lastShownCard = null;
    } 
    
    //вспомогательные методы для работы с конструктором
    setChosenParameters(field, chosen_option) {
        this.chosen_parameters[field] = chosen_option;
    }
    setEvaluatedCriterias(criteria, value) {
        this.evaluated_criterias[criteria] = value;
    }
    setComment(com) {
        this.addedComment = com;
    }
    async cleanData() {
        this.chosen_parameters = {};
        this.evaluated_criterias = {}; 
        this.addedComment = null;
    }


    //методы для работы с регистрацией/входом
    checkState () {
        return new Promise(resolve => firebase.auth().onAuthStateChanged(user => resolve(user)));       
    }

    //функция отображения окна регистрации
    async callRegistration(){
        this.view.showRegistration();
    }

    create_account(userEmail, userPass) { //создание аккаунта   
        return new Promise((resolve, reject) => {
            resolve(
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(function() {
                    return firebase.auth().createUserWithEmailAndPassword(userEmail, userPass);                    
                })
                .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;                
                        var errorMessage;
                        switch (errorCode){
                            case "auth/weak-password":
                                errorMessage = "Пароль должен содержать не менее 6 символов";
                                break;
                            case "auth/email-already-in-use":
                                errorMessage = "Введенный email уже используется другим аккаунтом";
                                break;
                        }
                        window.alert("Ошибка: " + errorMessage);
                })
            )       
        })   
    }

    addUsertousersList(userEmail) {
        return new Promise(db.collection("Users").doc().set({ "user": userEmail })); 
    }
        
    login(userEmail, userPass) { //вход в систему
        return new Promise((resolve) => {
            resolve(
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                    .then(function() {
                        // Existing and future Auth states are now persisted in the current
                        // session only. Closing the window would clear any existing state even
                        // if a user forgets to sign out.
                        // ...
                        // New sign-in will be persisted with session persistence.
                        return firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
                    })
                    .catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage                
                        switch (errorCode) {
                            case "auth/user-not-found":
                                errorMessage = "Пользователя с таким идентификатором не существует. Возможно, аккаунт был удален или не создан.";
                                break;
                            case "auth/wrong-password":
                                errorMessage = "Введен неправильный пароль";
                                break;
                            
                        }
                        // ...
                        window.alert("Ошибка: " + errorMessage);
                    })
                
            );
        })
    }



    async logout() {
        return await firebase.auth().signOut().then(function() {
            return true;
        }).catch(function(error) {
            window.alert(error);
        });
    }

    /*Методы для InfoRoute */
    async infoRouteLoad() {
        this.view.infoRouteShow(); //подгружаем основную верстку
    }

    
    //здесь получаем статистику для info
    async getInfoOnProject() {
        let courses = await db.collection("БГЭУ").get().then(res => {return res.size});
        let users = await db.collection('Users').get().then(res => {return res.size});
        return [courses, users];      
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
        return new Promise(resolve => db.collection("Lists").get().then(querySnapshot => resolve(querySnapshot)));             
    }

    getParameters_Subj(uni) {
        return new Promise(resolve => db.collection("Lists").doc(uni).collection("Subjects").get().then(querySnapshot => resolve(querySnapshot)));
    }

    getParameters_Teacher(uni, subj) {
        return new Promise(resolve => db.collection("Lists").doc(uni).collection("Subjects").doc(subj).collection("teachers").get().then(querySnapshot => resolve(querySnapshot)));
    } 
    
    getParameters_TypeOfClass(uni, subj, teacher) {
        return new Promise(resolve => db.collection("Lists").doc(uni).collection("Subjects").doc(subj).collection("teachers").doc(teacher).collection("TypeOfClass").get().then(querySnapshot => resolve(querySnapshot)));
    }

//ФУНКЦИЯ ПРОВЕРКИ ОЦЕНИВАЛ ЛИ ПОЛЬЗОВАТЕЛЬ СУЩНОСТЬ РАНЬШЕ
    async checkUserPast(){        
        return db.collection("Lists").doc(this.chosen_parameters["uni_choice"]).collection("Subjects").doc(this.chosen_parameters["subject_choice"]).collection("teachers").doc(this.chosen_parameters["teacher_choice"]).collection("TypeOfClass").doc(this.chosen_parameters["type_of_class"]).get().then(documentSnapshot => {
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
        let comment = this.addedComment;
        this.cleanData();
        this.view.evaluation_closure(values, comment); 
        
    }

    //отправка оценок в Firestore
    async sendData(){   
        var self = this;
        //считаем общий балл
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let values = Object.values(self.evaluated_criterias).map(function (item) {
            return Number(item);
        })
        let avgPoint = (values.reduce(reducer)/values.length).toFixed(1); //среднее арифметическое всех оценок
        let currentUser = firebase.auth().currentUser.email;
        let comment = {
            [currentUser]: self.addedComment
        };
        let marks = self.evaluated_criterias;
        let parameters = self.chosen_parameters;
        

        let surnameOfTeacher = parameters["teacher_choice"].split(" ", 1);
        let valuesForKeywords = [surnameOfTeacher[0], parameters["subject_choice"]];
        
        
        let currentRef = db.collection("Lists").doc(parameters["uni_choice"]).collection("Subjects").doc(parameters["subject_choice"]).collection("teachers").doc(parameters["teacher_choice"]).collection("TypeOfClass").doc(parameters["type_of_class"]);
            currentRef.get().then(documentSnapshot => {           
                if (Object.keys(documentSnapshot.data()).length == 0) { //если до этого никогда не оценивали   
                                        
                    let keywords = self.generateKeywords(valuesForKeywords); 
                    //запрашиваем ссылку на фотографию и вызываем функцию создания документа       
                    let photo = db.collection("Lists").doc(parameters["uni_choice"]).collection("Subjects").doc(parameters["subject_choice"]).collection("teachers").doc(parameters["teacher_choice"]).get().then(documentSnapshot => {
                        return documentSnapshot.data()["photoURL"];
                    }); 
                    photo.then(res => {
                        setValues(keywords, res);
                    })       
                    
                } else {    
                    //находим документ
                    let r = db.collection(parameters["uni_choice"]);
                    let q = r.where("Дисциплина", "==", parameters["subject_choice"]).where("Преподаватель", "==", parameters["teacher_choice"]).where("Тип занятия", "==", parameters["type_of_class"]);               
                    //getValues(ref, query).then(result => console.log(result)/*updateValues(result)*/); //получаем текущие значения полей и переписываем их
                    updateValues(r, q);
                }
            });
        
      //функция в случае если не было оценок
        let setValues = function(keyv, ph) {
            
            //генерируем новый документ
            var newRef = db.collection(parameters["uni_choice"]).doc();        
            newRef.set({
                "keywords": keyv,
                "Дисциплина": parameters["subject_choice"],
                "Преподаватель": parameters["teacher_choice"],
                "Тип занятия": parameters["type_of_class"],
                "Количество оценивших": 1,
                "Общая оценка": avgPoint,          
                "Комментарии": [],
                "photoURL": ph,
            }).then(function() {             
            if (comment[currentUser]) { //если есть коммент, то записываем его            
                newRef.update({
                    "Комментарии": [comment]                                  
                })
            } 
            for(let i =0; i < Object.entries(marks).length; i++) {
                newRef.update({
                    "Критерии": marks
                });
            }
            })
            //добавляем оценившего в список в Lists
            currentRef.set({
                "Оценившие": [currentUser]
            })

        }
        //функция автоматического инкрементирования в firesore
        const increment = firebase.firestore.FieldValue.increment(1);

        //функции в случае если оценки уже выставлялись
        async function getValues(que) {  
            return que.get().then(querySnapshot => {
                let obj = {};
                querySnapshot.forEach(doc => {      
                    obj['docId'] = doc.id;              
                    obj['curAvgPoint'] = doc.data()['Общая оценка']; //достаем текущую общую оценку
                    obj['curCriterias'] = doc.data()['Критерии']; //достаем текущие общие значения критериев
                    obj['curNumEval'] = doc.data()["Количество оценивших"];                                 
                })
                return obj;
            })  
        }

        async function updateValues(refer, query) {
            let result = await getValues(query);
            let ref = refer;
            let docId = result['docId']
            let curAvgPoint = result['curAvgPoint'];
            let curCriterias = Object.entries(result['curCriterias']);
            let curNumEval = result['curNumEval'];

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
            
            ref.doc(docId).update({
                "Количество оценивших": increment, //Инкрементируем количество оценивших
                "Общая оценка": newAvgPoint, //записываем новую рассчитанную общую оценку
                "Критерии": finalCriterias, //записываем новые общие оценки для критериев                            
            }).then(function() {
                if (comment[currentUser]) {                    
                    ref.doc(docId).update({
                        "Комментарии": firebase.firestore.FieldValue.arrayUnion(comment) //добавляем комментарий
                    })
                }
            })

            currentRef.update({
                "Оценившие": firebase.firestore.FieldValue.arrayUnion(currentUser) //добавляем нового пользователя в массив  (добавляется только в случае если до этого не был) 
            })
        }

        
    }


    //методы для showRatingRoute


    //методы для генерации keywords
    createKeywords(name) {
        const arrName = [];
        let curName = '';
        name.split('').forEach(letter => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    }

    generateKeywords(names) {        
        const [surName, subjName] = names;
        
        const keywordSurnameFirst = this.createKeywords(`${surName.toLowerCase()} ${subjName.toLowerCase()}`);
        const keywordSubjNameFirst = this.createKeywords(`${subjName.toLowerCase()} ${surName.toLowerCase()}`);
        return [
            ...new Set([
                '',
                ...keywordSurnameFirst,
                ...keywordSubjNameFirst
            ])
        ];
    }

    async showRatingParameters(){       
        this.view.displayShowRatingParameters(); //подгружаем поля с параметрами
    }

    //записываем выбранный университет
    handleChosenUniInShowRating(uni) {
        this.uniToSearchIn = uni;
        this.view.clearLittleCardsBox();
    }


    async searchByName(search) {  
        
        if (!this.lastShownCard) { //если карточки еще не было
            let snapshot = await db.collection(this.uniToSearchIn)
            .where ('keywords', 'array-contains', search.toLowerCase())
            .orderBy(firebase.firestore.FieldPath.documentId())            
            .limit(10) // устанавливаем лимит на количество загружаемых карточек
            .get();    
            //записываем id последнего из 10 документов
            this.lastShownCard = snapshot.docs[snapshot.docs.length -1];           
            this.view.showLittleCards(snapshot);//передаем документы в view
        } else { //если карточки уже есть
            let snapshot = await db.collection(this.uniToSearchIn)
            .where ('keywords', 'array-contains', search.toLowerCase())
            .orderBy(firebase.firestore.FieldPath.documentId())
            .startAfter(this.lastShownCard)
            .limit(10) // устанавливаем лимит на количество загружаемых карточек
            .get();  
            //записываем id последнего из 10 документов
            this.lastShownCard = snapshot.docs[snapshot.docs.length -1];         
            this.view.addMoreLittleCards(snapshot);//передаем документы в view
        }
    }
    
    clearLastShownCard() {
        this.lastShownCard = null;
    }
    


}



