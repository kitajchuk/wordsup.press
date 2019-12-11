const striptags = require( "striptags" );
const validator = {
    striptags,

    isEmpty ( str ) {
        return (str === "");
    },

    isEmail ( str ) {
        return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test( str );
    },

    validateRequest ( event ) {
        return new Promise(( resolve, reject ) => {
            let isResolve = true;

            for ( let i in event.body._form ) {
                if ( event.body._form.hasOwnProperty( i ) ) {
                    const checkEmpty = /^text/.test( event.body._form[ i ].type );
                    const checkEmail = /^email/.test( event.body._form[ i ].type );

                    // Sanitize incoming :POST strings
                    event.body._form[ i ].value = striptags( event.body._form[ i ].value );

                    if ( checkEmpty && validator.isEmpty( event.body._form[ i ].value ) ) {
                        isResolve = false;
                    }

                    if ( checkEmail && !validator.isEmail( event.body._form[ i ].value ) ) {
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
