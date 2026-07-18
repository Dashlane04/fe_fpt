document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const suggestionsBox = document.getElementById('suggestions-box');
    const errorMessage = document.getElementById('error-message');
    const loading = document.getElementById('loading');
    const resultsSection = document.getElementById('results-section');
    const resultsGrid = document.getElementById('results-grid');
    const articleSection = document.getElementById('article-section');
    const backBtn = document.getElementById('back-btn');
    
    // Article DOM Elements
    const articleTitle = document.getElementById('article-title');
    const articleImage = document.getElementById('article-image');
    const articleText = document.getElementById('article-text');
    const articleLink = document.getElementById('article-link');

    // State
    let debounceTimer;

    // Event Listeners
    searchInput.addEventListener('input', handleInput);
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
            suggestionsBox.classList.add('hidden');
        }
    });
    backBtn.addEventListener('click', showResultsList);
    
    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.add('hidden');
        }
    });

    // Functions
    function handleInput(e) {
        const query = e.target.value.trim();
        
        clearTimeout(debounceTimer);
        errorMessage.classList.add('hidden');
        
        if (query.length < 3) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchSuggestions(query);
        }, 500);
    }

    async function fetchSuggestions(query) {
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=pageimages|extracts&exintro&explaintext&exlimit=max&format=json&origin=*`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (data.query && data.query.pages) {
                const pages = Object.values(data.query.pages);
                showSuggestions(pages);
            } else {
                suggestionsBox.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            suggestionsBox.classList.add('hidden');
        }
    }

    function showSuggestions(pages) {
        suggestionsBox.innerHTML = '';
        
        pages.forEach(page => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            
            const extract = page.extract ? page.extract.substring(0, 80) + '...' : 'No description available.';
            
            item.innerHTML = `
                <div class="suggestion-title">${page.title}</div>
                <div class="suggestion-extract">${extract}</div>
            `;
            
            item.addEventListener('click', () => {
                searchInput.value = page.title;
                suggestionsBox.classList.add('hidden');
                performSearch(page.title);
            });
            
            suggestionsBox.appendChild(item);
        });
        
        suggestionsBox.classList.remove('hidden');
    }

    async function performSearch(query) {
        query = query.trim();
        suggestionsBox.classList.add('hidden');
        
        if (query.length < 3) {
            showError('Please enter at least 3 characters to search.');
            return;
        }

        showLoading();
        hideError();
        showResultsSection();

        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=20&prop=pageimages|extracts&exintro&explaintext&exlimit=max&format=json&origin=*`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (data.query && data.query.pages) {
                const pages = Object.values(data.query.pages);
                displayResults(pages);
            } else {
                displayNoResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            showError('An error occurred while fetching results. Please try again later.');
            hideLoading();
        }
    }

    function displayResults(pages) {
        resultsGrid.innerHTML = '';
        
        pages.forEach(page => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            let imgHTML = '<div class="card-img-container"><span class="card-no-img">No Image</span></div>';
            if (page.thumbnail && page.thumbnail.source) {
                imgHTML = `
                    <div class="card-img-container">
                        <img src="${page.thumbnail.source}" alt="${page.title}" class="card-img">
                    </div>
                `;
            }
            
            const extract = page.extract ? page.extract.substring(0, 120) + '...' : 'No description available.';
            
            card.innerHTML = `
                ${imgHTML}
                <div class="card-content">
                    <h3 class="card-title">${page.title}</h3>
                    <p class="card-extract">${extract}</p>
                </div>
            `;
            
            card.addEventListener('click', () => fetchArticle(page.title));
            
            resultsGrid.appendChild(card);
        });
        
        hideLoading();
    }

    function displayNoResults() {
        resultsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">No results found for your search.</div>';
        hideLoading();
    }

    async function fetchArticle(title) {
        showLoading();
        
        try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|pageimages|info&pithumbsize=400&inprop=url&redirects=&format=json&origin=*`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (data.query && data.query.pages) {
                const pages = Object.values(data.query.pages);
                if (pages.length > 0) {
                    displayArticle(pages[0]);
                }
            }
        } catch (error) {
            console.error('Article fetch error:', error);
            showError('An error occurred while fetching the article. Please try again later.');
            hideLoading();
        }
    }

    function displayArticle(page) {
        articleTitle.textContent = page.title;
        
        if (page.thumbnail && page.thumbnail.source) {
            articleImage.src = page.thumbnail.source;
            articleImage.classList.remove('hidden');
        } else {
            articleImage.classList.add('hidden');
        }
        
        articleText.innerHTML = page.extract ? page.extract.replace(/\n/g, '<br><br>') : 'No content available.';
        
        if (page.fullurl) {
            articleLink.href = page.fullurl;
            articleLink.classList.remove('hidden');
        } else {
            articleLink.classList.add('hidden');
        }
        
        hideLoading();
        showArticleSection();
    }

    // UI Helpers
    function showLoading() {
        loading.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        articleSection.classList.add('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    function showResultsSection() {
        resultsSection.classList.remove('hidden');
        articleSection.classList.add('hidden');
    }

    function showArticleSection() {
        resultsSection.classList.add('hidden');
        articleSection.classList.remove('hidden');
    }

    function showResultsList() {
        articleSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
    }
});
