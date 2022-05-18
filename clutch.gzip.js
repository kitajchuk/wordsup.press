const fs = require( "fs" );
const path = require( "path" );
const { gzip } = require( "node-gzip" );
const lager = require( "properjs-lager" );
const config = require( "./clutch.config" );
const jsPath = path.join( config.template.staticDir, "js/app.js" );
const cssPath = path.join( config.template.staticDir, "css/screen.css" );

if ( !fs.existsSync( jsPath ) || !fs.existsSync( cssPath ) ) {
    lager.cache( "[Clutch] JS and CSS static files are not present." );

    process.exit( 1 );
}

(async () => {
    const jsString = fs.readFileSync( jsPath );
    const cssString = fs.readFileSync( cssPath );
    const jsCompressed = await gzip( jsString );
    const cssCompressed = await gzip( cssString );

    fs.writeFileSync( jsPath, jsCompressed );
    fs.writeFileSync( cssPath, cssCompressed );

    lager.cache( "[Clutch] JS and CSS has been gzip compressed." );
})();