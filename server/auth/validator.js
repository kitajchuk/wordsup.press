const striptags = require( "striptags" );
const validator = {
    striptags,

    isEmpty ( str ) {
        return (str === "");
    },

    isEmail ( str ) {
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test( str );
    },

    validateRequest ( req, res ) {
        return new Promise(( resolve, reject ) => {
            let isResolve = true;

            for ( let i in req.body._form ) {
                if ( req.body._form.hasOwnProperty( i ) ) {
                    const checkEmpty = /^text/.test( req.body._form[ i ].type );
                    const checkEmail = /^email/.test( req.body._form[ i ].type );

                    // Sanitize incoming :POST strings
                    req.body._form[ i ].value = striptags( req.body._form[ i ].value );

                    if ( checkEmpty && validator.isEmpty( req.body._form[ i ].value ) ) {
                        isResolve = false;
                    }

                    if ( checkEmail && !validator.isEmail( req.body._form[ i ].value ) ) {
                        isResolve = false;
                    }
                }
            }

            if ( isResolve ) {
                resolve();

            } else {
                reject();
            }
        });
    }
};
module.exports = validator;
