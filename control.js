export default class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;  
        
        this.rateRouteState = "parameters_choice"; //состояние окна Rate по умолчанию
        this.changeRateRouteState = function (state) {
            this.rateRouteState = state;
        }
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
         //сначала подгружаем верстку через модель, достаем необходимые элементы и вешаем листнеры на них, затем иницируем слушатель событий
         let step = this.rateRouteState;
         switch (step) {
            case "parameters_choice":
                this.model.handleParameters().then(this.rateRouteEventController());
                break;
            case "confirmation":               
                this.model.confirmEvaluation().then(this.rateRouteEventController());
            break;
            case "evaluation":
                //TODO: проверить нужен ли здесь вызов контроллера
                this.model.startEvaluation().then(this.rateRouteEventController());
            break;
         }        
     }

     rateRouteEventController() {
         var self = this;
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
                        case "evaluate_button": 
                            self.changeRateRouteState("confirmation"); //указываем состояние 
                            self.rateRoute();
                        break;
                        case "start_evaluation":
                            self.changeRateRouteState("evaluation");
                            self.rateRoute();
                        break;
                        case "change_parameters":
                            self.changeRateRouteState("parameters_choice");
                            self.rateRoute();
                        break;
                    }
                })
            }
        } 
     }

     
  
}

