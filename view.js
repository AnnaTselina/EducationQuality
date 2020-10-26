export default class View {
    constructor(){
        this.model = null;
        this.setModel = function(myModel) {
            this.model = myModel;
        }

        //Корневой элемент, куда помещаем все содержимое
        this.app = document.getElementById('root');
        this.logout_btn = document.getElementById('logout_btn');

        this.enterRouteElements = {};

        this.infoRouteElements = {};

        //элементы для RateRoute
        this.rateRouteElements = { };

        //элементы showRating Route
        this.showRatingElements = {};
        
        
        this.htmlLayouts = {
            registration_window: ' <div id="modal" class="modal"> <h1>EdQ</h1> <h3>- проект по оценке качества университетского образования</h3> <div class="container right-panel-active"> <!-- Зарегистрироваться --> <div class="container__form container--signup"> <form action="#" class="form" id="form1"> <h2 class="form__title">Зарегистрироваться</h2> <input type="email" placeholder="Email" id="signup_email" class="input" /> <input type="password" placeholder="Пароль" id="signup_password" class="input" /> <button class="btn" type="submit">Зарегистрироваться</button> </form> </div> <!-- Sign In --> <div class="container__form container--signin"> <form action="#" class="form" id="form2"> <h2 class="form__title">Войти</h2> <input type="email" placeholder="Email" id="signin_email" class="input" /> <input type="password" placeholder="Пароль" id="signin_password" class="input" /> <button class="btn" type="submit">Войти</button> </form> </div> <!-- Overlay --> <div class="container__overlay"> <div class="overlay"> <div class="overlay__panel overlay--left"> <button class="btn" id="signIn">Войти</button> </div> <div class="overlay__panel overlay--right"> <button class="btn" id="signUp">Зарегистрироваться</button> </div> </div> </div> </div> </div>',
            information: '<div class = "header"><div class="container_info"><div id="numbers_boxes"></div><div id="info"><h1>EdQ - </h1></div></div></div>',
            get_parameters:  '<div id="parameters_choice"><form><h3>Выберите необходимые параметры:</h3><label>ВУЗ:</label><select id="uni_choice"><option value = "0"> </option></select><br><label>Дисциплина:</label><select id="subject_choice"><option value = "0"> </option></select><br><label>Преподаватель:</label><select id="teacher_choice"><option value = "0"> </option></select><br><label>Тип занятия:</label><select id="type_of_class"><option value = "0"> </option></select><br><div id="notifications"></div><button id="evaluate_button">Оценить</button></form></div>', 
            confirmation_window: " <div id = 'confirmation_window'><h4>Подтвердите выбранные параметры</h4><table><tr><td>ВУЗ:</td><td id = 'chosen_uni_text'> </td></tr><tr><td>Дисциплина:</td><td id = 'chosen_subj_text'> </td></tr><tr><td>Преподаватель:</td><td id = 'chosen_teacher_text'> </td></tr><tr><td>Тип занятий:</td><td id = 'chosen_type_text'> </td></tr></table><div class = 'confirmation_buttons'><button id = 'start_evaluation'>Верно, начать оценивание</button> <button id= 'change_parameters'>Выбрать другие параметры</button></div></div>",
            evaluation_window: '<div id ="evaluation_window"> <p id="criteria_name"></p> <div id="criteria_stars"> <div class="stars" data-stars="1"> <svg height="50" width="50" class="star rating" data-rating="1"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> <svg height="50" width="50" class="star rating" data-rating="2"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> <svg height="50" width="50" class="star rating" data-rating="3"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> <svg height="50" width="50" class="star rating" data-rating="4"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> <svg height="50" width="50" class="star rating" data-rating="5"> <polygon id="star" points="23,0,28.290067270632257,15.718847050625474,44.874299874788534,15.892609129376208,31.559508646656383,25.781152949374526,36.519060802726884,41.60739087062379,23,32,9.48093919727312,41.60739087062379,14.440491353343619,25.78115294937453,1.1257001252114662,15.892609129376215,17.70993272936774,15.718847050625474" style="fill-rule:nonzero;"></polygon> </svg> </div> </div> <div id="next_criteria"> <button id ="next_criteria_button"> <svg width="31" height="28"> <path d="M21.205,5.007c-0.429-0.444-1.143-0.444-1.587,0c-0.429,0.429-0.429,1.143,0,1.571l8.047,8.047H1.111 C0.492,14.626,0,15.118,0,15.737c0,0.619,0.492,1.127,1.111,1.127h26.554l-8.047,8.032c-0.429,0.444-0.429,1.159,0,1.587 c0.444,0.444,1.159,0.444,1.587,0l9.952-9.952c0.444-0.429,0.444-1.143,0-1.571L21.205,5.007z" fill="var(--turquoise)" data-original="#1e201d"/> </svg> </button> </div> </div> ',
            leave_comment_field: '<div id="leave_comment"><h3>Хотите ли вы оставить отзыв? </h3><p>Пожалуйста, помните об уважении. Комментарии, содержащие нецензурные выражения будут удаляться.</p><textarea id = "comment" placeholder = "Хороший преподаватель и занятия интересные..." maxlength = "300"></textarea><br><div class ="button_area"><button id="finish_evaluation">Готово</button></div></div>',
            thank_you_window: ' <div id="thank_you_window"><h3>Спасибо за ваше мнение!</h3><p>Ваши оценки: </p><table></table><button id="evaluate_more">Оценить еще</button></div> ',
            showRating_fields: '<select id="choose_uni"><option></option></select><input type="text" disabled id="textBoxSearch" placeholder="Начните вводить фамилию/дисциплину. Пример: `Петрова Бухгалтерский учет`"><br><div id="littleCardsBox"></div>'
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


    showRegistration() {
        this.app.innerHTML = this.htmlLayouts.registration_window;
        this.setElement(this.enterRouteElements, "signInBtn", document.getElementById("signIn"));
        this.setElement(this.enterRouteElements, "signUpBtn",  document.getElementById("signUp"));
        this.setElement(this.enterRouteElements, "firstForm", document.getElementById("form1"));
        this.setElement(this.enterRouteElements, "secondForm", document.getElementById("form2"));
        this.setElement(this.enterRouteElements, "container", document.querySelector(".container"));
        this.setElement(this.enterRouteElements, "signup_email", document.getElementById('signup_email'));
        this.setElement(this.enterRouteElements, "signup_password", document.getElementById('signup_password'));
        this.setElement(this.enterRouteElements, "signin_email", document.getElementById('signin_email'));
        this.setElement(this.enterRouteElements, "signin_password", document.getElementById('signin_password'));
    }

    get _getValuesSignUp() {
        let values = [this.enterRouteElements["signup_email"].value, this.enterRouteElements["signup_password"].value]
        return values;
    } 

    get _getValiesLogIn() {
        let values = [this.enterRouteElements["signin_email"].value, this.enterRouteElements["signin_password"].value]
        return values;
    }

    /*Параметры для Info Route  - дефолтный путь*/ 
    infoRouteShow(){        
        document.getElementById('navigation').style.display = 'flex';
        this.app.style.padding = "0px";
        this.app.innerHTML = this.htmlLayouts.information;
        let main_info = document.createElement('p');
        main_info.classList += "project_description";
        main_info.innerHTML = "проект позволяющий оценить степень удовлетворенности студентов получаемым образованием. Оценивание происходит по ряду критериев в зависимости от типа учебных занятий (лекции, лабораторные работы, практические занятия). Также можно поделиться своим мнением в более открытой форме в виде отзыва.";
        let other_info = document.createElement('p');
        other_info.classList += "project_description";
        other_info.innerHTML = 'Проект полезен тем, что позволяет студентам обмениваться мнениями, узнать чего можно ожидать в дальнейшем при прохождении курса, а также в целом оценить насколько студенты довольны тем образованием, которое они получают в университете.';
        document.getElementById("info").appendChild(main_info);
        document.getElementById("info").appendChild(other_info);

        const box = document.getElementById("numbers_boxes");       

        //количество оцененных курсов
        let courses = document.createElement('div');        
        courses.classList += "counter";
        let numCourses = document.createElement('div');
        numCourses.classList += "numbers";
        numCourses.id = "numCourses";
        let textCourses = document.createElement('div');
        textCourses.classList += "texts";
        textCourses.innerHTML = "- количество оцененных курсов";
        courses.appendChild(numCourses);
        courses.appendChild(textCourses);
        box.appendChild(courses);

        //количество пользователей в системе
        let users = document.createElement('div');        
        users.classList += "counter";
        let numUsers = document.createElement('div');
        numUsers.classList += "numbers";
        numUsers.id = "numUsers";
        let textUsers = document.createElement('div');
        textUsers.classList += "texts";
        textUsers.innerHTML = "- количество пользователей в системе";
        users.appendChild(numUsers);
        users.appendChild(textUsers);
        box.appendChild(users);


        this.setElement(this.infoRouteElements, 'num_courses', numCourses);
        this.setElement(this.infoRouteElements, 'num_users', numUsers);
    }

     //работаем с окном с параметрами
    workWithRatingParameters() {
        document.getElementById('navigation').style.display = 'flex';
        this.app.innerHTML = this.htmlLayouts.get_parameters;
        this.app.style.padding = "20px 200px";
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
            submit_button.style.color = 'black';
            submit_button.style.cursor = 'default';
        } else {
            submit_button.disabled = false;
            submit_button.style.backgroundColor = 'var(--turquoise)';
            submit_button.style.color = 'white';
            submit_button.style.cursor = 'pointer';
            submit_button.style.border = "1px solid var(--turquoise);"
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
            return; 
        } else {     
            document.getElementById("evaluation_field").innerHTML = self.htmlLayouts.evaluation_window;            
            document.getElementById('criteria_name').innerHTML = array[self.criteriaI];                        
            self.incrementIteration(); //увеличиваем счетчик номера критерия
            //здесь операции в процессе рекурсии
            
            document.getElementById("next_criteria").onclick =  function(e){  
                //записываем получившиеся элементы 
                let name_of_criteria = document.getElementById('criteria_name').innerHTML;
                let value_for_criteria = document.getElementsByClassName('stars')[0].dataset.stars;                 
                self.write_result_of_evaluation(name_of_criteria, value_for_criteria);
                
                e.target.parentNode.parentNode.style.animation= "slide 0.7s";   
                e.target.parentNode.parentNode.addEventListener("animationend", function() {
                    return self.criteriasIteration(length, array);
                })            
                        
               // return setTimeout(function(){self.criteriasIteration(length, array)}, 700);
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

    //МЕТОДЫ ДЛЯ SHOWRATING ROUTE
    displayShowRatingParameters() {  
        document.getElementById('navigation').style.display = 'flex';      
        this.app.innerHTML = this.htmlLayouts.showRating_fields;
        this.app.style.padding = "20px 200px";
        //добавляем управляющие элементы для showRatingRoute
        let chooseUni = document.getElementById('choose_uni');
        let inputField = document.getElementById('textBoxSearch');
        let cardsField = document.getElementById('littleCardsBox');

        this.setElement(this.showRatingElements, "choose_uni", chooseUni);
        this.setElement(this.showRatingElements, "textBoxSearch", inputField);
        this.setElement(this.showRatingElements, "littleCardsBox", cardsField);

        //подгружаем опции для выбора универа 
        this.model.getParameters_Uni().then(result => { //отправляемся в модель для получения данных
            result.forEach(function(doc) {            
                var opt = document.createElement('option');
                    opt.textContent = doc.id;
                    chooseUni.appendChild(opt);   
            })   
        })
    }

    //в случае если карточек еще вообще нет (или делается новый запрос в input)
    showLittleCards(snapsh) {
        this.clearLittleCardsBox();
        this.createLittleCards(snapsh);
    }

    addMoreLittleCards(snapsh) {
        this.createLittleCards(snapsh);
    }

    //добавление карточки 
    createLittleCards(snapsh) {     
        
        //добавляем карточки
        snapsh.docs.forEach(doc => { 
        let data = doc.data();        
        //создание маленькой карточки
        let card = document.createElement('div');        
        card.className +="littleCard";
        let img = document.createElement('img');
        img.src = "pic/teachers/" + data["photoURL"] + ".jpg";
        img.className += 'personalPhoto';
        card.appendChild(img);
        let otherText = '<p>'+  data['Дисциплина'] +'</p><p>'+ data['Преподаватель']+'</p><p>'+ data['Тип занятия']+ '</p><p><span>Общая оценка: </span>'+ data['Общая оценка']+'</p><p><span>Количество оценок: </span>'+ data['Количество оценивших']+'</p>'
        card.insertAdjacentHTML('beforeend', otherText);
        let button = document.createElement('button');
        button.className += "show";
        button.innerHTML = "Просмотреть";
        card.appendChild(button);
        this.showRatingElements['littleCardsBox'].appendChild(card);
        var self = this;    
        button.addEventListener('click', function() {
                self.showMoreInformation(data);
            })
        })
        
    }

    showMoreInformation(d){
        //тут все модальное окно
        let modal = document.createElement('div');
        modal.className += 'modal-bigCard';
        let modalContent = document.createElement('div');
        modalContent.className += 'bigCard';
        let img = document.createElement('img');  
        img.src = "pic/teachers/" + d["photoURL"] + ".jpg"
        img.className += 'personalPhoto';
        modalContent.appendChild(img);
        let otherText = '<table><tr><td><span>Дисциплина: </span></td><td>'+ d['Дисциплина'] +'</td></tr><tr><td><span>Преподаватель: </span></td><td>'+ d['Преподаватель'] +'</td></tr><tr><td><span>Тип занятия: </span></td><td>'+ d['Тип занятия'] +'</td></tr><tr><td><span>Общая оценка: </span></td><td>' + d['Общая оценка']+ '</td></tr><tr><td><span>Количество оценивших: </span></td><td>'+d['Количество оценивших']+'</td></tr></table>';
        modalContent.insertAdjacentHTML('beforeend', otherText);
        let criteriaHeading = document.createElement('p');
        criteriaHeading.innerHTML = 'Критерии:';
        criteriaHeading.style.textAlign = "center";
        modalContent.appendChild(criteriaHeading);
        let criteriaTable = document.createElement('table');
        criteriaTable.id = "criteria_table";
        let criteriaTableBody = document.createElement('tbody');
        criteriaTable.appendChild(criteriaTableBody);
        criteriaTable.style.margin = "0 auto";
        let criterias = Object.entries(d['Критерии']);
        
        for (let i =0; i< criterias.length; i++) {
            let row = '<tr><td>'+ criterias[i][0] +'</td><td>'+ criterias[i][1] +'</td></tr>';
            criteriaTableBody.insertAdjacentHTML('beforeend', row);
        }
        modalContent.appendChild(criteriaTable);


        let commentHeading = document.createElement('p');
        commentHeading.innerHTML = "Комментарии";
        modalContent.appendChild(commentHeading);
        
        if (d["Комментарии"]. length != 0){    
            for (let i = 0; i<d["Комментарии"].length; i++) {
                
                let commentBlock = document.createElement('div');
                commentBlock.id = "comment_block"
                let commentName = document.createElement('p');
                commentName.innerHTML = Object.keys(d["Комментарии"][i])[0];
                let commentContent = document.createElement('p');
                commentContent.innerHTML = Object.values(d["Комментарии"][i])[0];
                commentBlock.appendChild(commentName);
                commentBlock.appendChild(commentContent);
                modalContent.appendChild(commentBlock);
            }   

        } else {
            let noComment = document.createElement('p');
            noComment.style.fontSize ="14px";
            noComment.style.fontWeight ="400";
            noComment.innerHTML = "Комментариев нет";
            modalContent.appendChild(noComment);
        }
        

        let closeButton = document.createElement('button');
        closeButton.innerHTML = 'Закрыть';
        modalContent.appendChild(closeButton);        

        modal.appendChild(modalContent);
        this.showRatingElements['littleCardsBox'].appendChild(modal);

        var self = this;
        closeButton.addEventListener('click', function() {
            self.showRatingElements['littleCardsBox'].removeChild(modal);
        })
    }
    
    clearLittleCardsBox() {
        this.showRatingElements['littleCardsBox'].innerHTML = ' '; //очищает блок 
    }

    }


