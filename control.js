export default class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;         
       
    }

    init() {
        //проверяем нужно ли окно регистрации (входная точка) 
       
        this.checkUserAndModal(); 
        
        //инициализируем event listeners для модального окна аутентификации
        this.view.bindCreateAccount(this.handleCreateAccount.bind(this));
        this.view.bindLoginUser(this.handleLoginUser.bind(this));
        this.view.bindLogoutUser(this.handleLogoutUser.bind(this));

        }

    //функция для отображения модального окна для входа в зависимости от того, есть ли пользователь
    checkUserAndModal(){ 
        this.model.checkState().then(user_state => {
           //console.log(user_state); //наш юзер (проверка: есть или нет)
            if (user_state !== null) {
                this.view.hideModal(); 
            } else {
                this.view.showModal();
            }
        });      
    }

    //Вызов функции создания фаакаунта в Model
    handleCreateAccount(userEmail, userPass) {               
       this.model.create_account(userEmail, userPass).then(setTimeout(this.checkUserAndModal.bind(this), 2000));            
    }

    handleLoginUser(userEmail, userPass) {             
        this.model.login(userEmail, userPass).then(setTimeout(this.checkUserAndModal.bind(this), 2000));        
     }

     handleLogoutUser() {               
        this.model.logout();   
        this.checkUserAndModal();         
     }

     //функции для заполнения контента в блоке с id = "root" в зависимости от хэша в адресной строке (вызываются из роутера)
     async infoRoute() {
        console.log('This is infoRoute');
     }

     async showRatingRoute() {
        console.log('This is showRatingRoute');
     }

     async rateRoute() {
        console.log('This is rateRoute');
     }
  
}

