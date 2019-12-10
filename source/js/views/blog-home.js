import dom from "prismic-dom";



export default ( view ) => {
    return view.json.docs.slice( 0, 3 ).map(( doc ) => {
        return `<div class="blog__post">
            <a class="blog__wrap js-blog-link -bg--${doc.data.color.replace( /\s/g, "-" ).toLowerCase()}" href="/blog/${doc.uid}/">
                <div class="blog__title h3">${dom.RichText.asText( doc.data.title )}</div>
                <div class="blog__arrow">
                    <svg class="svg svg--arrow-right">
                        <polygon points="22.3,0 21.5,0.7 26.5,6 0,6 0,7 26.5,7 21.5,13 22.3,13.6 28.3,6.4"/>
                    </svg>
                </div>
            </a>
        </div>`;

    }).join( "" );
};
