export default function sitemap() {
    const baseUrl = 'https://perkasajayamarine.com'; // Change this to your actual domain

    // Define your routes here
    const routes = [
        '',
        '/about',
        '/products/two-strokes',
        '/products/four-strokes',
        '/parts',
        '/yamalube',
        '/news',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
