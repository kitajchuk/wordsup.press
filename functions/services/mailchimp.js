const path = require( "path" );
const fs = require( "fs" );
const request = require( "request-promise" );
const lager = require( "properjs-lager" );
const validator = require( "./validator" );



const getMailchimpBuff = () => {
    return Buffer.from( `any:${process.env.MAILCHIMP_API_KEY}` ).toString( "base64" );
};
const optinMailchimpListSignup = ( email ) => {
    return new Promise(( resolve, reject ) => {
        const url = `https://us11.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`;

        request({
            url,
            method: "POST",
            headers: {
                "Authorization": `Basic ${getMailchimpBuff()}`,
                "Content-Type": "application/json"
            },
            json: {
                status: "subscribed",
                email_address: email
            }

        }).then(( json ) => {
            lager.cache( "Mailchimp signup success" );
            lager.data( json );

            resolve({
                success: true
            });

        }).catch(( error ) => {
            lager.error( "Mailchimp signup failure" );
            lager.data( error );

            resolve({
                success: false,
                error
            });
        });
    });
};



module.exports = {
    exec ( event ) {
        return new Promise(( resolve, reject ) => {
            if ( event.body._action === "Signup" ) {
                validator.validateRequest( event ).then(() => {
                    optinMailchimpListSignup( event.body._form.email_address.value ).then(( response ) => {
                        resolve( response );
                    });

                }).catch(( error ) => {
                    resolve({
                        success: false,
                        error
                    });
                });
            }
        });
    },


    optin ( event ) {
        return new Promise(( resolve, reject ) => {
            optinMailchimpListSignup( event.body._form.email_address.value ).then(( response ) => {
                resolve( response );
            })
        });
    }
};
