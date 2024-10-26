document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById('searchForm');
    const searchQueryInput = document.getElementById('searchQuery');
    const resultsDiv = document.getElementById('results');

    // 监听搜索表单的提交事件
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单的默认提交行为
        const query = searchQueryInput.value.trim(); // 获取并去除输入内容的多余空格
        if (query) {
            searchArtworks(query); // 如果输入非空，调用搜索函数
        }
    });

    // 定义搜索函数，通过API请求搜索指定关键词的艺术品
    function searchArtworks(query) {
        // 构建API请求的URL，查询关键词并限制返回3个结果
        const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=3`;

        // 发起API请求
        fetch(apiUrl)
            .then(response => response.json()) // 将响应转换为JSON格式
            .then(data => {
                console.log("Fetched data:", data); // 调试输出API返回的完整数据
                displayResults(data.data); // 调用函数显示搜索结果
            })
            .catch(error => {
                console.error('Error fetching data:', error); // 请求错误时输出错误信息
                resultsDiv.innerHTML = '<p>There was an error fetching the data.</p>'; // 在页面显示错误提示
            });
    }

    // 显示搜索结果
    function displayResults(artworks) {
        resultsDiv.innerHTML = ''; // 清空上一次的搜索结果
        if (artworks.length === 0) {
            resultsDiv.innerHTML = '<p>No results found.</p>'; // 如果没有结果，显示提示
            return;
        }

        // 遍历每个艺术作品
        artworks.forEach(artwork => {
            console.log("Artwork Data:", artwork); // 输出每个艺术作品的数据，便于调试

            const artworkElement = document.createElement('div'); // 创建一个容器元素
            artworkElement.classList.add('artwork'); // 为元素添加样式类

            // 使用缩略图（如果可用）作为临时占位符
            let tempImageUrl = artwork.thumbnail && artwork.thumbnail.lqip
                ? artwork.thumbnail.lqip
                : 'https://via.placeholder.com/843x843.png?text=Loading...';

            // 创建一个初始的占位符显示在页面上
            artworkElement.innerHTML = `
                <img src="${tempImageUrl}" alt="${artwork.title}" id="artwork-image">
                <h2>${artwork.title}</h2>
                <p>Loading artist info...</p>
            `;
            resultsDiv.appendChild(artworkElement);

            // 请求每个 artwork 的详细信息
            fetchArtworkDetails(artwork.id, artworkElement);
        });
    }

    // 获取每个作品的详细信息（包括艺术家信息）
    function fetchArtworkDetails(artworkId, artworkElement) {
        const detailUrl = `https://api.artic.edu/api/v1/artworks/${artworkId}`;

        fetch(detailUrl)
            .then(response => response.json())
            .then(detailData => {
                console.log("Artwork Detail Data:", detailData); // 输出详细数据以检查 artist 信息

                const artwork = detailData.data;
                // 构建大图 URL
                const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
                // 获取艺术家信息（若无显示 Unknown Artist）
                const artistName = artwork.artist_display ? artwork.artist_display : 'Unknown Artist';

                // 更新 artworkElement 的内容，若大图加载失败则回退到缩略图
                artworkElement.innerHTML = `
                    <img src="${imageUrl}" alt="${artwork.title}" onerror="this.onerror=null; this.src='${artwork.thumbnail && artwork.thumbnail.lqip ? artwork.thumbnail.lqip : 'https://via.placeholder.com/843x843.png?text=Image+Not+Available'}';">
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

