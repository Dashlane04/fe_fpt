document.addEventListener("DOMContentLoaded", async () => {
    const userSelect = document.getElementById("userSelect");
    const galleryContainer = document.getElementById("galleryContainer");

    // Fetch all users
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await response.json();
        
        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.name;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }

    // Handle user selection change
    userSelect.addEventListener("change", async (e) => {
        const userId = e.target.value;
        galleryContainer.innerHTML = "<p class='text-center'>Loading...</p>";

        try {
            const albumsResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/albums`);
            const albums = await albumsResponse.json();
            
            galleryContainer.innerHTML = ""; // Clear loading text
            
            // Map albums to promises to fetch photos concurrently
            const albumPromises = albums.map(async (album) => {
                const albumSection = document.createElement("div");
                albumSection.className = "album-section";
                
                const albumTitle = document.createElement("h5");
                albumTitle.className = "mb-3 fw-bold";
                albumTitle.textContent = `Album ${album.id}: ${album.title}`;
                albumSection.appendChild(albumTitle);

                const photoRow = document.createElement("div");
                photoRow.className = "row";
                albumSection.appendChild(photoRow);
                
                galleryContainer.appendChild(albumSection);

                const photosResponse = await fetch(`https://jsonplaceholder.typicode.com/albums/${album.id}/photos`);
                const photos = await photosResponse.json();
                
                photos.forEach(photo => {
                    const col = document.createElement("div");
                    col.className = "col-md-2 photo-card";
                    col.innerHTML = `
                        <div>
                            <img src="${photo.url}" class="img-fluid mb-2" alt="${photo.title}">
                            <p class="small mb-1"><strong>Photo ${photo.id}</strong></p>
                            <p class="small text-muted" style="line-height: 1.2;">${photo.title}</p>
                        </div>
                    `;
                    photoRow.appendChild(col);
                });
            });

            await Promise.all(albumPromises);
        } catch (error) {
            galleryContainer.innerHTML = "<p class='text-danger text-center'>Error loading data.</p>";
            console.error("Error fetching albums/photos:", error);
        }
    });
});
