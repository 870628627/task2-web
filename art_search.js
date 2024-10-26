document.addEventListener("DOMContentLoaded", function() {
    // 获取页面上的搜索表单、输入框和结果显示区域
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
        const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=3`; // API URL，搜索关键词并限制返回3个结果

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

            const artworkElement = document.createElement('div'); // 创建元素容器
            artworkElement.classList.add('artwork'); // 为元素添加样式类

            // 检查 image_id 是否存在，并生成对应图像的URL
            let imageUrl;
            if (artwork.image_id) {
                imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/1000,/0/default.jpg`; // 请求1000px宽度的图像
            } else if (artwork.thumbnail && artwork.thumbnail.lqip) {
                // 如果没有 image_id，但有缩略图（低质量），则使用缩略图URL
                imageUrl = artwork.thumbnail.lqip;
            } else {
                // 如果没有图像ID和缩略图，则使用一个较大尺寸的占位符图像
                imageUrl = 'https://via.placeholder.com/1000x1000.png?text=No+Image+Available';
            }

            // 检查缩略图尺寸，如果宽度和高度都小于200则跳过
            if (artwork.thumbnail && artwork.thumbnail.width < 200 && artwork.thumbnail.height < 200) {
                console.log("Skipping small image for artwork:", artwork.title); // 调试输出跳过的作品信息
                return; // 跳过该作品，不添加到页面中
            }

            console.log("Image URL:", imageUrl); // 输出图像URL，便于调试

            // 生成HTML结构，将图像、标题和艺术家信息插入到容器中
            artworkElement.innerHTML = `
                <img src="${imageUrl}" alt="${artwork.title}">
                <h2>${artwork.title}</h2>
                <p>${artwork.artist_title ? artwork.artist_title : 'Unknown Artist'}</p>
            `;

            resultsDiv.appendChild(artworkElement); // 将艺术品元素添加到页面结果容器中
        });
    }
});

