exports.handler = ( event, context, callback ) => {
    const recaptcha = require( "./recaptcha" );
    const mailchimp = require( "./mailchimp" );

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
