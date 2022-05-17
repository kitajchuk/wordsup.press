import * as core from "../core";
import BaseController from "./controllers/BaseController";
import View from "./components/View";
import Form from "./components/Form";
import Tabs from "./components/Tabs";
import Features from "./components/Features";
import Masthead from "./components/Masthead";
import Disqus from "./components/Disqus";


/**
 *
 * @public
 * @global
 * @class Controllers
 * @classdesc Handle controller functions.
 * @param {object} options Optional config
 *
 */
class Controllers {
    constructor ( options ) {
        this.element = options.el;
        this.callback = options.cb;
        this.controllers = [];
    }


    push ( id, elements, controller, component ) {
        this.controllers.push({
            id,
            elements,
            instance: null,
            Controller: controller,
            component
        });
    }


    init () {
        this.controllers.forEach(( controller ) => {
            if ( controller.elements.length ) {
                controller.instance = new controller.Controller(
                    controller.elements,
                    controller.component
                );
            }
        });
    }


    kill () {
        this.controllers.forEach(( controller ) => {
            if ( controller.instance ) {
                controller.instance.destroy();
            }
        });

        this.controllers = [];
    }


    exec () {
        this.controllers = [];

        this.push( "view", core.dom.body.find( ".js-view" ), BaseController, View );
        this.push( "form", core.dom.body.find( ".js-form" ), BaseController, Form );
        this.push( "tabs", core.dom.body.find( ".js-tabs" ), BaseController, Tabs );
        this.push( "masthead", core.dom.main.find( ".js-masthead" ), BaseController, Masthead );
        this.push( "features", core.dom.main.find( ".js-features" ), BaseController, Features );
        this.push( "disqus", core.dom.main.find( "#disqus_thread" ), BaseController, Disqus );

        this.init();
    }


    destroy () {
        this.kill();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Controllers;
