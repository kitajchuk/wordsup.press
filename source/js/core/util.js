/**
 *
 * @public
 * @namespace util
 * @memberof core
 * @description Houses app-wide utility methods.
 *
 */
import detect from "./detect";


/**
 *
 * @description Apply a translate3d transform
 * @method translate3d
 * @param {object} el The element to transform
 * @param {string|number} x The x value
 * @param {string|number} y The y value
 * @param {string|number} z The z value
 * @memberof core.util
 *
 */
const translate3d = function ( el, x, y, z ) {
    el.style[ detect.getPrefixed( "transform" ) ] = `translate3d( ${x}, ${y}, ${z} )`;
};


/**
 *
 * @description Module isElementVisible method, handles element boundaries
 * @method isElementVisible
 * @param {object} el The DOMElement to check the offsets of
 * @memberof core.util
 * @returns {boolean}
 *
 */
const isElementVisible = function ( el ) {
    let ret = false;

    if ( el ) {
        const bounds = el.getBoundingClientRect();

        ret = ( bounds.top < window.innerHeight && bounds.bottom > 0 );
    }

    return ret;
};


/**
 *
 * @description All true all the time
 * @method noop
 * @memberof core.util
 * @returns {boolean}
 *
 */
const noop = function () {
    return true;
};



/******************************************************************************
 * Export
*******************************************************************************/
export {
    noop,
    translate3d,
    isElementVisible,
};
