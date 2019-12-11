exports.handler = ( event, context, callback ) => {
    const recaptcha = require( "./recaptcha" );
    const mailchimp = require( "./mailchimp" );
    const request = {};

    console.log( "EVENT", event );

    try {
        request.body = JSON.parse( event.body );

    } catch ( error ) {
        console.log( "ERROR", error );
    }

    if ( event.body._action === "Signup" ) {
        mailchimp.exec( request ).then(( response ) => {
            callback( null, {
                statusCode: 200,
                body: JSON.stringify( response )
            });
        });

    } else {
        recaptcha.exec( request ).then(( response ) => {
            callback( null, {
                statusCode: 200,
                body: JSON.stringify( response )
            });
        });
    }
};
