//Роутер необходим для маршрутизации с помощью "#" - страница не обновляется, только контент на ней
//Задача роутера - вызывать методы контроллера
//Роутер, в зависимости от хэша в адресной строке, вызывает соответствующие методы контроллер

export default class Router {
    constructor(controller) {
        this.controller = controller; //теперь мы можем обращаться к методам контроллера
    }

    init() {
        console.log(1);
        this.controller.checkRouter();
    }
    
}




