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

    }


