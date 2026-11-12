export default {
  fetch(request) {
    const target = new URL(request.url);
    target.protocol = "https:";
    target.hostname = "gritspace.cc";
    target.port = "";
    return new Response(null, {
      status: 301,
      headers: {
        Location: target.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
