export default class Model {
    constructor(view){        
        this.view = view; //пользователь              
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

    getParameters() {
        this.view.insertHtml(this.view.htmlLayouts.get_parameters);
    }


    }
   
     

    //в модели мы только работаем с данными
    //дай мне список преподов
    //дай мне список критериев
    //отправь оценки в базу данных
    //дай мне информацию по выбранному преподу


