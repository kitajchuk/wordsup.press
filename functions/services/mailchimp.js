const path = require( "path" );
const fs = require( "fs" );
const request = require( "request-promise" );
const lager = require( "properjs-lager" );
const validator = require( "./validator" );



const getMailchimpBuff = () => {
    return Buffer.from( `any:${process.env.MAILCHIMP_API_KEY}` ).toString( "base64" );
};
const optinMailchimpListSignup = ( event ) => {
    return new Promise(( resolve, reject ) => {
        const email = event.body._form.email.value;
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
            resolve({
                success: true,
                message: "Mailchimp signup success"
            });

        }).catch(( error ) => {
            resolve({
                success: false,
                message: "Mailchimp signup failure"
            });
        });
    });
};



module.exports = {
    exec ( event ) {
        return new Promise(( resolve, reject ) => {
            if ( event.body._action === "Signup" ) {
                validator.validateRequest( event ).then(() => {
                    optinMailchimpListSignup( event ).then(( response ) => {
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
            optinMailchimpListSignup( event ).then(( response ) => {
                resolve( response );
            })
        });
    }
};
