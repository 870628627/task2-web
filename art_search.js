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
                console.log("Fetched data:", data); // 输出完整的返回数据
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
            console.log("Artwork Data:", artwork); // 输出 artwork 对象的结构以检查 artist 信息

            const artworkElement = document.createElement('div');
            artworkElement.classList.add('artwork');

            // 使用占位符在加载详细数据前显示
            artworkElement.innerHTML = `
                <img src="https://via.placeholder.com/1000x1000.png?text=Loading..." alt="${artwork.title}">
                <h2>${artwork.title}</h2>
                <p>Loading artist info...</p>
            `;
            resultsDiv.appendChild(artworkElement);

            // 请求每个 artwork 的详细信息
            fetchArtworkDetails(artwork.id, artworkElement);
        });
    }

    // 获取单个 artwork 的详细信息，包括艺术家信息
    function fetchArtworkDetails(artworkId, artworkElement) {
        const detailUrl = `https://api.artic.edu/api/v1/artworks/${artworkId}`;

        fetch(detailUrl)
            .then(response => response.json())
            .then(detailData => {
                console.log("Artwork Detail Data:", detailData); // 输出详细数据以检查 artist 信息

                const artwork = detailData.data;
                const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/1000,/0/default.jpg`;
                const artistName = artwork.artist_display ? artwork.artist_display : 'Unknown Artist';

                artworkElement.innerHTML = `
                    <img src="${imageUrl}" alt="${artwork.title}">
                    <h2>${artwork.title}</h2>
                    <p>${artistName}</p>
                `;
            })
            .catch(error => {
                console.error('Error fetching artwork details:', error);
                artworkElement.innerHTML = '<p>There was an error fetching the artist information.</p>';
            });
    }
});

