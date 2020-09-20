//это рабочий скрипт, где происходит компиляция всех элементов модели MVC

import Model from './model.js';
import View from './view.js';
import Controller from './control.js';
import Router from './router.js'

//создаем нашу приложеньку и увязываем компоненты MVC
const appController = new Controller(new Model(), new View(), new Router());
const appRouter = new Router(appController);


//Инициализируем контроллер и роутер
appController.init();
appRouter.init();




