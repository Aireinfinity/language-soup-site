// SIMPLIFIED FORM - Uses existing signups table

// Replace form section (line ~962-1000) with:
<form id="joinForm">
    <div class="form-group">
        <label for="name">what's ur name?</label>
        <input type="text" id="name" placeholder="just first name" required>
    </div>

    <div class="form-group">
        <label for="languages">what language(s)?</label>
        <input type="text" id="languages" placeholder="spanish, french, etc" required>
    </div>

    <div class="form-group">
        <label for="device">what device?</label>
        <select id="device" required>
            <option value="">pick one...</option>
            <option value="iOS">iOS (iPhone/iPad)</option>
            <option value="Android">Android</option>
        </select>
    </div>

    <button type="submit" class="join-button">get the app 🍜</button>
</form>

<div id="appInfo" style="display: none; margin-top: 16px; padding: 16px; background: #fef6e4; border-radius: 14px; text-align: center;">
    <p style="margin-bottom: 10px; font-size: 0.9em; color: #2c2c3e; font-weight: 700;">📱 Download the app:</p>
    <p style="margin-bottom: 12px; font-size: 0.85em; color: #2c2c3e;">Support chat goes straight to Noah. I check it daily! 🥣</p>
    <a id="appLink" href="#" target="_blank" class="whatsapp-link">Download Now →</a>
</div>

// Replace JavaScript (line ~1060-1112) with:
document.getElementById('joinForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const languages = document.getElementById('languages').value;
    const device = document.getElementById('device').value;

    const submitButton = e.target.querySelector('.join-button');
    submitButton.textContent = 'submitting...';
    submitButton.disabled = true;

    try {
        const { data, error } = await supabase
            .from('signups')
            .insert([{
                name: name,
                languages: languages,
                device: device,
                source: 'Website App Download',
                submitted_at: new Date().toISOString()
            }]);

        if (error) {
            console.error('Error:', error);
            alert('Oops! Something went wrong. DM us on Instagram @languagesoup');
            submitButton.textContent = 'get the app 🍜';
            submitButton.disabled = false;
            return;
        }

        // Success - show app link
        submitButton.textContent = '✅ success!';

        const appLink = device === 'iOS'
            ? 'https://testflight.apple.com/join/N7UnDFv5'
            : 'https://play.google.com/store/apps/details?id=com.aireinfinity.languagesoup';

        document.getElementById('appLink').href = appLink;
        document.getElementById('appInfo').style.display = 'block';
        document.getElementById('appInfo').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error('Error:', err);
        alert('Something went wrong!');
        submitButton.textContent = 'get the app 🍜';
        submitButton.disabled = false;
    }
});
