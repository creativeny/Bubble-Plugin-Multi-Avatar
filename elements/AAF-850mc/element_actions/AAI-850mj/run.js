function(instance, properties, context) {
    // Generate a random avatar ID if none is provided
    const avatarId = properties.avatar_id || Math.random().toString(36).substring(2, 15);
    
    // Ensure the `multiavatar` function is available
    if (typeof multiavatar === "undefined") {
        console.error("Multiavatar library is not loaded");
        return;
    }
    
    // Generate the avatar SVG using the multiavatar function
    const svgCode = multiavatar(avatarId);
    
    // Create a temporary container for the SVG
    const container = document.createElement('div');
    container.innerHTML = svgCode;
    const svg = container.querySelector('svg');
    
    // Set dimensions
    const width = properties.width || 100;
    const height = properties.height || 100;
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    
    // Create a Blob from the SVG
    const svgBlob = new Blob([container.innerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    // Create an Image object
    const img = new Image();
    img.onload = function() {
        // Create a canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        
        // Publish the image data URL to a state
        instance.publishState('avatar_image', imageDataUrl);
        
        // Clean up
        URL.revokeObjectURL(url);
    };
    
    // Set the image source to the SVG Blob URL
    img.src = url;
}