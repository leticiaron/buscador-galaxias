// Seleccionar elementos
let inputBuscar = document.getElementById("inputBuscar");
let contenedor = document.getElementById("contenedor");
let debounceTimer = null; // Temporizador debounce

// Evento 'input' para realizar la búsqueda en tiempo real
inputBuscar.addEventListener("input", () => {
  let query = inputBuscar.value.trim().toLowerCase();

  /*Limpiar cualquier temporizador anterior:
   Si el usuario sigue escribiendo, evita que la búsqueda se ejecute antes de que el usuario termine de escribir.*/
  clearTimeout(debounceTimer);

  /* Configurar el debounce para retrasar la búsqueda:
     Si el usuario sigue escribiendo antes de que pasen esos 200 ms, este temporizador se reiniciará, de nuevo cancelando la búsqueda anterior*/
  debounceTimer = setTimeout(() => {
    if (query) {
      searchImg(query);
    } else {
      // Si el campo está vacío, limpiar los resultados
      contenedor.innerHTML =
        "<p>Por favor, ingrese un término de búsqueda.</p>";
    }
  }, 200); // Retraso de 200ms antes de hacer la búsqueda
});

// Función para buscar imágenes en la API
function searchImg(query) {
  let url = `https://images-api.nasa.gov/search?q=${query}`;

  // Solicitud a la API
  fetch(url)
    .then((response) => response.json())
    .then((data) => showResults(data.collection.items))
    .catch((error) => console.error("Error al buscar imágenes:", error));
}

// Función para mostrar los resultados en la página
function showResults(images) {
  // Limpiar el contenedor
  contenedor.innerHTML = "";

  if (images.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  // Iterar sobre las imágenes y mostrar cada una en una tarjeta
  images.forEach((item) => {
    // Extraer información relevante
    let { title, description, date_created } = item.data[0];
    let imgUrl = item.links ? item.links[0].href : "placeholder.jpg"; // Imagen por defecto si no hay

    // Crear tarjeta con Bootstrap
    const card = `
            <div class="col-lg-4 col-md-6 mb-4"> <!-- Tarjetas de 4 columnas en pantallas grandes, 6 en medianas -->
        <div class="card h-100">
          <img src="${imgUrl}" class="card-img-top" alt="${title}">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${
              description || "Sin descripción disponible"
            }</p>
            <p class="card-text"><small class="text-muted">Fecha: ${new Date(
              date_created
            ).toLocaleDateString()}</small></p>
          </div>
        </div>
      </div>
    `;

    // Insertar la tarjeta en el contenedor
    contenedor.innerHTML += card;
  });
}
