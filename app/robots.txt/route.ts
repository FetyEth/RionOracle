export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://rion.xyz/sitemap.xml

# Block staging environments
User-agent: *
Disallow: /staging/
Disallow: /test/
Disallow: /api/internal/`

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
