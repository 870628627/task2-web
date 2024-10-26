document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript Loaded"); // 检查 JavaScript 文件是否加载成功

    const searchForm = document.getElementById('searchForm');
    const searchQueryInput = document.getElementById('searchQuery');
    const resultsDiv = document.getElementById('results');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Search Form Submitted"); // 检查表单是否提交

        const query = searchQueryInput.value.trim();
        console.log("Search Query:", query); // 检查搜索关键词是否正确获取

        if (query) {
            searchArtworks(query);
        }
    });
    
    function searchArtworks(query) {
        const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=3`;
        console.log("API URL:", apiUrl); // 检查生成的 API URL 是否正确

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched data:", data); // 检查返回的数据
                displayResults(data.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                resultsDiv.innerHTML = '<p>There was an error fetching the data.</p>';
            });
    }

    function displayResults(artworks) {
        console.log("Displaying results"); // 检查是否进入显示结果的函数
        resultsDiv.innerHTML = '';
        if (artworks.length === 0) {
            resultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

        artworks.forEach(artwork => {
            console.log("Artwork Data:", artwork); // 输出 artwork 对象

            const artworkElement = document.createElement('div');
            artworkElement.classList.add('artwork');

            let imageUrl;
            if (artwork.image_id) {
                imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/800,/0/default.jpg`;
            } else {
                imageUrl = 'https://via.placeholder.com/800x800.png?text=No+Image+Available';
            }

            console.log("Image URL:", imageUrl); // 输出图像 URL

            artworkElement.innerHTML = `
                <img src="${imageUrl}" alt="${artwork.title}">
                <h2>${artwork.title}</h2>
                <p>${artwork.artist_title ? artwork.artist_title : 'Unknown Artist'}</p>
            `;

            resultsDiv.appendChild(artworkElement);
        });
    }
});

