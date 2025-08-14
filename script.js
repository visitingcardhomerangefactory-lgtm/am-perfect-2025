window.onload = function() {
    // Get necessary HTML elements
    const canvas = document.getElementById('photoCanvas');
    const ctx = canvas.getContext('2d');
    const photoInput = document.getElementById('photoInput');
    const nameInput = document.getElementById('nameInput');
    const placeInput = document.getElementById('placeInput');
    const downloadButton = document.getElementById('downloadButton');

    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 800;

    let frameImage = new Image();
    let userPhoto = null;
    let currentFrameUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjoY4AvfD4C4YO791K1LBWAJ1ayXiOgLcVLOmlyjpcGrVviRJLOcDzbsH0py-MBsdD2lChVoVSgULcFIKFhrWPw1fbr88LeifUNbAiyLSB_hwzAnxkq6GQmE6Zax0t9gO9_IzdL8rfrs-oABif2RPoD1Hn6MRmVxmfCK09Jpq3ZBSHBWMCAmZjx5xXXd4/s1200/NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN.png';
    
    // Adjusting the size of the Blogger image link
    currentFrameUrl = currentFrameUrl.replace('/s320/', '/s1200/');

    frameImage.src = currentFrameUrl;
    
    // Draw the canvas after the frame image is loaded
    frameImage.onload = function() {
        drawCanvas();
    };

    // Display an error message if the frame fails to load
    frameImage.onerror = function() {
        console.error("Failed to load the frame image.");
        // alert("Failed to load the frame image. Please try again later.");
        ctx.fillStyle = '#f0f4f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Failed to load frame.', canvas.width / 2, canvas.height / 2);
    };

    // Main function to draw everything on the canvas
    function drawCanvas() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the canvas background
        ctx.fillStyle = '#f0f4f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the user's photo if it exists
        if (userPhoto) {
            // Calculate the size and position of the photo
            const photoSize = Math.min(userPhoto.width, userPhoto.height);
            const sourceX = (userPhoto.width - photoSize) / 2;
            const sourceY = (userPhoto.height - photoSize) / 2;
            const destX = 140; // x-coordinate to draw the photo
            const destY = 140; // y-coordinate to draw the photo
            const destSize = 520; // size of the photo (to fit inside the circle)
            
            // Clip the photo within a circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 260, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(userPhoto, sourceX, sourceY, photoSize, photoSize, destX, destY, destSize, destSize);
            ctx.restore();
        } else {
            // Show a placeholder if no photo is uploaded
            ctx.fillStyle = '#cccccc';
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 260, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#666666';
            ctx.font = '24px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Upload Your Photo', canvas.width / 2, canvas.height / 2);
        }

        // Draw the frame image, which should always be on top
        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

        // Draw the box for name and place
        const nameText = nameInput.value;
        const placeText = placeInput.value;
        
        if (nameText || placeText) {
            const nameFontSize = 36;
            const placeFontSize = 24;
            const padding = 10;
            const margin = 10;
            
            // Calculate the width of the name and place
            ctx.font = `bold ${nameFontSize}px Inter`;
            const nameWidth = ctx.measureText(nameText).width;
            
            ctx.font = `${placeFontSize}px Inter`;
            const placeWidth = ctx.measureText(placeText).width;
            
            // Calculate the total width and height of the box
            const boxWidth = Math.max(nameWidth, placeWidth) + padding * 2;
            const boxHeight = nameFontSize + placeFontSize + padding * 2 + margin;
            
            const boxX = (canvas.width - boxWidth) / 2;
            const boxY = canvas.height - 100 - (nameFontSize + placeFontSize + padding + margin) / 2;
            
            // Draw the box
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
            
            // Write the name and place inside the box
            ctx.fillStyle = '#000000';
            ctx.font = `bold ${nameFontSize}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillText(nameText, canvas.width / 2, boxY + nameFontSize + padding);
            
            ctx.fillStyle = '#444444';
            ctx.font = `${placeFontSize}px Inter`;
            ctx.fillText(placeText, canvas.width / 2, boxY + nameFontSize + placeFontSize + padding + margin);
        }
    }

    // Event listener for the photo input
    photoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                userPhoto = new Image();
                userPhoto.onload = function() {
                    drawCanvas();
                };
                userPhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listeners for name and place inputs
    nameInput.addEventListener('input', drawCanvas);
    placeInput.addEventListener('input', drawCanvas);

    // Event listener for the download button
    downloadButton.addEventListener('click', function() {
        // Download the canvas as an image
        const link = document.createElement('a');
        link.download = 'Independence_Day_Photo.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
};