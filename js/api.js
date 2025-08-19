// src/api.js
const API_URL = "https://559ff298-7e7b-4509-b331-0944e0cd188a-00-2d15q06s8eprg.riker.replit.dev";

export async function getRequest(endpoint) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en GET:", error);
    return null;
  }
}

export async function postRequest(endpoint, data) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error en POST:", error);
    return null;
  }
}

export async function getClients() {
  return await getRequest("clients.php");
}

export async function loginUser(username, password) {
  return await postRequest("login.php", { username, password });
}
