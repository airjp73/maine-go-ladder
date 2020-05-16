const performFetch: typeof fetch = async (...args) => {
  const response = await fetch(...args);
  if (!response.ok) throw new Error("Failed to fetch");
  return response;
};

export default performFetch;
