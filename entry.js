//это рабочий скрипт, где происходит компиляция всех элементов модели MVC

import Model from './model.js';
import View from './view.js';
import Controller from './control.js';
import Router from './router.js'

//создаем нашу приложеньку и увязываем компоненты MVC

const appView = new View();
const appModel = new Model(appView);
const appController = new Controller(appModel, appView);
const appRouter = new Router(appController);

appView.setModel(appModel);

//Инициализируем контроллер и роутер
appController.init();
appRouter.init();
appView.init();



