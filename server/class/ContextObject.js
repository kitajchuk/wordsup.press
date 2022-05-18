"use strict";



const config = require( "../../clutch.config" );
const prismicDOM = require( "prismic-dom" );
const path = require( "path" );
const fs = require( "fs" );



/**
 *
 * Template Context {object}.
 *
 */
class ContextObject {
    constructor ( page ) {
        this.site = null;
        this.navi = null;
        this.page = page;
        this.error = null;
        this.timestamp = config.timestamp;
        this.item = null;
        this.items = null;
        this.stylesheet = config.static.css;
        this.javascript = config.static.js;
        this.config = config;
        this.dom = (config.api.adapter === "prismic" ? prismicDOM : null);
        this.env = process.env.NODE_ENV;
    }

    set ( prop, value ) {
        if ( typeof prop === "object" ) {
            for ( let i in prop ) {
                this[ i ] = prop[ i ];
            }

        } else {
            this[ prop ] = value;
        }
    }

    get ( prop ) {
        return this[ prop ];
    }

    getTemplate () {
        return `pages/${this.page}.html`;
    }

    getPageTitle () {
        const site = this.get( "site" );
        const doc = this.get( "doc" );
        let title = null;
        let isRich = null;

        if ( config.onepager ) {
            title = site.data.title;

        } else if ( doc ) {
            isRich = !(typeof doc.data.title === "string");
            title = `${isRich ? prismicDOM.RichText.asText( doc.data.title ) : doc.data.title} — ${site.data.title}`;

        } else {
            title = site.data.title;
        }

        return title;
    }

    getPageDescription () {
        const site = this.get( "site" );

        return site.data.description;
    }

    getUrl ( doc ) {
        const query = require( "../core/query" );
        const type = config.generate.mappings[ doc.type ] || doc.type;
        const resolvedUrl = doc.uid === config.homepage ? "/" : ((type === "page") ? `/${doc.uid}/` : `/${type}/${doc.uid}/`);

        return resolvedUrl;
    }

    getMediaAspect ( media ) {
        return `${media.height / media.width * 100}%`;
    }

    colorClass ( str ) {
        return str.replace( /\s/g, '-' ).toLowerCase();
    }

    newLine ( str ) {
        return str.replace( /\n/g, '<br />' );
    }

    cleanLines ( str ) {
        return str.replace( /\n/g, '' );
    }

    hyperLink ( type, elem, text ) {
        let ret = null;

        if ( type === "hyperlink" ) {
            ret = `<a href="${this.getUrl( elem.data )}">${text}</a>`;
        }

        return ret;
    }

    shortCodeInclude ( type, elem, text ) {
        let ret = null;
        const match = /^\[(.*?)\]$/.exec( text );

        if ( match ) {
            const file = path.join( config.template.dir, `${match[ 1 ]}.html` );

            if ( fs.existsSync( file ) ) {
                ret = String( fs.readFileSync( file ) );
            }
        }

        return ret;
    }

    shortCodeIndent ( type, elem, text ) {
        let ret = null;
        const matchOpen = /^\[indent\]$/.exec( text );
        const matchClose = /^\[\/indent\]$/.exec( text );

        if ( matchOpen ) {
            ret = `<div class="-ident">`;
        }

        if ( matchClose ) {
            ret = `</div>`;
        }

        return ret;
    }

    headingSwap ( html, curr, swap ) {
        return html.replace( `<${curr}>`, `<${swap} class="${curr}">` ).replace( `</${curr}>`, `</${swap}>` );
    }
}



module.exports = ContextObject;
