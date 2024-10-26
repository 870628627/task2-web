document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById('searchForm');
    const searchQueryInput = document.getElementById('searchQuery');
    const resultsDiv = document.getElementById('results');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = searchQueryInput.value.trim();
        if (query) {
            searchArtworks(query);
        }
    });

    function searchArtworks(query) {
        const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=3`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data); // 调试输出
                displayResults(data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                resultsDiv.innerHTML = '<p>There was an error fetching the data.</p>';
            });
    }

    function displayResults(artworks) {
        resultsDiv.innerHTML = '';
        if (artworks.length === 0) {
            resultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        artworks.forEach(artwork => {
            console.log("Artwork Data:", artwork); // 输出完整的 artwork 对象，便于调试

            const artworkElement = document.createElement('div');
            artworkElement.classList.add('artwork');

            // 使用更大尺寸的图像请求（1200px 宽度）
            let imageUrl;
            if (artwork.image_id) {
                imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/1200,/0/default.jpg`;
            } else if (artwork.thumbnail && artwork.thumbnail.lqip) {
                // 使用缩略图作为备选图像
                imageUrl = artwork.thumbnail.lqip;
            } else {
                // 使用较大尺寸的占位符图像
                imageUrl = 'https://via.placeholder.com/1200x1200.png?text=No+Image+Available';
            }

            console.log("Image URL:", imageUrl); // 输出图像 URL，便于调试

            artworkElement.innerHTML = `
                <img src="${imageUrl}" alt="${artwork.title}">
                <h2>${artwork.title}</h2>
                <p>${artwork.artist_title ? artwork.artist_title : 'Unknown Artist'}</p>
            `;

            resultsDiv.appendChild(artworkElement);
        });
    }
});

