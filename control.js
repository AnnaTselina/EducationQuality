export default class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;          

    }

    init() {
        //проверяем нужно ли окно регистрации (входная точка) 
        //console.log(this.model.checkState());
        this.checkUserAndModal(); 
        
        //инициализируем event listeners
        this.view.bindCreateAccount(this.handleCreateAccount.bind(this));
        this.view.bindLoginUser(this.handleLoginUser.bind(this));
        this.view.bindLogoutUser(this.handleLogoutUser.bind(this));

    }

    //функция для отображения модального окна для входа в зависимости от того, есть ли пользователь
    checkUserAndModal(){ 
        this.model.checkState().then(user_state => {
            console.log(user_state);
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
  
}

