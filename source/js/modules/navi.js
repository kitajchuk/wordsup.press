import * as core from "../core";
import ResizeController from "properjs-resizecontroller";


/**
 *
 * @public
 * @namespace navi
 * @description Performs the branded load-in screen sequence.
 * @memberof menus
 *
 */
const navi = {
    /**
     *
     * @public
     * @method init
     * @memberof menus.navi
     * @description Method initializes navi node in DOM.
     *
     */
    init () {
        this.element = core.dom.body.find( ".js-navi" );
        this.header = core.dom.body.find( ".js-header" );
        this.items = this.element.find( ".js-navi-a" );
        this.main = this.element.find( ".js-navi-main" );
        this.submenu = this.element.find( ".js-navi-submenu" );
        this.dropper = this.element.find( ".js-navi-drop" );
        this.submenuBg = this.header.find( ".js-navi-submenu-bg" );
        this.mobileMenu = this.header.find( ".js-navi-mobile-menu" );
        this.mobileNavi = this.header.find( ".js-navi-mobile" );
        this.bind();
        this.position();
    },


    position () {
        this.resizer = new ResizeController();
        this.onResize = () => {
            let pad = 0;
            const submenuBgBounds = this.submenuBg[ 0 ].getBoundingClientRect();
            const dropperBounds = this.dropper[ 0 ].getBoundingClientRect();

            if ( window.innerWidth > 640 ) {
                pad = (submenuBgBounds.top - dropperBounds.bottom) + 18;
            }


            this.submenu[ 0 ].style.paddingTop = `${pad}px`;
        };
        this.resizer.on( "resize", this.onResize.bind( this ) );
        this.onResize();
    },


    bind () {
        this.dropper.on( "mouseenter", () => {
            this.submenuBg.addClass( "is-hover" );

        }).on( "mouseleave", () => {
            this.submenuBg.removeClass( "is-hover" );
        });

        this.mobileMenu.on( "click", () => {
            core.dom.html.toggleClass( "is-navi-mobile-open" );
        });
    },


    active ( view, uid ) {
        this.items.removeClass( "is-active" );
        this.items.filter( `.js-navi--${view}` ).addClass( "is-active" );

        if ( uid ) {
            this.items.filter( `.js-navi--${uid}` ).addClass( "is-active" );
        }
    }
};


/******************************************************************************
 * Export
*******************************************************************************/
export default navi;
