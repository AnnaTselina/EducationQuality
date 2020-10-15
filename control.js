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
        this.checkUserState();
    }


    checkUserState(){
        return this.model.checkState().then(user_state => {         
            if (user_state !== null) { // если пользователь есть  
                this.commonEvents();             
                return true;
            } else {//если пользователя нет        
                window.location.hash = "#enter";
            }
        });  
    }

    setDefaultRoute() {
        window.location.hash = "#info";
    }

    commonEvents(){
        this.view.logout_btn.addEventListener('click', this.handleLogoutUser.bind(this));
    }

    enterRoute() {       
        this.model.callRegistration().then(this.enterRouteEventController());
    }

    enterRouteEventController() {
        let elements = this.view.enterRouteElements;
        elements["signInBtn"].addEventListener('click', function() {
            elements["container"].classList.remove("right-panel-active");
        })
        elements["signUpBtn"].addEventListener('click', function() {
            elements["container"].classList.add("right-panel-active");
        })
        //создание аккаунта
        elements["firstForm"].addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleCreateAccount();
        });
        //вход в аккаунт
        elements["secondForm"].addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleLoginAccount();
        });
    }

    handleCreateAccount() {
        let email = this.view._getValuesSignUp[0];
        let password = this.view._getValuesSignUp[1];
            if (email.length !== 0 && password.length !== 0) { 
                var self = this;                                      
                self.model.create_account(email, password).then(function() {                                    
                    self.checkUserState().then(result=> {
                        if (result) {
                            self.setDefaultRoute();
                        }
                    })
                });
            } 
    }

    handleLoginAccount() {
        let email = this.view._getValiesLogIn[0];
        let password = this.view._getValiesLogIn[1];
        if (email.length !== 0 && password.length !== 0) { 
            var self = this; 
            self.model.login(email, password).then(function() {                                    
                self.checkUserState().then(result=> {
                    if (result) {
                        self.setDefaultRoute();
                    }
                })
            });
        } 
    }

    handleLogoutUser() {        
        this.model.logout().then(res => {
            if (res) { //если logout выполнен успешно
                this.checkUserState();
            }
        })
    }

     //функции для заполнения контента в блоке с id = "root" в зависимости от хэша в адресной строке (вызываются из роутера)
    async infoRoute() {        
        this.model.infoRouteLoad();
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
                this.model.startEvaluation().then(this.evaluationEventController());
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
                        case "finish_evaluation":
                            let commentField = document.getElementById("comment").value;
                            if (commentField.length != 0) { //если комментарий есть
                                self.model.setComment(commentField);

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
            
            
        } 
    } 
    
    evaluationEventController() {
        var self = this;
        document.addEventListener('click', function(e){                       
            if (e.target.parentNode.tagName === 'svg'){
                e.target.parentNode.parentNode.setAttribute('data-stars', e.target.parentNode.dataset.rating); 
                
            }
            if(e.target.id === "next_criteria_button"){ 
                //здесь операции по окончании рекурсии               
                if (self.view.criteriaI == (Object.keys(self.model.evaluated_criterias).length)) {
                     //записываем результат в модель                     
                    let results = Object.entries(self.view.result_of_evaluation); 
                    for (let i=0; i<results.length; i++) {
                        self.model.setEvaluatedCriterias(results[i][0], results[i][1]);
                    }
                    self.view.criteriaI = 0; //обнуляем счетчик итераций
                    self.view.result_of_evaluation = {}; // обнуляем результаты оценки
                    self.changeRateRouteState('leaving_comment');
                    self.rateRoute();

                }

                
                
            };
        })
    }
    
    showRatingRoute() {        
        this.model.showRatingParameters().then(this.showRatingEventController());     
    }

    showRatingEventController(){
        var self = this;
        let elements = this.view.showRatingElements;
        
        elements["choose_uni"].addEventListener('change', function(e) {
            if (e.target.options[e.target.selectedIndex].innerHTML.length !== 0) {
                self.model.handleChosenUniInShowRating(e.target.options[e.target.selectedIndex].innerHTML); //получаем выбранное значение в поле select 
                elements["textBoxSearch"].disabled = false;               
            } else {
                elements["textBoxSearch"].disabled = true;
                
            }      
        })
        elements["textBoxSearch"].addEventListener('keyup', async (e) => await this.model.searchByName(e.target.value));
        
        /*
        elements['littleCardsBox'].addEventListener('click', function(event) {
            let target = event.target;            
            if(target.classList.contains('show')) {
                console.log(target.parentNode);
            }
        })*/
    }








}



