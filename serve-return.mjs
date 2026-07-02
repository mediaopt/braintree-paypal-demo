import http from "http";

const PORT = 6007;

const server = http.createServer((req, res) => {
  const url = `http://localhost:${PORT}${req.url}`;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Return</title><script>if(window.self!==window.top){window.top.location.href=window.self.location.href;}</script></head>
<body>
  <div>
    Payment processed. It is your responsibility to build a result or a
    confirm (for authorize flow) page. Commercetools checkout redirected you to:
  </div>
  <p><a href="${url}">${url}</a></p>
  <p><a href="https://localhost:6006" target="_top">← Back to Storybook</a></p>
</body>
</html>`);
});

server.listen(PORT, () => {
  console.log(`Serving on http://localhost:${PORT}`);
});
