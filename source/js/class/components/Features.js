import ResizeController from "properjs-resizecontroller";
import navi from "../../modules/navi";



class Features {
    constructor ( element, data ) {
        this.data = data;
        this.element = element;
        this.posters = this.element.find( ".js-features-poster" );
        this.next = this.element.find( ".js-features-next" );
        this.prev = this.element.find( ".js-features-prev" );
        this.curr = this.element.find( ".js-features-curr" );
        this.banner = this.element.find( ".js-features-banner" );
        this.currPoster = this.posters.first().addClass( "is-active" );
        this.currIndex = 0;
        this.timeout = null;
        this.duration = 10000;
        this.resizer = new ResizeController();

        this.bind();
        this.auto();
        this.onResize();
    }


    onResize () {
        const naviMainBounds = navi.main[ 0 ].getBoundingClientRect();
        const headerPaddingLeft = window.getComputedStyle( navi.header[ 0 ] )[ "padding-left" ];

        if ( window.innerWidth <= 1024 ) {
            this.banner[ 0 ].style.width = null;

        } else {
            this.banner[ 0 ].style.width = `calc( 100% - ${naviMainBounds.width}px - ${headerPaddingLeft} - 12px )`;
        }
    }


    auto () {
        const _auto = () => {
            this.timeout = setTimeout(() => {
                this.advance();
                this.transition();
                _auto();

            }, this.duration );
        };

        _auto();
    }


    bind () {
        this.resizer.on( "resize", this.onResize.bind( this ) );

        this.prev.on( "click", () => {
            clearTimeout( this.timeout );
            this.rewind();
            // this.auto();
        });

        this.next.on( "click", () => {
            clearTimeout( this.timeout );
            this.advance();
            // this.auto();
        });
    }


    advance () {
        if ( this.currIndex === (this.posters.length - 1) ) {
            this.currIndex = 0;

        } else {
            this.currIndex++;
        }

        this.transition();
    }


    rewind () {
        if ( this.currIndex === 0 ) {
            this.currIndex = (this.posters.length - 1);

        } else {
            this.currIndex--;
        }

        this.transition();
    }


    goto ( i ) {
        this.currIndex = i;
        this.transition();
    }


    transition () {
        this.currPoster.removeClass( "is-active" );

        const nextPoster = this.posters.eq( this.currIndex );

        this.currPoster = nextPoster.addClass( "is-active" );

        this.curr[ 0 ].innerHTML = (this.currIndex + 1);
    }


    destroy () {
        this.prev.off();
        this.next.off();
        this.resizer.destroy();
    }
}



/******************************************************************************
 * Export
*******************************************************************************/
export default Features;
