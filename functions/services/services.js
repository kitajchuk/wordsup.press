exports.handler = ( event, context, callback ) => {
    const recaptcha = require( "./recaptcha" );
    const mailchimp = require( "./mailchimp" );

    console.log( "EVENT", event );

    try {
        event.body = JSON.parse( event.body );

    } catch ( error ) {
        console.log( "ERROR", error );
    }

    if ( event.body._action === "Signup" ) {
        mailchimp.exec( event ).then(( response ) => {
            callback( null, {
                statusCode: 200,
                body: response
            });
        });

    } else {
        recaptcha.exec( event ).then(( response ) => {
            callback( null, {
                statusCode: 200,
                body: response
            });
        });
    }
};
