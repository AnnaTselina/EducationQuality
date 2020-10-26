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
                    self.model.addUsertousersList(email);                            
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
    infoRoute() {        
        this.model.infoRouteLoad().then(this.infoRouteController.bind(this));
        
    }

    async infoRouteController() {
        
        let elements = this.view.infoRouteElements;        

        //получаем общее количество оцененных сущностей
        let results = await this.model.getInfoOnProject();
        

        //функция счетчика
    
            function counter(elem, start, end, duration) {
                
                let current = start,
                range = end - start,
                increment = end > start ? 1 : -1,
                step = Math.abs(Math.floor(duration / range)),
                timer = setInterval(() => {
                current += increment;
                elem.textContent = current;
                if (current == end) {
                clearInterval(timer);
            }
                }, step);
            }
            
            counter(elements["num_courses"], 0, results[0], 1500);
            counter(elements["num_users"], 0, results[1], 1600);
            

        


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
        //подключаем слушатель событий для проверки скролла 
    }

    showRatingEventController(){
        var self = this;
        let elements = this.view.showRatingElements;
        let value;
        
        elements["choose_uni"].addEventListener('change', function(e) {
            if (e.target.options[e.target.selectedIndex].innerHTML.length !== 0) {
                self.model.handleChosenUniInShowRating(e.target.options[e.target.selectedIndex].innerHTML); //получаем выбранное значение в поле select 
                elements["textBoxSearch"].disabled = false;               
            } else {
                elements["textBoxSearch"].disabled = true;
                
            }      
        })
        elements["textBoxSearch"].addEventListener('keyup', async (e) => {
            this.model.clearLastShownCard(); //когда вводим новый параметр запроса чистим поле последнего документа для предыдущего запроса
            await this.model.searchByName(e.target.value);
            value = e.target.value;
            
        });


        //для имплементации lazyLoading (infinite scroll) необходимо знать когда полоса прокурутки находится внизу экрана
        window.addEventListener("scroll", async (e) => {
            let scrollable = document.documentElement.scrollHeight - window.innerHeight; //на сколько вообще можно промотать
            let scrolled = window.scrollY //на сколько реально промотали
            
            if(Math.ceil(scrolled) === scrollable) { //когда мы достигаем дна
               //при загрузке последнего документа lastShownCard ничего не содержит
                
                if (this.model.lastShownCard) {  
                await this.model.searchByName(value);
                }
            }
        });
    }

}



