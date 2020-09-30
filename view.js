export default class View {
    constructor(){
        this.model = null;
        this.setModel = function(myModel) {
            this.model = myModel;
        }


        //Корневой элемент, куда помещаем все содержимое
        this.app = document.getElementById('root');
        

        //элементы окошка регистрации
        this.modal = document.getElementById('modal');
        this.createAccButton = document.getElementById('create-acc');        
        this.loginUser = document.getElementById('log-acc');
        this.emailField = document.getElementById('email_field');
        this.passwordField = document.getElementById('password_field');       
        this.logout_btn = document.getElementById('logout_btn');
        

        //элементы для RateRoute
        this.rateRouteElements = {};
        
        this.htmlLayouts = {
            get_parameters:  '<div id="parameters_choice"><form><h3>Выберите необходимые параметры:</h3><label>ВУЗ:</label><select id="uni_choice"><option value = "0"> </option></select><br><label>Дисциплина:</label><select id="subject_choice"><option value = "0"> </option></select><br><label>Преподаватель:</label><select id="teacher_choice"><option value = "0"> </option></select><br><label>Тип занятия:</label><select id="type_of_class"><option value = "0"> </option></select><br><button id="evaluate_button">Оценить</button></form></div>',
            confirmation_window: " <div id = 'confirmation_window'><h4>Подтвердите выбранные параметры</h4><table><tr><td>ВУЗ:</td><td id = 'chosen_uni_text'> </td></tr><tr><td>Дисциплина:</td><td id = 'chosen_subj_text'> </td></tr><tr><td>Преподаватель:</td><td id = 'chosen_teacher_text'> </td></tr><tr><td>Тип занятий:</td><td id = 'chosen_type_text'> </td></tr></table><div class = 'confirmation_buttons'><button id = 'start_evaluation'>Верно, начать оценивание</button> <button id= 'change_parameters'>Выбрать другие параметры</button></div></div>"  
        }

        this.setElement = function(group, name, value) { //функция для записи элемента
            group[name] = value;
        }
    }

    init() {
        this.checkUserStateAndModal();
    }

    checkUserStateAndModal() {
        this.model.checkState().then(user_state => {         
            if (user_state !== null) {                
                this.modal.style.display = 'none';
            } else {                
                this.modal.style.display = 'block';
            }
        });  
    }
    
     //достаем значения инпутов в модальном окне
    get _userEmailAndPass() {
        let values = [this.emailField.value, this.passwordField.value]
        return values;
    }   

    //Обработчики событий
    bindCreateAccount(handler) {
        this.createAccButton.addEventListener('click', event => {
            event.preventDefault();
            if (this._userEmailAndPass[0].length !== 0 && this._userEmailAndPass[1].length !== 0) {                         
                handler(this._userEmailAndPass[0], this._userEmailAndPass[1]).then(setTimeout(this.checkUserStateAndModal.bind(this), 2000));
                
            }            
        });     
    } 
    
    bindLoginUser(handler) {
        this.loginUser.addEventListener('click', event => {
            event.preventDefault();
            if (this._userEmailAndPass[0].length !== 0 && this._userEmailAndPass[1].length !== 0) {                         
                handler(this._userEmailAndPass[0], this._userEmailAndPass[1]).then(setTimeout(this.checkUserStateAndModal.bind(this), 2000));
            }  
        })
    }

    bindLogoutUser(handler) {
        this.logout_btn.addEventListener('click', event => {
            event.preventDefault();
            handler();
            this.checkUserStateAndModal();
            }  
        )        
    }

     //работаем с окном с параметрами
    workWithRatingParameters() {
        this.app.innerHTML = this.htmlLayouts.get_parameters;
        let uni_choice = document.getElementById('uni_choice');
        let subject_choice = document.getElementById('subject_choice');
        let teacher_choice = document.getElementById('teacher_choice');
        let type_choice = document.getElementById('type_of_class');
        let submit_button = document.getElementById('evaluate_button');
        

         //записываем все элементы в конструктор, чтобы к ним мог обратиться контроллер
        this.setElement(this.rateRouteElements, "uni_choice", uni_choice);
        this.setElement(this.rateRouteElements, "subject_choice", subject_choice);
        this.setElement(this.rateRouteElements, "teacher_choice", teacher_choice);
        this.setElement(this.rateRouteElements, "type_choice", type_choice);
        this.setElement(this.rateRouteElements, "submit_button", submit_button);
        
        this.parametersFieldCheckup(); //дизейблим кнопку изначально

         //подгружаем из модели параметры для университета       
         this.model.getParameters_Uni().then(result => { //отправляемся в модель для получения данных
            result.forEach(function(doc) {            
                var opt = document.createElement('option');
                    opt.textContent = doc.id;
                    uni_choice.appendChild(opt);   
            })   
        })
    }

    handleParameterTypes(field, chosen_option) {
        var self = this;    
        
        switch (field.id) {
            case "uni_choice":                
                //чистим имеющиеся опции в полях ниже 
                self.rateRouteElements["subject_choice"].innerHTML = "<option value = '0'> </option>";
                self.rateRouteElements["teacher_choice"].innerHTML = "<option value = '0'> </option>";
                self.rateRouteElements["type_choice"].innerHTML = "<option value = '0'> </option>";
                //Делаем запрос в модель за подходящими опциями и вставляем их в поле "Дисциплина"            
                self.model.getParameters_Subj(chosen_option).then(result => {
                    result.forEach(function(doc) {
                        var opt = document.createElement('option');
                        opt.textContent = doc.id;
                        self.rateRouteElements["subject_choice"].appendChild(opt);  
                    })
                })
                this.parametersFieldCheckup();
                break;

            case "subject_choice":
                //чистим имеющиеся опции в полях ниже 
                self.rateRouteElements["teacher_choice"].innerHTML = "<option value = '0'> </option>";
                self.rateRouteElements["type_choice"].innerHTML = "<option value = '0'> </option>";
                //Добавляем нужные опции в поле "Преподаватель"
                self.model.getParameters_Teacher(self.model.chosen_parameters["uni_choice"], chosen_option).then(result => {
                    result.forEach(function(doc) {
                        var opt = document.createElement('option');
                        opt.textContent = doc.id;
                        self.rateRouteElements["teacher_choice"].appendChild(opt);  
                    })
                })
                this.parametersFieldCheckup();
                break;

            case "teacher_choice":
                //чистим имеющиеся опции в полях ниже           
                self.rateRouteElements["type_choice"].innerHTML = "<option value = '0'> </option>";
                //Добавляем нужные опции в поле "Тип"
                self.model.getParameters_TypeOfClass(self.model.chosen_parameters["uni_choice"], self.model.chosen_parameters["subject_choice"], chosen_option).then(result => {
                    result.forEach(function(doc) {
                        var opt = document.createElement('option');
                        opt.textContent = doc.id;
                        self.rateRouteElements["type_choice"].appendChild(opt); 
                    })
                })
                this.parametersFieldCheckup();
                break;

            case "type_of_class":
                this.parametersFieldCheckup();
                break;
        }
        
    }

    //Функция дизейбливания кнопки в зависимости от заполненности полей
    parametersFieldCheckup() {                              
        var submit_button = this.rateRouteElements["submit_button"];            
        if (this.rateRouteElements["type_choice"].value.length == 1) {
            submit_button.disabled = true;
            submit_button.style.backgroundColor = '#fff';
            submit_button.style.color = 'rgb(87, 20, 87)';
            submit_button.style.cursor = 'default';
        } else {
            submit_button.disabled = false;
            submit_button.style.backgroundColor = 'rgba(91, 50, 110, 0.199)';
            submit_button.style.color = 'black';
            submit_button.style.cursor = 'pointer';
            submit_button.onmouseover = function() {
                submit_button.style.backgroundColor = 'rgb(87, 20, 87)';
                submit_button.style.color = '#fff';
                    }
            submit_button.onmouseout = function() {              
                submit_button.style.backgroundColor = 'rgba(91, 50, 110, 0.199)';
                submit_button.style.color = 'rgb(3, 3, 3)';
                    }
            }
    }
    
    //работа с окошком для подтверждения параметров перед выставлением критериев
    chosenParamConfirm(parameters){        
        this.app.innerHTML = this.htmlLayouts.confirmation_window;
        //отображаем выбранные параметры
        document.getElementById('chosen_uni_text').innerHTML = parameters[0];
        document.getElementById('chosen_subj_text').innerHTML = parameters[1];
        document.getElementById('chosen_teacher_text').innerHTML = parameters[2];
        document.getElementById('chosen_type_text').innerHTML = parameters[3];
        
        //записываем кнопки подтверждения и выбора других параметров для ивент листнеров
        this.setElement(this.rateRouteElements, "start_evaluation", document.getElementById("start_evaluation"));
        this.setElement(this.rateRouteElements, "change_parameters", document.getElementById("change_parameters"));     
    }
//TODO: оСТАНОВИЛИСЬ ЗДЕСЬ
    evaluationProcess(criterias) {
        console.log(criterias);
        
    }
        

    }


