//Thumbnail feature added.
document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById('searchForm');
    const searchQueryInput = document.getElementById('searchQuery');
    const resultsDiv = document.getElementById('results');
    const publicDomainCheckbox = document.getElementById('publicDomainCheckbox'); // Get Checkbox

    // Listen for the submit event of the search form
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Preventing the default submission behavior of a form
        const query = searchQueryInput.value.trim(); // Get and remove extra spaces from input content
        const isPublicDomainOnly = publicDomainCheckbox.checked; //Check the checkbox state
        if (query) {
            searchArtworks(query, isPublicDomainOnly); // Call the search function and pass in the checkbox state
        }
    });

    // API Request
    function searchArtworks(query, isPublicDomainOnly) {
        // API URL，Limit the results to 3
        let apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(query)}&limit=3`;

        // Checkbox corresponding filter parameters
        if (isPublicDomainOnly) {
            apiUrl = `https://api.artic.edu/api/v1/artworks/search?query[term][is_public_domain]=true&q=${encodeURIComponent(query)}&limit=3`;
        }

        // Making an API request
        fetch(apiUrl)
            .then(response => response.json()) 
            .then(data => {
                console.log("Fetched data:", data); // Debug output API returns complete data
                displayResults(data.data); // Call function to display search results
            })
            .catch(error => {
                console.error('Error fetching data:', error); // Output error message when request error occurs
                resultsDiv.innerHTML = '<p>There was an error fetching the data.</p>'; // Display error message
            });
    }

    // Show search results
    function displayResults(artworks) {
        resultsDiv.innerHTML = ''; // Clear last search results
        if (artworks.length === 0) {
            resultsDiv.innerHTML = '<p>No results found.</p>'; // No result tips
            return;
        }

        // Iterate
        artworks.forEach(artwork => {
            console.log("Artwork Data:", artwork); 

            const artworkElement = document.createElement('div'); // Create a container element
            artworkElement.classList.add('artwork'); // Add style classes to element

            // Use thumbnails (if available) as temporary placeholders
            let tempImageUrl = artwork.thumbnail && artwork.thumbnail.lqip
                ? artwork.thumbnail.lqip
                : 'https://via.placeholder.com/843x843.png?text=Loading...';

            // Create an initial placeholder to display on the page
            artworkElement.innerHTML = `
                <img src="${tempImageUrl}" alt="${artwork.title}" id="artwork-image">
                <h2>${artwork.title}</h2>
                <p>Loading artist info...</p>
            `;
            resultsDiv.appendChild(artworkElement);

            // Request detailed information for each artwork
            fetchArtworkDetails(artwork.id, artworkElement);
        });
    }

    // Get detailed information about each work
    function fetchArtworkDetails(artworkId, artworkElement) {
        const detailUrl = `https://api.artic.edu/api/v1/artworks/${artworkId}`;

        fetch(detailUrl)
            .then(response => response.json())
            .then(detailData => {
                console.log("Artwork Detail Data:", detailData); // Detail Dat

                const artwork = detailData.data;
                // Constructing the large image URL
                const imageUrl = `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`;
                // Get artist information
                const artistName = artwork.artist_display ? artwork.artist_display : 'Unknown Artist';

                // Update the content of artworkElement. If the full image fails to load, fall back to the thumbnail.
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

