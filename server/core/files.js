const fs = require( "fs" );
const path = require( "path" );



module.exports = {
    read ( path, sync ) {
        if ( sync ) {
            return JSON.parse( String( fs.readFileSync( path ) ) );

        } else {
            return new Promise(( resolve, reject ) => {
                fs.readFile( path, ( error, data ) => {
                    if ( error ) {
                        reject( error );

                    } else {
                        resolve( JSON.parse( String( data ) ) );
                    }
                });
            });
        }
    },

    write ( path, content, sync ) {
        if ( sync ) {
            return fs.writeFileSync( path, JSON.stringify( content ) );

        } else {
            return new Promise(( resolve, reject ) => {
                fs.writeFile( path, JSON.stringify( content ), ( error ) => {
                    if ( error ) {
                        reject( error );

                    } else {
                        resolve();
                    }
                });
            });
        }
    },

    writeStr ( path, content, sync ) {
        if ( sync ) {
            return fs.writeFileSync( path, String( content ) );

        } else {
            return new Promise(( resolve, reject ) => {
                fs.writeFile( path, String( content ), ( error ) => {
                    if ( error ) {
                        reject( error );

                    } else {
                        resolve();
                    }
                });
            });
        }
    }
};
