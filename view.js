export default class View {
    constructor(){
        this.model = null;
        this.setModel = function(myModel) {
            this.model = myModel;
        }


        //Корневой элемент, куда помещаем все содержимое
        this.app = document.getElementById('root');
        this.modal = document.getElementById('modal');
        this.logout_btn = document.getElementById('logout_btn');

        //кнопка для создания аккаунта
        this.createAccButton = document.getElementById('create-acc');
        this.loginUser = document.getElementById('log-acc');
        this.emailField = document.getElementById('email_field');
        this.passwordField = document.getElementById('password_field');

        
        
        this.htmlLayouts = {
            get_parameters:  '<div id="parameters_choice"><form><h3>Выберите необходимые параметры:</h3><label>ВУЗ:</label><select id="uni_choice"><option value = "0"> </option></select><br><label>Дисциплина:</label><select id="subject_choice"><option value = "0"> </option></select><br><label>Преподаватель:</label><select id="teacher_choice"><option value = "0"> </option></select><br><label>Тип занятия:</label><select id="type_of_class"><option value = "0"> </option></select><br><input type="submit" id="evaluate_button" value="Оценить"></form></div>'
        }
    }

    //поиск элемента (пока только по ID)
    getElement(selector) {
        let element = document.getElementById(selector);
        return element;
    }

    //если нет пользователя, то отображаем окошко с регистрацией
    showModal() {
            this.modal.style.display = 'block';
        }

    hideModal() {
        this.modal.style.display = 'none';
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
                handler(this._userEmailAndPass[0], this._userEmailAndPass[1]);
            }            
        });
        
    } 
    
    bindLoginUser(handler) {
        this.loginUser.addEventListener('click', event => {
             event.preventDefault();
            if (this._userEmailAndPass[0].length !== 0 && this._userEmailAndPass[1].length !== 0) {                         
                handler(this._userEmailAndPass[0], this._userEmailAndPass[1]);
            }  
        })
    }

    bindLogoutUser(handler) {
        this.logout_btn.addEventListener('click', event => {
             event.preventDefault();
             handler();
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

        //сохраняем выбранные значения
        let chosen_uni;
        let chosen_subj;

        //параметры для университета       
        this.model.getParameters_Uni().then(result => { //отправляемся в модель для получения данных
            result.forEach(function(doc) {            
                var opt = document.createElement('option');
                   opt.textContent = doc.id;
                   uni_choice.appendChild(opt);   
            })   
        })
        var self = this;
        
        uni_choice.addEventListener('change', function() {
            
            let selected_uni = uni_choice.options[uni_choice.selectedIndex].innerHTML;
            chosen_uni = selected_uni;
            //чистим имеющиеся опции в полях ниже 
            subject_choice.innerHTML = "<option value = '0'> </option>";
            teacher_choice.innerHTML = "<option value = '0'> </option>";
            type_choice.innerHTML = "<option value = '0'> </option>";
            //добавляем нужные опции в поле "Дисциплина"            
            self.model.getParameters_Subj(selected_uni).then(result => {
                result.forEach(function(doc) {
                    var opt = document.createElement('option');
                    opt.textContent = doc.id;
                    subject_choice.appendChild(opt);  
                })
            })
        }) 
        
        //Слушаем что в поле "Дисциплина" и подставляем нужные значения в "Преподавателей"
        subject_choice.addEventListener('change', function() {
            let selected_subj = subject_choice.options[subject_choice.selectedIndex].innerHTML;
            chosen_subj = selected_subj;
            //чистим имеющиеся опции в полях ниже 
            teacher_choice.innerHTML = "<option value = '0'> </option>";
            type_choice.innerHTML = "<option value = '0'> </option>";
            //Добавляем нужные опции в поле "Преподаватель"
            self.model.getParameters_Teacher(chosen_uni, selected_subj).then(result => {
                result.forEach(function(doc) {
                    var opt = document.createElement('option');
                    opt.textContent = doc.id;
                    teacher_choice.appendChild(opt);  
                })
            })
        })
       
     }

     


    }


