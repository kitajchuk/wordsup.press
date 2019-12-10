const path = require( "path" );
const fs = require( "fs" );
const request = require( "request-promise" );
const lager = require( "properjs-lager" );
const core = {
    files: require( "../core/files" ),
    config: require( "../../clutch.config" )
};
const authorization = {
    config: require( "../../.clutch/authorizations/mailchimp.config" ),
    store: path.join( __dirname, "../../.clutch/authorizations/mailchimp.auth.json" )
};
const validator = require( "./validator" );



const getMailchimpBuff = () => {
    return Buffer.from( `any:${authorization.config.apiKey}` ).toString( "base64" );
};
const getMailchimpAPIData = ( req, res, url ) => {
    return new Promise(( resolve, reject ) => {
        request({
            url,
            json: true,
            method: "GET",
            headers: {
                "Authorization": `Basic ${getMailchimpBuff()}`
            }

        }).then(( json ) => {
            resolve( json );

        }).catch(( error ) => {
            reject( error );
        });
    });
};
const getMailchimpLists = ( req, res ) => {
    const url = `https://us11.api.mailchimp.com/3.0/lists`;

    getMailchimpAPIData( req, res, url ).then(( json ) => {
        res.status( 200 ).json( json );

    }).catch(( error ) => {
        res.status( 200 ).json( error );
    });
};
const getMailchimpListsById = ( req, res ) => {
    const url = `https://us11.api.mailchimp.com/3.0/lists/${req.params.listId}`;

    getMailchimpAPIData( req, res, url ).then(( json ) => {
        res.status( 200 ).json( json );

    }).catch(( error ) => {
        res.status( 200 ).json( error );
    });
};
const postMailchimpListSignup = ( req, res ) => {
    validator.validateRequest( req, res ).then(() => {
        optinMailchimpListSignup( req.body._form.email_address.value ).then(( json ) => {
            lager.cache( "Mailchimp signup success" );
            lager.data( json );

            res.status( 200 ).json({
                success: true
            });

        }).catch(( error ) => {
            lager.error( "Mailchimp signup failure" );
            lager.data( error );

            res.status( 200 ).json({
                success: false
            });
        });

    }).catch(() => {
        res.status( 200 ).json({
            success: false,
            problem: "Form fields did not validate"
        });
    });
};
const optinMailchimpListSignup = ( email ) => {
    return new Promise(( resolve, reject ) => {
        const url = `https://us11.api.mailchimp.com/3.0/lists/${authorization.config.listId}/members`;

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
            resolve( json );

        }).catch(( error ) => {
            reject( error );
        });
    });
};



module.exports = {
    init ( expressApp, checkCSRF ) {
        expressApp.post( "/api/mailchimp/list/signup", checkCSRF, postMailchimpListSignup );
        expressApp.get( "/api/mailchimp/lists", getMailchimpLists );
        expressApp.get( "/api/mailchimp/lists/:listId", getMailchimpListsById );
    },


    auth ( req, res ) {
        res.status( 200 ).json({
            authorized: fs.existsSync( authorization.store )
        });
    },


    optin ( email ) {
        return optinMailchimpListSignup( email );
    }
};
