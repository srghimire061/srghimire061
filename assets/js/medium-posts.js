async function loadMediumPosts() {
    try {
        const response = await fetch("data/posts.json");
        const posts = await response.json();

        const container = document.getElementById("blog-container");
        container.innerHTML = "";

        posts.forEach(post => {

            const date = new Date(post.date).toDateString();

            const image = post.image 
                ? post.image 
                : "assets/images/blog/default.jpg";

            const card = `
                <div class="col-lg-4 col-md-8 col-sm-9">
                    <div class="single-blog mt-30">
                        <div class="blog-image">
                            <img src="${image}" alt="Blog">
                        </div>
                        <div class="blog-content">
                            <h4 class="blog-title">
                                <a href="${post.link}" target="_blank">
                                    ${post.title}
                                </a>
                            </h4>
                            <span>${date}</span>
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML += card;
        });

    } catch (error) {
        console.error("Error loading Medium posts:", error);
    }
}

// run on page load
document.addEventListener("DOMContentLoaded", loadMediumPosts);