// import * as core from "../../core";

class Blog {
  constructor(element, data) {
    this.element = element;
    this.data = data;
    this.tags = this.element.find(".js-tag");
    this.posts = this.element.find(".js-post");

    this.bind();
  }

  bind() {
    this.element.on("click", ".js-tag", (e) => {
      this.tags.removeClass("is-active");
      this.tags
        .filter(`[data-tag="${e.target.dataset.tag}"]`)
        .addClass("is-active");

      this.posts.removeClass("is-hidden");

      if (e.target.dataset.tag !== "All") {
        this.posts
          .not(this.posts.filter(`[data-tag="${e.target.dataset.tag}"]`))
          .addClass("is-hidden");
      }
    });
  }

  destroy() {}
}

/******************************************************************************
 * Export
 *******************************************************************************/
export default Blog;
