export async function GET() {
  const script = `
(function() {
  const scripts = document.querySelectorAll('script[src*="embed.js"]');
  
  scripts.forEach(script => {
    const feed = script.getAttribute('data-feed') || 'BNB/USD';
    const theme = script.getAttribute('data-theme') || 'dark';
    
    const widget = document.createElement('div');
    widget.className = 'rion-widget';
    widget.innerHTML = \`
      <div style="
        font-family: system-ui, sans-serif;
        background: \${theme === 'dark' ? '#0a0a0a' : '#fff'};
        color: \${theme === 'dark' ? '#fff' : '#000'};
        border: 1px solid \${theme === 'dark' ? '#333' : '#ddd'};
        border-radius: 8px;
        padding: 16px;
        max-width: 300px;
      ">
        <div style="font-size: 14px; color: #888; margin-bottom: 8px;">\${feed}</div>
        <div style="font-size: 32px; font-weight: bold; color: #10b981; margin-bottom: 8px;">$612.34</div>
        <div style="font-size: 12px; color: #888; margin-bottom: 12px;">p95: 1.6s · Updated 2s ago</div>
        <a href="https://rion.xyz/lab" target="_blank" style="
          display: inline-block;
          background: #10b981;
          color: #000;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        ">Verify</a>
      </div>
    \`;
    
    script.parentNode.insertBefore(widget, script.nextSibling);
  });
})();
  `

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
