document.addEventListener("DOMContentLoaded", () => {
    const userSelect = document.getElementById("userSelect");
    const galleryContainer = document.getElementById("galleryContainer");

    // Fetch all users
    fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.id;
                option.textContent = user.name;
                userSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching users:", error));

    // Handle user selection change
    userSelect.addEventListener("change", (e) => {
        const userId = e.target.value;
        galleryContainer.innerHTML = "<p class='text-center'>Loading...</p>";

        fetch(`https://jsonplaceholder.typicode.com/users/${userId}/albums`)
            .then(response => response.json())
            .then(albums => {
                galleryContainer.innerHTML = ""; // Clear loading text
                
                const albumPromises = albums.map(album => {
                    const albumSection = document.createElement("div");
                    albumSection.className = "album-section";
                    
                    const albumTitle = document.createElement("h4");
                    albumTitle.textContent = `Album ${album.id}: ${album.title}`;
                    albumSection.appendChild(albumTitle);

                    const photoRow = document.createElement("div");
                    photoRow.className = "row";
                    albumSection.appendChild(photoRow);
                    
                    galleryContainer.appendChild(albumSection);

                    return fetch(`https://jsonplaceholder.typicode.com/albums/${album.id}/photos`)
                        .then(response => response.json())
                        .then(photos => {
                            photos.forEach(photo => {
                                const col = document.createElement("div");
                                col.className = "col-md-2 photo-card";
                                // Using thumbnailUrl for a better grid view, similar to expected output
                                col.innerHTML = `
                                    <div class="card h-100">
                                        <img src="${photo.thumbnailUrl}" class="card-img-top" alt="${photo.title}">
                                        <div class="card-body p-2">
                                            <p class="card-text small mb-0"><strong>Photo ${photo.id}</strong></p>
                                            <p class="card-text small text-truncate" title="${photo.title}">${photo.title}</p>
                                        </div>
                                    </div>
                                `;
                                photoRow.appendChild(col);
                            });
                        });
                });

                return Promise.all(albumPromises);
            })
            .catch(error => {
                galleryContainer.innerHTML = "<p class='text-danger text-center'>Error loading data.</p>";
                console.error("Error fetching albums/photos:", error);
            });
    });
});
