export default class View {
    constructor(){
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
            get_parameters:  '<div id="parameters_choice"><form><h3>Выберите необходимые параметры:</h3><label>ВУЗ:</label><select id="uni_choice"><option value = "0"> </option></select><br><label>Дисциплина:</label><select id="subject_choice"><option value = "0"> </option></select><br><label>Преподаватель:</label><select id="teacher_choice"><option value = "0"> </option></select><br><label>Тип занятия:</label><select id="type_of_class"><option value = "0"> </option><option value = "1">Лекции</option><option value = "2">Практические занятия</option><option value = "3">Лабораторные работы</option></select><br><input type="submit" id="evaluate_button" value="Оценить"></form></div>'
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

     //добавить innerHTML 
     insertHtml(text) {
         this.app.innerHTML = text;
     }

     parametersInsertion(result) {
        let uni_choice = document.getElementById('uni_choice');
         result.forEach(function(doc) {
            
             var opt = document.createElement('option');
                opt.textContent = doc.id;
                uni_choice.appendChild(opt);

         })   
         uni_choice.addEventListener('change', function() {
            let selected_uni = uni_choice.options[uni_choice.selectedIndex].innerHTML;
            console.log(selected_uni);
        })    
     }

     


    }


