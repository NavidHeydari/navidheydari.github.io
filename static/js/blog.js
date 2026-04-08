// Blog listing: search + tag filter
(function () {
    const searchInput = document.getElementById('searchInput');
    const tagButtons = document.querySelectorAll('.tag-filter');
    const cards = document.querySelectorAll('.post-card');
    const noResults = document.getElementById('noResults');

    let activeTag = 'all';

    function filterPosts() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        let visible = 0;

        cards.forEach(function (card) {
            const title = card.dataset.title || '';
            const excerpt = card.dataset.excerpt || '';
            const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];

            const matchesSearch = !query || title.includes(query) || excerpt.includes(query);
            const matchesTag = activeTag === 'all' || tags.includes(activeTag);

            if (matchesSearch && matchesTag) {
                card.style.display = '';
                visible++;
            } else {
                card.style.display = 'none';
            }
        });

        if (noResults) {
            noResults.style.display = visible === 0 ? '' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterPosts);
    }

    tagButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            tagButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeTag = btn.dataset.tag;
            filterPosts();
        });
    });

    // Animate cards on load
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(function (card) { observer.observe(card); });
}());
