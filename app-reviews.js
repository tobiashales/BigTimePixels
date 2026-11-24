(() => {
  const getJSON = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('App Store data unavailable');
    return response.json();
  };
  document.querySelectorAll('.app-reviews').forEach(async (section) => {
    const id = section.dataset.appId;
    const content = section.querySelector('.reviews-content');
    const ratingSlot = section.closest('.product-section').querySelector('.app-rating');
    const feedRequest = Promise.allSettled([
      getJSON(`https://itunes.apple.com/us/rss/customerreviews/id=${id}/sortBy=mostRecent/json`)
    ]);
    const showRating = (rating, count, fallback = false) => {
      ratingSlot.replaceChildren();
      const summary = document.createElement('div');
      summary.className = 'rating-summary';
      const score = document.createElement('strong');
      score.textContent = rating.toFixed(1);
      const detail = document.createElement('div');
      const stars = document.createElement('span');
      stars.className = 'rating-stars';
      stars.textContent = '★★★★★';
      stars.style.setProperty('--rating-percent', `${Math.max(0, Math.min(100, rating / 5 * 100))}%`);
      stars.setAttribute('aria-label', `${rating.toFixed(1)} out of 5 stars`);
      const total = document.createElement('span');
      total.className = 'rating-count';
      total.textContent = `${count.toLocaleString('en-US')} ${count === 1 ? 'rating' : 'ratings'}${fallback ? ' · Nov 2026' : ''}`;
      detail.append(stars, total);
      summary.append(score, detail);
      ratingSlot.append(summary);
    };
    if (id === '6471034059') showRating(4.40909, 22, true);
    const [lookup] = await Promise.allSettled([
      getJSON(`https://itunes.apple.com/lookup?id=${id}&country=us`)
    ]);
    const app = lookup.status === 'fulfilled' ? lookup.value.results?.[0] : null;
    const rating = Number(app?.averageUserRating);
    const count = Number(app?.userRatingCount);
    if (Number.isFinite(rating) && Number.isFinite(count) && count > 0) {
      showRating(rating, count);
    }
    const [feed] = await feedRequest;
    const entries = feed.status === 'fulfilled' ? feed.value.feed?.entry : [];
    const reviews = (Array.isArray(entries) ? entries : entries ? [entries] : [])
      .filter(entry => Number(entry['im:rating']?.label) === 5 && entry.title?.label && entry.content?.label)
      .slice(0, 2);
    if (reviews.length) {
      const cards = document.createElement('div');
      cards.className = 'review-cards';
      cards.tabIndex = 0;
      cards.setAttribute('aria-label', 'Scroll through App Store reviews');
      reviews.forEach(review => {
        const card = document.createElement('article');
        card.className = 'review-card';
        const top = document.createElement('div');
        top.className = 'review-card-top';
        const stars = document.createElement('span');
        const reviewRating = Math.max(0, Math.min(5, Number(review['im:rating'].label)));
        stars.className = 'review-stars';
        stars.textContent = '★'.repeat(reviewRating) + '☆'.repeat(5 - reviewRating);
        stars.setAttribute('aria-label', `${reviewRating} out of 5 stars`);
        const author = document.createElement('span');
        author.className = 'review-author';
        author.textContent = review.author?.name?.label || 'App Store reviewer';
        top.append(stars, author);
        const title = document.createElement('h4');
        title.textContent = review.title.label;
        const body = document.createElement('p');
        body.textContent = review.content.label;
        card.append(top, title, body);
        cards.append(card);
      });
      content.append(cards);
    }
    if (!content.hasChildNodes()) content.hidden = true;
  });
})();
