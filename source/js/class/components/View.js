import * as core from "../../core";

/**
 *
 * @public
 * @global
 * @class View
 * @param {object} args The settings for the view
 * @classdesc Handle shared view functionality.
 *
 * @todo: Use ./core/cache for data and try that first
 *
 */
class View {
  constructor(elem, data) {
    this.data = data;
    this.element = elem;
    this.id = this.data.uid;
    this.endpoint = this.data.url;
    this.json = null;
    this.controllers = {};
    this.method = "GET";

    this.init();
  }

  /**
   *
   * @instance
   * @description Run the View initialization stack
   * @memberof View
   * @method init
   *
   */
  init() {
    this.load().then(this.done.bind(this));
  }

  done(json) {
    this.json = json;

    this.render();
    this.exec();
  }

  /**
   *
   * @instance
   * @description Get the data for the view
   * @memberof View
   * @method load
   * @returns {Promise}
   *
   */
  load() {
    return new Promise((resolve) => {
      const cache = core.cache.get(this.id);

      // Pre-render from cache
      if (cache) {
        this.done(cache);
      }

      // Update render from JSON
      fetch(this.endpoint, {
        method: this.method,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          // Update the cache from AJAX
          core.cache.set(this.id, json);

          resolve(json);
        });
    });
  }

  /**
   *
   * @instance
   * @description Render the view template
   * @memberof View
   * @method render
   *
   */
  render() {
    // Webpack es6Module { __esModule: true, default: f }
    const view = require(`../../views/${this.id}`);

    this.element[0].innerHTML = view.default(this);
  }

  /**
   *
   * @instance
   * @description Initialize controllers
   * @memberof View
   * @method exec
   *
   */
  exec() {}

  /**
   *
   * @instance
   * @description Stop the animation frame
   * @memberof View
   * @method destroy
   *
   */
  destroy() {}
}

/******************************************************************************
 * Export
 *******************************************************************************/
export default View;
