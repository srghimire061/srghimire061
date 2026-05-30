async function loadMediumPosts() {
    const container = document.getElementById("blog-container");

    // ---------- helpers ----------
    const escapeHtml = (str = "") =>
        String(str).replace(/[&<>"']/g, m => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[m]));

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const renderPosts = (posts) => {
        let html = "";

        posts.slice(0, 9).forEach(post => {
            const title = escapeHtml(post.title || "Untitled");
            const date = post.date ? formatDate(post.date) : "";
            const image = post.image || "assets/images/blog/default.jpg";
            const link = post.link || "#";

            html += `
                <div class="col-lg-4 col-md-8 col-sm-9">
                    <div class="single-blog mt-30">
                        <div class="blog-image">
                            <img 
                                src="${image}" 
                                alt="${title}"
                                loading="lazy"
                                onerror="this.src='assets/images/blog/default.jpg'"
                            >
                        </div>
                        <div class="blog-content">
                            <h4 class="blog-title">
                                <a href="${link}" target="_blank" rel="noopener noreferrer">
                                    ${title}
                                </a>
                            </h4>
                            <span>${date}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || "<p>No posts found.</p>";
    };

    // ---------- main flow ----------
    try {
        container.innerHTML = "<p>Loading posts...</p>";

        // optional cache (fast load on revisit)
        const cached = localStorage.getItem("medium_posts");
        if (cached) {
            const parsed = JSON.parse(cached);
            renderPosts(parsed);
            return;
        }

        const response = await fetch("data/posts.json");

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        let posts = await response.json();

        if (!Array.isArray(posts)) {
            throw new Error("Invalid posts format");
        }

        // sort newest first
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // cache for next load
        localStorage.setItem("medium_posts", JSON.stringify(posts));

        renderPosts(posts);

    } catch (error) {
        console.error("Error loading Medium posts:", error);
        container.innerHTML = "<p>Failed to load posts.</p>";
    }
}

// run on page load
document.addEventListener("DOMContentLoaded", loadMediumPosts);