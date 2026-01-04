import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export default async (request, context) => {
    const url = new URL(request.url);
    const shareLinkId = url.pathname.split('/c/')[1];

    // If not a share link, pass through
    if (!shareLinkId || url.pathname === '/challenge-simple.html') {
        return context.next();
    }

    try {
        // Fetch challenge data from Supabase using environment variables
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL'),
            Deno.env.get('SUPABASE_ANON_KEY')
        );

        const { data, error } = await supabase.rpc('get_challenge_share', {
            p_share_link_id: shareLinkId
        });

        if (error || !data || data.length === 0) {
            return context.next();
        }

        const challenge = data[0];

        // Fetch the HTML file
        const response = await context.next();
        let html = await response.text();

        // Inject dynamic OG tags
        const ogTitle = `🔥 ${challenge.sharer_name} challenged you in ${challenge.group_language.toLowerCase()}!`;
        const ogDescription = challenge.challenge_content || 'Join me on Language Soup and respond to this challenge!';

        // Optimize image for WhatsApp/Instagram (Square, <300KB)
        // Using 600x600 at 75% quality ensures high res but small file size
        const rawImage = challenge.sharer_avatar || 'https://uspegyneclgkscxwmomn.supabase.co/storage/v1/object/public/avatars/soup-avatars/soup_blue.png';
        const ogImage = `${rawImage}?width=600&height=600&resize=cover&quality=75&format=jpeg`;

        // Replace existing OG tags with comprehensive metadata
        html = html.replace(
            /<meta property="og:title"[^>]*>/,
            `<meta property="og:title" content="${ogTitle}">`
        );
        html = html.replace(
            /<meta property="og:description"[^>]*>/,
            `<meta property="og:description" content="${ogDescription}">`
        );
        html = html.replace(
            /<meta property="og:image"[^>]*>/,
            `<meta property="og:image" content="${ogImage}">\n    <meta property="og:image:type" content="image/jpeg">\n    <meta property="og:image:width" content="600">\n    <meta property="og:image:height" content="600">\n    <meta property="og:type" content="website">\n    <meta property="og:site_name" content="Language Soup">`
        );

        // Also update Twitter Card tags
        html = html.replace(
            /<meta name="twitter:title"[^>]*>/,
            `<meta name="twitter:title" content="${ogTitle}">`
        );
        html = html.replace(
            /<meta name="twitter:description"[^>]*>/,
            `<meta name="twitter:description" content="${ogDescription}">`
        );
        html = html.replace(
            /<meta name="twitter:image"[^>]*>/,
            `<meta name="twitter:image" content="${ogImage}">`
        );

        return new Response(html, {
            headers: {
                'content-type': 'text/html;charset=UTF-8',
            },
        });
    } catch (err) {
        console.error('Edge function error:', err);
        return context.next();
    }
};

export const config = { path: '/c/*' };
