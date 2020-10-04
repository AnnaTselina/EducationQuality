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
                var self = this;      
                this.model.startEvaluation().then(function() {                    
                    setTimeout( () => {                                                                     
                        self.rateRouteEventController();
                    }, 1000);
                    
                })
                break;
            case "leaving_comment":
                this.model.askForComment().then(this.rateRouteEventController());
            break;

            case "closing_window":
                this.model.evaluationFinished().then(this.rateRouteEventController());
            break;
         }        
     }

     rateRouteEventController() {
        
         var self = this;
        //вешаем на управляющие элементы обработчики событий
        let elements = Object.entries(self.view.rateRouteElements);        
        for (var i=0; i< elements.length; i++) {
            
            if(elements[i][1].tagName === "SELECT") {
                elements[i][1].addEventListener('change', function(e) {
                    self.model.handleChosenOption(e.target, e.target.options[e.target.selectedIndex].innerHTML);
                })
            } else if (elements[i][1].tagName === "BUTTON") {
                elements[i][1].addEventListener("click", event =>{
                    
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
                        case "next_criteria_button":
                            //отправляем критерии в модель
                            let name_of_criteria = document.getElementById('criteria_name').innerHTML;
                            let value_for_criteria = document.getElementById('criteria_stars').firstChild.dataset.stars;                            
                            self.model.setEvaluatedCriterias(name_of_criteria, value_for_criteria);
                            if (self.view.criteriaEvaluationState === "done") {
                                self.changeRateRouteState('leaving_comment');
                                self.rateRoute();
                            };
                        break;
                        case "finish_evaluation":
                            let commentField = document.getElementById("comment").value;
                            if (commentField.length != 0) { //если комментарий есть
                                self.model.setEvaluatedCriterias('comment', commentField);
                            }                                
                                self.changeRateRouteState('closing_window');
                                self.rateRoute();                            
                        break;
                        case "evaluate_more":
                            self.changeRateRouteState("parameters_choice");
                            self.rateRoute();
                        break;
                        
                    }
                })
            } 
            else if(typeof elements[i] === "object") {                
                if (elements[i][0] === 'stars') {                    
                    elements[i][1].forEach(star => {
                        star.addEventListener('click', function(e) {                            
                            let starEl = e.currentTarget;           
                            starEl.parentNode.setAttribute('data-stars', starEl.dataset.rating);                           
                        });
                        })
                }
            }
            
            
        } 
     }

     getMarks() {

     }

     
  
}

