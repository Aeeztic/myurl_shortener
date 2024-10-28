async function shortenURL() {
    const originalUrl = document.getElementById("url").value;
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`);

    if (response.ok) {
        const shortenedUrl = await response.text();

        await fetch('http://localhost:3000/shorten-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl, shortenedUrl })
        });

        document.getElementById('result').innerHTML = `
        Shortened URL: <a href="${shortenedUrl}" target="_blank" onclick="handleClick(event, '${shortenedUrl}')">${shortenedUrl}</a>
         <span id="click-count-${shortenedUrl}" style="margin-left: 10px;">Clicks: 0</span>
        `;

    } else {
        document.getElementById('result').innerHTML = "Error shortening URL";
    }
}
async function trackClick(shortenedUrl) {
    const response = await fetch('http://localhost:3000/track-click', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: shortenedUrl }),
    });

    if (response.ok) {
        const data = await response.json();
        const clickCountElement = document.getElementById(`click-count-${shortenedUrl}`);
        clickCountElement.innerText = `Clicks: ${data.clicks}`; 
    }
}
async function handleClick(event, shortenedUrl) {
    
    event.preventDefault();
    
    
    await trackClick(shortenedUrl);
    
    
    window.open(shortenedUrl, '_blank'); 
}


