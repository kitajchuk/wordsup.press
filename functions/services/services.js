import recaptcha from "./recaptcha";
import mailchimp from "./mailchimp";



exports.handler = ( event, context, callback ) => {
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
