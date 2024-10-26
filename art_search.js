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
            console.log("Artwork Data:", artwork); // 输出完整的 artwork 对象，便于检查艺术家字段

            const artworkElement = document.createElement('div');
            artworkElement.classList.add('artwork');

            // 检查 image_id 是否存在，并生成对应图像URL
            let imageUrl;
            if (artwork.image_id) {
                imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
            } else if (artwork.thumbnail && artwork.thumbnail.lqip) {
                // 如果没有 image_id，但有缩略图（低质量图像），则使用缩略图URL
                imageUrl = artwork.thumbnail.lqip;
            } else {
                // 如果没有图像ID和缩略图，则使用占位符图像
                imageUrl = 'https://via.placeholder.com/843x843.png?text=No+Image+Available';
            }

            console.log("Image URL:", imageUrl); // 输出图像URL，便于调试

            // 确定艺术家名称，如果没有找到，则显示 'Unknown Artist'
            const artistName = artwork.artist_display ? artwork.artist_display : ' Artist';

            // 将图像、标题和艺术家名称插入到HTML结构中
            artworkElement.innerHTML = `
                <img src="${imageUrl}" alt="${artwork.title}">
                <h2>${artwork.title}</h2>
                <p>${artistName}</p>
            `;

            resultsDiv.appendChild(artworkElement);
        });
    }
});

