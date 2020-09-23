//Роутер необходим для маршрутизации с помощью "#" - страница не обновляется, только контент на ней
//Задача роутера - вызывать методы контроллера в зависимости от хэша в адресной строке

 
export default class Router {
    constructor(controller) {
        this.controller = controller; //теперь мы можем обращаться к методам контроллера
    }

    getRouteInfo() {
        const hash = location.hash ? location.hash.slice(1) : ''; //узнаем какой хэш и отрезаем решетку
        
        const [name, id] = hash.split("/");
        
        return {name, params: { id }};
    }
    
    handleHash() { //на основе имени хэша вызываем соответствующий метод контроллера
        const { name } = this.getRouteInfo();
        if (name) {
            const routeName = name + "Route";
            this.controller[routeName]();
        }
    }

    init() {
        addEventListener('hashchange', this.handleHash.bind(this));
        this.handleHash();
    }
    
}




