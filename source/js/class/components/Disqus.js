class Disqus {
    constructor ( element, data ) {
        this.element = element;
        this.data = data;
        this.observer = new IntersectionObserver( this.observe.bind( this ) );
        this.observer.observe( this.element[ 0 ] );

        this.init( data );
    }


    observe ( entries ) {
        if ( entries[ 0 ].isIntersecting ) {
            this.observer.disconnect();
            this.load();
        }
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
        this.observer = null;
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Disqus;
