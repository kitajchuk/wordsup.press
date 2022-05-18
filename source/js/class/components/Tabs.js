/* eslint-disable no-unreachable */
import * as core from "../../core";
import $ from "properjs-hobo";
import ResizeController from "properjs-resizecontroller";


class Tabs {
    constructor ( element, data ) {
        this.data = data;
        this.element = element;
        this.links = this.element.find( ".js-tabs-link" );
        this.contents = this.element.find( ".js-tabs-content" );
        this.info = this.element.find( ".js-tabs-info" );
        this.dash = this.element.find( ".js-tabs-dash" );
        this.line = this.element.find( ".js-tabs-line" );
        this.resizer = new ResizeController();

        this.bind();
        this.onResize();
        this.setLine();
    }


    bind () {
        this.resizer.on( "resize", this.onResize.bind( this ) );

        this.element.on( "click", ".js-tabs-link", ( e ) => {
            const link = $( e.target );
            const data = link.data();
            const content = this.contents.eq( Number( data.index ) );

            this.links.removeClass( "is-active" );
            link.addClass( "is-active" );

            this.contents.removeClass( "is-active" );
            content.addClass( "is-active" );

            this.setLine();
            this.onResize();
        });
    }


    setLine () {
        const active = this.links.filter( ".is-active" );
        const activeText = active.find( ".js-tabs-link-text" );
        const activeBounds = active[ 0 ].getBoundingClientRect();
        const activeTextBounds = activeText[ 0 ].getBoundingClientRect();
        const dashBounds = this.dash[ 0 ].getBoundingClientRect();
        const offset = active[ 0 ].offsetTop + (activeBounds.height / 2) - 1;
        const width = dashBounds.width - activeTextBounds.width - 50;

        if ( window.innerWidth > 768 ) {
            this.line[ 0 ].style.width = `${width}px`;

            core.util.translate3d(
                this.line[ 0 ],
                0,
                `${offset}px`,
                0
            );
        }
    }


    onResize () {
        if ( window.innerWidth > 768 ) {
            this.setLine();
        }
    }


    destroy () {
        this.resizer.stop();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Tabs;
