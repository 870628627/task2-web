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

            // 仅使用大图（1000px 宽度），不使用缩略图
            let imageUrl;
            if (artwork.image_id) {
                imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/1000,/0/default.jpg`;
            } else {
                // 使用较大尺寸的占位符图像
                imageUrl = 'https://via.placeholder.com/1000x1000.png?text=No+Image+Available';
            }

            console.log("Image URL:", imageUrl); // 输出图像 URL，便于调试

            // 目前使用 artist_title 字段，但在控制台检查 artist 信息所在的实际字段
            const artistName = artwork.artist_title ? artwork.artist_title : 'Unknown Artist';
            console.log("Artist Name (pre-check):", artistName); // 输出当前使用的 artist_title 值

            // 检查 artist_title 字段，如果不存在则设置为 'Unknown Artist'
            const artistName = artwork.artist_title ? artwork.artist_title : 'Unknown Artist';
            console.log("Artist Name:", artistName); // 输出艺术家名称，便于调试

            artworkElement.innerHTML = `
                <img src="${imageUrl}" alt="${artwork.title}">
                <h2>${artwork.title}</h2>
                <p>${artistName}</p>
            `;

            resultsDiv.appendChild(artworkElement);
        });
    }
});

