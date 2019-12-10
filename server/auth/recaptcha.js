const path = require( "path" );
const fs = require( "fs" );
const request = require( "request-promise" );
const lager = require( "properjs-lager" );
const core = {
    files: require( "../core/files" ),
    config: require( "../../clutch.config" )
};
const authorization = {
    config: require( "../../.clutch/authorizations/recaptcha.config" ),
    store: path.join( __dirname, "../../.clutch/authorizations/recaptcha.auth.json" )
};
const validator = require( "./validator" );
const mailchimp = require( "./mailchimp" );
const nodemailer = require( "nodemailer" );



const checkRecaptcha = ( req, res, next ) => {
    request({
        url: "https://www.google.com/recaptcha/api/siteverify",
        method: "POST",
        json: true,
        form: {
            secret: authorization.config.secretKey,
            response: req.body._recaptcha
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }

    }).then(( json ) => {
        if ( json.success ) {
            next();

        } else {
            res.status( 200 ).json({
                success: false,
                problem: "ReCAPTCHA did not validate"
            });
        }
    });
};



const postFormMessage = ( req, res ) => {
    validator.validateRequest( req, res ).then(() => {
        // Send an email to Kelly
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: authorization.config.emailUser,
                pass: authorization.config.emailPass
            }
        });

        // Normalize email properties
        const to = authorization.config.emailUser;
        const from = req.body._form.email.value;
        const sender = req.body._form.email.value;
        const replyTo = req.body._form.email.value;
        const subject = `WordsUp Website ${req.body._action} Form`;
        const text = `
Name:
${req.body._form.name.value}

Email:
${req.body._form.email.value}

Message:
${req.body._form.message.value}

Click "Reply" to respond to ${req.body._form.email.value}
        `;

        transporter.sendMail({
            from,
            to,
            sender,
            replyTo,
            subject,
            text

        }, ( error, info ) => {
            // lager.data( info );
            // console.log( error );
            // console.log( info );

            if ( !error ) {
                res.status( 200 ).json({
                    success: true
                });

            } else {
                res.status( 200 ).json({
                    success: false,
                    problem: "Nodemailer could not send email"
                });
            }
        });

    }).catch(() => {
        res.status( 200 ).json({
            success: false,
            problem: "Form fields did not validate"
        });
    });
};



const postFormOptin = ( req, res ) => {
    validator.validateRequest( req, res ).then(() => {
        // Opt-in Mailchimp subscriber
        mailchimp.optin( req.body._form.email.value ).then(( json ) => {
            lager.cache( "Mailchimp optin success" );
            lager.data( json );

        }).catch(( error ) => {
            lager.error( "Mailchimp optin failure" );
            lager.data( error );
        });

        res.status( 200 ).json({
            success: true
        });

    }).catch(() => {
        res.status( 200 ).json({
            success: false,
            problem: "Form fields did not validate"
        });
    });
}



module.exports = {
    init ( expressApp, checkCSRF ) {
        expressApp.post( "/api/recaptcha/contact", checkCSRF, checkRecaptcha, postFormMessage );
        expressApp.post( "/api/recaptcha/coaching", checkCSRF, checkRecaptcha, postFormMessage );
        expressApp.post( "/api/recaptcha/special-offer", checkCSRF, checkRecaptcha, postFormOptin );
    },


    auth ( req, res ) {
        res.status( 200 ).json({
            authorized: fs.existsSync( authorization.store )
        });
    }
};
