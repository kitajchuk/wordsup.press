// import * as core from "../../core";



class Disqus {
    constructor ( element, data ) {
        this.element = element;
        this.data = data;

        this.init( data );
        this.load();
    }


    init ( data ) {
        window.disqus_config = function () {
            this.page.url = data.url;
            this.page.identifier = data.identifier;
            this.page.title = data.title;
        };
    }


    load () {
        const script = document.createElement( "script" );

        script.src = "https://wordsup-press.disqus.com/embed.js";
        script.setAttribute( "data-timestamp", Number( new Date() ) );
        (document.head || document.body).appendChild( script );
    }


    destroy () {
        window.disqus_config = null;
        delete window.disqus_config;
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Disqus;
