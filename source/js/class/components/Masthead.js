import * as core from "../../core";
import ResizeController from "properjs-resizecontroller";
import navi from "../../modules/navi";

class Masthead {
  constructor(element, data) {
    this.data = data;
    this.element = element;
    this.oh = this.element.find(".js-masthead-oh");
    this.ya = this.element.find(".js-masthead-ya");
    this.ohya = core.dom.main.find(".js-ohya");
    this.resizer = new ResizeController();

    this.bind();
    this.onResize();
  }

  bind() {
    this.resizer.on("resize", this.onResize.bind(this));
  }

  onResize() {
    const naviMainBounds = navi.main[0].getBoundingClientRect();

    // As in Zero
    if (!naviMainBounds.width) {
      if (this.ya.length) {
        this.ya[0].style.width = `100%`;
      }

      if (this.oh.length) {
        this.oh[0].style.width = `100%`;
      }

      if (this.ohya.length) {
        this.ohya[0].style.width = `100%`;
      }
    } else {
      if (this.ya.length) {
        this.ya[0].style.width = `${naviMainBounds.width}px`;
      }

      if (this.oh.length) {
        this.oh[0].style.width = `calc( 100% - ${naviMainBounds.width}px )`;
      }

      if (this.ohya.length) {
        this.ohya[0].style.width = `${naviMainBounds.width}px`;
      }
    }
  }

  destroy() {
    this.resizer.stop();
  }
}

/******************************************************************************
 * Export
 *******************************************************************************/
export default Masthead;
