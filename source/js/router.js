import $ from "properjs-hobo";
import Controller from "properjs-controller";
import PageController from "properjs-pagecontroller";
// import paramalama from "paramalama";
// import * as gsap from "gsap/all";
import Controllers from "./class/Controllers";
import * as core from "./core";
import navi from "./modules/navi";



/**
 *
 * @public
 * @namespace router
 * @description Handles async web app routing for nice transitions.
 *
 */
const router = {
    /**
     *
     * @public
     * @method init
     * @memberof router
     * @description Initialize the router module.
     *
     */
    init () {
        this.blit = new Controller();
        this.animDuration = 500;
        this.controllers = new Controllers({
            el: core.dom.main,
            cb: () => {
                // core.emitter.fire( "app--page-teardown" );
                this.topper();
            }
        });

        // core.emitter.on( "app--intro-teardown", () => {} );

        // Transition page state stuff
        this.state = {
            now: null,
            future: null
        };

        // Query tracking
        this.query = window.location.search;

        this.bindClick();
        this.initPages();
        this.prepPages();

        core.log( "[Router initialized]", this );
    },


    load () {
        return new Promise(( resolve ) => {
            this.controller = new PageController({
                transitionTime: this.animDuration,
                routerOptions: {
                    async: true
                }
            });

            this.controller.setConfig([
                "/",
                ":view",
                ":view/:uid"
            ]);

            // this.controller.setModules( [] );

            //this.controller.on( "page-controller-router-samepage", () => {} );
            this.controller.on( "page-controller-router-transition-out", this.changePageOut.bind( this ) );
            this.controller.on( "page-controller-router-refresh-document", this.changeContent.bind( this ) );
            this.controller.on( "page-controller-router-transition-in", this.changePageIn.bind( this ) );
            this.controller.on( "page-controller-initialized-page", ( data ) => {
                this.initPage( data );
                resolve();
            });
            this.controller.initPage();
        });
    },


    /**
     *
     * @public
     * @method bindClick
     * @memberof router
     * @description Suppress #hash links.
     *
     */
    bindClick () {
        core.dom.body.on( "click", "[href^='#']", ( e ) => e.preventDefault() );
        core.dom.body.on( "click", ".js-blog-link", () => {
            this.query = window.location.search;
        });
    },


    /**
     *
     * @public
     * @method initPages
     * @memberof router
     * @description Create the PageController instance.
     *
     */
    initPages () {

    },


    prepPages () {
        this.controllers.exec();
    },


    /**
     *
     * @public
     * @method initPage
     * @param {object} data The PageController data object
     * @memberof router
     * @description Cache the initial page load.
     *
     */
    initPage ( data ) {
        this.setDoc( data );
        this.setState( "now", data );
        this.setState( "future", data );
        this.setClass();
        navi.active( this.state.now.view, this.state.now.uid );
    },


    /**
     *
     * @public
     * @method parseDoc
     * @param {string} html The responseText to parse out
     * @memberof router
     * @description Get the DOM information to cache for a request.
     * @returns {object}
     *
     */
    parseDoc ( html ) {
        let doc = document.createElement( "html" );
        let main = null;
        let data = null;

        doc.innerHTML = html;

        doc = $( doc );
        main = doc.find( core.config.mainSelector );
        data = main.data();

        return {
            doc,
            main,
            data,
            html: main[ 0 ].innerHTML
        };
    },


    setBlogBack () {
        const blogBack = core.dom.body.find( ".js-blog-back" );

        if ( blogBack.length ) {
            blogBack[ 0 ].href = `/blog/${this.query}`;
        }
    },


    setDoc ( data ) {
        this.doc = this.parseDoc( data.response );
    },


    setState ( time, data ) {
        this.state[ time ] = {
            raw: data,
            uid: data.request.params.uid || null,
            view: data.request.params.view || core.config.homepage
        };
    },


    setClass () {
        if ( this.state.future.view ) {
            core.dom.html.addClass( `is-${this.state.future.view}-page` );
        }

        if ( this.state.future.uid ) {
            core.dom.html.addClass( `is-uid-page` );
        }
    },


    unsetClass () {
        if ( this.state.now.view !== this.state.future.view ) {
            core.dom.html.removeClass( `is-${this.state.now.view}-page` );
        }

        if ( this.state.now.uid && !this.state.future.uid ) {
            core.dom.html.removeClass( `is-uid-page` );
        }
    },


    changePageOut ( data ) {
        core.dom.html.addClass( "is-tranny" );
        core.dom.html.removeClass( "is-navi-mobile-open" );
        this.setState( "future", data );
        this.unsetClass();
        this.setClass();
        navi.active( this.state.future.view, this.state.future.uid );
        this.controllers.destroy();
    },


    changeContent ( data ) {
        this.setDoc( data );
        core.dom.main[ 0 ].innerHTML = this.doc.html;
        this.topper();
        this.controllers.exec();
        core.emitter.fire( "app--analytics-pageview", this.doc );
    },


    changePageIn ( data ) {
        setTimeout(() => {
            core.dom.html.removeClass( "is-tranny" );
            this.setBlogBack();
            this.setState( "now", data );

        }, this.animDuration );
    },

    route ( path ) {
        this.controller.getRouter().trigger( path );
    },


    push ( path, cb ) {
        this.controller.routeSilently( path, (cb || core.util.noop) );
    },


    topper () {
        window.scrollTo( 0, 0 );
    }
};



/******************************************************************************
 * Export
*******************************************************************************/
export default router;
