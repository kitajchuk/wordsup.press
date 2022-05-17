const fs = require( "fs" );
const { gzip } = require( "node-gzip" );



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

    async write ( path, content, sync ) {
        if ( sync ) {
            content = await gzip( JSON.stringify( content ) );

            return  fs.writeFileSync( path, content );

        } else {
            return new Promise(async ( resolve, reject ) => {
                content = await gzip( JSON.stringify( content ) );

                fs.writeFile( path, content, ( error ) => {
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
