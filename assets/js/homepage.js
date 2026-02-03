/* ========================================
   HOMEPAGE DEEDPRI
   Archivo: homepage.js
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  console.log('🏠 Homepage cargada');
  
  inicializarOfertas();
  inicializarTop10();
  inicializarBuscador();
  inicializarCategorias();
});

// === OFERTAS DEL DÍA ===
function inicializarOfertas() {
  console.log('🔥 Inicializando ofertas...');
  
  if (typeof negociosDB === 'undefined') {
    console.error('❌ negociosDB no encontrado');
    return;
  }
  
  // Filtrar ofertas activas
  const ofertas = negociosDB.filter(n => n.oferta && n.oferta.activa === true);
  
  if (ofertas.length === 0) {
    console.warn('⚠️ No hay ofertas activas');
    return;
  }
  
  // Buscar oferta destacada o usar la primera
  const destacada = ofertas.find(o => o.oferta.destacada) || ofertas[0];
  const secundarias = ofertas.filter(o => o.id !== destacada.id).slice(0, 4);
  
  // Mostrar en el DOM
  const contenedor = document.querySelector('.ofertas-carrusel');
  if (!contenedor) return;
  
  contenedor.innerHTML = '';
  
  // Oferta principal (grande)
  contenedor.innerHTML += crearOfertaHTML(destacada, true);
  
  // Ofertas secundarias
  secundarias.forEach(oferta => {
    contenedor.innerHTML += crearOfertaHTML(oferta, false);
  });
  
  // Event listeners
  document.querySelectorAll('.oferta-card').forEach(card => {
    card.addEventListener('click', function() {
      const id = this.dataset.id;
      window.location.href = `perfil.html?id=${id}`;
    });
  });
  
  console.log(`✅ ${ofertas.length} ofertas mostradas`);
}

function crearOfertaHTML(negocio, esDestacada) {
  const clase = esDestacada ? 'oferta-card principal' : 'oferta-card';
  const { oferta } = negocio;
  
  return `
    <div class="${clase}" data-id="${negocio.id}">
      <img src="${negocio.foto}" alt="${negocio.nombre}" class="oferta-img">
      <div class="oferta-overlay">
        <span class="oferta-badge">${oferta.badge}</span>
        <h3 class="oferta-title">${oferta.titulo || negocio.nombre}</h3>
        ${esDestacada && oferta.descripcion ? `<p style="color:#ccc;">${oferta.descripcion}</p>` : ''}
      </div>
    </div>
  `;
}

// === TOP 10 ===
function inicializarTop10() {
  console.log('⭐ Inicializando Top 10...');
  
  if (typeof negociosDB === 'undefined') {
    console.error('❌ negociosDB no encontrado');
    return;
  }
  
  // Por ahora: ordenar por rating
  const top10 = negociosDB
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);
  
  const contenedor = document.querySelector('.top10-grid');
  if (!contenedor) return;
  
  contenedor.innerHTML = '';
  
  top10.forEach((negocio, index) => {
    contenedor.innerHTML += crearTop10HTML(negocio, index + 1);
  });
  
  // Event listeners
  document.querySelectorAll('.top10-card').forEach(card => {
    card.addEventListener('click', function() {
      const id = this.dataset.id;
      window.location.href = `perfil.html?id=${id}`;
    });
  });
  
  console.log(`✅ Top 10 mostrado`);
}

function crearTop10HTML(negocio, posicion) {
  return `
    <div class="top10-card" data-id="${negocio.id}">
      <span class="top10-number">${posicion}</span>
      <img src="${negocio.foto}" alt="${negocio.nombre}" class="top10-img">
      <div class="top10-info">
        <div class="top10-name">${negocio.nombre}</div>
        <div class="top10-rating">⭐ ${negocio.rating || 0} (${negocio.reviews || 0})</div>
      </div>
    </div>
  `;
}

// === BUSCADOR ===
function inicializarBuscador() {
  console.log('🔍 Inicializando buscador...');
  
  const searchInput = document.getElementById('searchInput');
  const locationSelect = document.getElementById('locationSelect');
  const voiceBtn = document.getElementById('voiceBtn');
  
  if (!searchInput) {
    console.error('❌ Input de búsqueda no encontrado');
    return;
  }
  
  // Enter para buscar
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      realizarBusqueda();
    }
  });
  
  // Cambio de ubicación
  if (locationSelect) {
    locationSelect.addEventListener('change', function() {
      console.log('📍 Ubicación:', this.value);
    });
  }
  
  // Búsqueda por voz
  if (voiceBtn) {
    voiceBtn.addEventListener('click', activarBusquedaPorVoz);
  }
  
  console.log('✅ Buscador listo');
}

function realizarBusqueda() {
  const searchInput = document.getElementById('searchInput');
  const locationSelect = document.getElementById('locationSelect');
  
  const query = searchInput.value.trim();
  const loc = locationSelect ? locationSelect.value : 'zacualtipan';
  
  if (!query) {
    alert('Escribe qué buscas');
    return;
  }
  
  console.log('🔍 Buscar:', query, 'en', loc);
  window.location.href = `resultados.html?q=${encodeURIComponent(query)}&loc=${loc}`;
}

function activarBusquedaPorVoz() {
  console.log('🎤 Activando voz...');
  
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Tu navegador no soporta búsqueda por voz');
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'es-MX';
  recognition.continuous = false;
  
  const voiceBtn = document.getElementById('voiceBtn');
  
  recognition.onstart = () => {
    console.log('🎤 Escuchando...');
    if (voiceBtn) voiceBtn.style.color = '#ff6b6b';
  };
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('🎤 Detectado:', transcript);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = transcript;
    }
    
    setTimeout(() => realizarBusqueda(), 500);
  };
  
  recognition.onerror = (event) => {
    console.error('❌ Error de voz:', event.error);
    if (voiceBtn) voiceBtn.style.color = '';
  };
  
  recognition.onend = () => {
    if (voiceBtn) voiceBtn.style.color = '';
  };
  
  recognition.start();
}

// === CATEGORÍAS ===
function inicializarCategorias() {
  console.log('📂 Inicializando categorías...');
  
  const cards = document.querySelectorAll('.categoria-card');
  
  cards.forEach(card => {
    card.addEventListener('click', function() {
      const cat = this.dataset.categoria || this.textContent.trim().toLowerCase();
      navegarCategoria(cat);
    });
  });
  
  console.log(`✅ ${cards.length} categorías listas`);
}

function navegarCategoria(categoria) {
  console.log('📂 Categoría:', categoria);
  
  const locationSelect = document.getElementById('locationSelect');
  const loc = locationSelect ? locationSelect.value : 'zacualtipan';
  
  window.location.href = `resultados.html?cat=${categoria}&loc=${loc}`;
}

console.log('✅ homepage.js cargado');
