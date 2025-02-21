import dom from "prismic-dom";
import paramalama from "paramalama";

export default (view) => {
  // Tag list
  const tags = [];

  view.json.docs.forEach((doc) => {
    doc.tags.forEach((tag) => {
      if (tags.indexOf(tag) === -1) {
        tags.push(tag);
      }
    });
  });

  // Blog mechanics
  const pageQuery = paramalama(window.location.search);
  const pageSize = 6;
  const pageActive = Number(pageQuery.page || 1);
  const pageOffset = pageActive - 1;

  // Blog sort order
  const docs = view.json.docs
    .sort((docA, docB) => {
      const dateA = new Date(docA.data.date);
      const dateB = new Date(docB.data.date);

      return dateA.getTime() > dateB.getTime() ? -1 : 1;

      // Blog filter Tag
    })
    .filter((doc) => {
      return pageQuery.tag ? doc.tags.indexOf(pageQuery.tag) !== -1 : true;
    });

  // Blog page offset
  const blogs = docs.slice(pageOffset, pageSize);

  // Pagination
  let page = 1;
  const pageTotal = Math.ceil(docs.length / pageSize);
  const pagination = [];

  while (page <= pageTotal) {
    const pagi = {
      page,
      query: [],
    };

    if (page > 1) {
      pagi.query.push(`page=${page}`);
    }

    if (pageQuery.tag) {
      pagi.query.push(`tag=${pageQuery.tag}`);
    }

    pagination.push(pagi);

    page++;
  }

  return `
        <div class="masthead js-masthead -wrap-2 -exp-2 -bg--cool">
            <div class="masthead__oh">
                <div class="h1">Blog</div>
            </div>
        </div>
        <div class="blog__tags">
            <div class="blog__tags__wrap -wrap-2">
                <div class="m -grey">Tags</div>
                <div class="m -grey">
                    <a href="/blog/" class="blog__tag ${pageQuery.tag ? "" : "is-active"}">All</a>
                </div>
                ${tags
                  .map((tag) => {
                    return `
                        <div class="m -grey">
                            <a href="/blog/?tag=${tag}" class="blog__tag ${pageQuery.tag === tag ? "is-active" : ""}">${tag}</a>
                        </div>
                    `;
                  })
                  .join("")}
            </div>
        </div>
        <div class="blog__posts -wrap-2 -exp-2">
            ${blogs
              .map((doc) => {
                const color = doc.data.color.replace(/\s/g, "-").toLowerCase();

                return `
                    <div class="blog__post">
                        <a class="blog__wrap js-blog-link -bg--${color}" href="/blog/${doc.uid}/">
                            <div class="blog__title h3">${dom.RichText.asText(doc.data.title)}</div>
                            <div class="blog__arrow">
                                <svg class="svg svg--arrow-right">
                                    <polygon points="22.3,0 21.5,0.7 26.5,6 0,6 0,7 26.5,7 21.5,13 22.3,13.6 28.3,6.4"/>
                                </svg>
                            </div>
                        </a>
                    </div>
                `;
              })
              .join("")}
        </div>
        <div class="blog__pagination -wrap-2">
            ${pagination
              .map((paging) => {
                return `
                    <div class="m -grey">
                        <a href="/blog/${paging.query.length ? `?${paging.query.join("&")}` : ""}" class="blog__tag ${paging.page === pageActive ? "is-active" : ""}">${paging.page}</a>
                    </div>
                `;
              })
              .join("")}
        </div>
    `;
};
