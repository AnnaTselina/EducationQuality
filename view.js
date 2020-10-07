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
        this.rateRouteElements = { };

        
        this.htmlLayouts = {
            get_parameters:  '<div id="parameters_choice"><form><h3>Выберите необходимые параметры:</h3><label>ВУЗ:</label><select id="uni_choice"><option value = "0"> </option></select><br><label>Дисциплина:</label><select id="subject_choice"><option value = "0"> </option></select><br><label>Преподаватель:</label><select id="teacher_choice"><option value = "0"> </option></select><br><label>Тип занятия:</label><select id="type_of_class"><option value = "0"> </option></select><br><div id="notifications"></div><button id="evaluate_button">Оценить</button></form></div>', 
            confirmation_window: " <div id = 'confirmation_window'><h4>Подтвердите выбранные параметры</h4><table><tr><td>ВУЗ:</td><td id = 'chosen_uni_text'> </td></tr><tr><td>Дисциплина:</td><td id = 'chosen_subj_text'> </td></tr><tr><td>Преподаватель:</td><td id = 'chosen_teacher_text'> </td></tr><tr><td>Тип занятий:</td><td id = 'chosen_type_text'> </td></tr></table><div class = 'confirmation_buttons'><button id = 'start_evaluation'>Верно, начать оценивание</button> <button id= 'change_parameters'>Выбрать другие параметры</button></div></div>",
            evaluation_window: '<div id ="evaluation_window"> <p id="criteria_name"></p> <div id="criteria_stars"> <div class="stars" data-stars="1"> <svg height="50" width="50" class="star rating" data-rating="1"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> <svg height="50" width="50" class="star rating" data-rating="2"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> <svg height="50" width="50" class="star rating" data-rating="3"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> <svg height="50" width="50" class="star rating" data-rating="4"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> <svg height="50" width="50" class="star rating" data-rating="5"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> </div> </div> <div id="next_criteria"> <button id ="next_criteria_button"> <svg width="31" height="28"> <path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z" fill="#571457" data-original="#1e201d"/> </svg> </button> </div> </div> ',
            leave_comment_field: '<div id="leave_comment"><h3>Хотите ли вы оставить отзыв? </h3><p>Пожалуйста, помните об уважении. Комментарии, содержащие нецензурные выражения будут удаляться.</p><textarea id = "comment" placeholder = "Хороший преподаватель и занятия интересные..." maxlength = "300"></textarea><br><div class ="button_area"><button id="finish_evaluation">Готово</button></div></div>',
            thank_you_window: ' <div id="thank_you_window"><h3>Спасибо за ваше мнение!</h3><p>Ваши оценки: </p><table></table><button id="evaluate_more">Оценить еще</button></div> '
        }

        this.setElement = function(group, name, value) { //функция для записи элемента
            group[name] = value;
        }

        //элементы для работы во время рекурсии при оценивании
        this.criteriaEvaluationState = null;
        this.criteriaI = 0;
        this.incrementIteration = function() {
            this.criteriaI++;
        }
        this.result_of_evaluation = {};
        this.write_result_of_evaluation = function(criteria, value){
            this.result_of_evaluation[criteria] = value;
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
        var notification = document.createElement('p');
        notification.innerHTML = "Вы уже оценивали по данным параметрам. Пожалуйста, выберите другие."

        switch (field.id) {
            case "uni_choice":
                document.getElementById('notifications').innerHTML = " ";                
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
                document.getElementById('notifications').innerHTML = " ";  
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
                document.getElementById('notifications').innerHTML = " ";  
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
                document.getElementById('notifications').innerHTML = " "; 
                //ЗДЕСЬ ДЕЛАЕМ ПРОВЕРКУ ОЦЕНИВАЛ ЛИ ПОЛЬЗОВАТЕЛЬ РАНЬШЕ ПО ЭТИМ ПАРАМЕТРАМ И В ЗАВИСИМОСТИ ОТ РЕЗУЛЬТАТА РАЗДИЗЕЙБЛИВАЕМ КНОПКУ ИЛИ ПИШЕМ УВЕДОМЛЕНИЕ
                self.model.checkUserPast().then(result => {                    
                    if (result == 0) { //если все ок
                        while (document.getElementById('notifications').firstChild) {
                            document.getElementById('notifications').removeChild(document.getElementById('notifications').firstChild);
                        }
                        this.parametersFieldCheckup(); 
                    } else {
                        document.getElementById('notifications').appendChild(notification);
                        this.parametersFieldCheckup("disable"); 
                    }
                })
                break;

        }
        
    }

    //Функция дизейбливания кнопки в зависимости от заполненности полей
    parametersFieldCheckup(state) {                              
        var submit_button = this.rateRouteElements["submit_button"];            
        if (this.rateRouteElements["type_choice"].value.length == 1 || state == "disable") {
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

    evaluationProcess(criterias) {
        //удаляем 2 ненужные кнопки
        document.getElementById("start_evaluation").remove();
        document.getElementById("change_parameters").remove();
        document.getElementById('confirmation_window').getElementsByTagName('h4')[0].innerHTML = "Выбранные параметры";

        var self = this;
        this.app.insertAdjacentHTML("beforeend", '<div id="evaluation_field"></div>') //добавляем контейнер, где будут меняться критерии          
        
        this.criteriasIteration(criterias.length, criterias);
    }


    //ЭТО РЕКУРСИВНЫЙ МЕТОД КЛАССА, ОХРЕНЕТЬ, ДА????
    criteriasIteration(length, array) { 

        var self = this;
        if (self.criteriaI == length) { //условие остановки   
            self.incrementIteration(); //от отлавливания в контроллере     
            return; 
        } else {            
            document.getElementById("evaluation_field").innerHTML = self.htmlLayouts.evaluation_window; 
            document.getElementById('criteria_name').innerHTML = array[self.criteriaI];                        
            self.incrementIteration(); //увеличиваем счетчик итерации
            //здесь операции в процессе рекурсии
            document.getElementById("next_criteria").onclick =  function(){  
                //записываем получившиеся элементы 
                let name_of_criteria = document.getElementById('criteria_name').innerHTML;
                let value_for_criteria = document.getElementsByClassName('stars')[0].dataset.stars;                 
                self.write_result_of_evaluation(name_of_criteria, value_for_criteria);
                
                return self.criteriasIteration(length, array);
            }
            
        }
    }

    
    
    leave_comment() {        
        document.getElementById("evaluation_field").innerHTML = this.htmlLayouts.leave_comment_field;
        this.setElement(this.rateRouteElements, "finish_evaluation", document.getElementById('finish_evaluation'));
    }

    evaluation_closure(val, com) {
        
        this.app.innerHTML = this.htmlLayouts.thank_you_window;
        this.setElement(this.rateRouteElements, "evaluate_more", document.getElementById('evaluate_more'));
        let table = document.getElementById('thank_you_window').getElementsByTagName('table')[0];    
        for (let i=0; i<val.length; i++) {
            table.insertAdjacentHTML('beforeend', "<tr><td>"+ val[i][0] + "</td><td>" +val[i][1] + "</td></tr");            
        }
        if (com !== null) {
            table.insertAdjacentHTML('beforeend', "<tr><td>Комментарий: </td><td> " + com + "</td></tr")
        } 

        
    }

    }


