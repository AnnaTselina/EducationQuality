export default class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;      
    }

    init() {
       
   

        //инициализируем event listeners для модального окна аутентификации
        this.view.bindCreateAccount(this.handleCreateAccount.bind(this));
        this.view.bindLoginUser(this.handleLoginUser.bind(this));
        this.view.bindLogoutUser(this.handleLogoutUser.bind(this));
        }

  
    //Вызов функции создания аккаунта в Model
    async handleCreateAccount(userEmail, userPass) {               
       this.model.create_account(userEmail, userPass);            
    }

    async handleLoginUser(userEmail, userPass) {             
        this.model.login(userEmail, userPass);        
     }

     handleLogoutUser() {               
        this.model.logout();                
     }

     //функции для заполнения контента в блоке с id = "root" в зависимости от хэша в адресной строке (вызываются из роутера)
     async infoRoute() {
        console.log('This is infoRoute');
     }

     async showRatingRoute() {
        console.log('This is showRatingRoute');
     }

     rateRoute() {
         var self = this;
         //сначала подгружаем верстку через модель, достаем необходимые элементы и вешаем листнеры на них
        this.model.handleRateRoute().then(function() {
            //вешаем на управляющие элементы обработчики событий
           let elements = Object.values(self.view.rateRouteElements); 
            for (var i=0; i< elements.length; i++) {
                if(elements[i].tagName === "SELECT") {
                    elements[i].addEventListener('change', function(e) {
                        self.model.handleChosenOption(e.target, e.target.options[e.target.selectedIndex].innerHTML);
                    })
                } else if (elements[i].tagName === "BUTTON") {
                    elements[i].addEventListener("click", event =>{
                        event.preventDefault();
                        switch (event.target.id) {
                            //TODO: не работает
                            case "evaluate_button": 
                                self.model.confirmEvaluation();
                            break;
                            case "start_evaluation":
                                console.log(1);
                            break;
                            case "change_parameters":
                                console.log(2);
                            break;
                        }
                    })
                }
            }            
        })
     }

     
  
}

