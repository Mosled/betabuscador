/* ========================================
   PERFIL PREMIUM - PINTEREST STYLE
   JavaScript para cards dinámicas
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Perfil Premium (Pinterest Style) cargado');
  
  // Obtener ID del negocio desde URL
  const urlParams = new URLSearchParams(window.location.search);
  const negocioId = parseInt(urlParams.get('id'));
  
  if (!negocioId) {
    console.error('❌ No se proporcionó ID de negocio');
    window.location.href = 'index.html';
    return;
  }
  
  // Buscar negocio
  const negocio = negociosDB.find(n => n.id === negocioId);
  
  if (!negocio) {
    console.error('❌ Negocio no encontrado');
    alert('Negocio no encontrado');
    window.location.href = 'index.html';
    return;
  }
  
  // Verificar que sea premium
  if (negocio.plan !== 'premium' && negocio.plan !== 'premium-plus') {
    console.log('⚠️ Este negocio no es premium, redirigiendo a perfil básico');
    window.location.href = `perfil.html?id=${negocioId}`;
    return;
  }
  
  console.log('✅ Negocio premium encontrado:', negocio.nombre);
  
  // Cargar información
  cargarHeader(negocio);
  actualizarOpenGraph(negocio);
  cargarCards(negocio);
  inicializarModal();
});

/**
 * Cargar header del perfil
 */
function cargarHeader(negocio) {
  // Título de la página
  document.getElementById('page-title').textContent = `${negocio.nombre} - deedpri Premium`;
  
  // Foto de perfil
  const profilePic = document.getElementById('profile-pic');
  if (negocio.foto) {
    profilePic.style.backgroundImage = `url('${negocio.foto}')`;
  }
  
  // Nombre
  document.getElementById('negocio-nombre').textContent = negocio.nombre;
  
  // Rating
  const ratingEl = document.getElementById('rating');
  if (negocio.rating && negocio.reviews) {
    const stars = generarEstrellas(negocio.rating);
    ratingEl.innerHTML = `${stars} ${negocio.rating} (${negocio.reviews})`;
  } else {
    ratingEl.textContent = 'Sin reseñas';
  }
  
  // Categoría
  document.getElementById('category').textContent = `${negocio.subcategoria || negocio.categoria} • ${negocio.municipio}`;
  
  // Badges
  const badgesContainer = document.getElementById('badges-container');
  let badgesHTML = '';
  
  if (negocio.plan === 'premium-plus') {
    badgesHTML += '<span class="badge premium">👑 PREMIUM PLUS</span>';
  } else if (negocio.plan === 'premium') {
    badgesHTML += '<span class="badge premium">⭐ PREMIUM</span>';
  }
  
  if (negocio.verificado) {
    badgesHTML += '<span class="badge verificado"><i class="fas fa-check-circle"></i> Verificado</span>';
  }
  
  badgesContainer.innerHTML = badgesHTML;
}

/**
 * Generar estrellas para rating
 */
function generarEstrellas(rating) {
  let html = '';
  const estrellas = Math.round(rating);
  
  for (let i = 1; i <= 5; i++) {
    if (i <= estrellas) {
      html += '<i class="fas fa-star"></i>';
    } else {
      html += '<i class="far fa-star"></i>';
    }
  }
  
  return html;
}

/**
 * Cargar cards según tipo de negocio
 */
function cargarCards(negocio) {
  const container = document.getElementById('cards-container');
  const cards = generarCardsSegunCategoria(negocio);
  
  let html = '';
  cards.forEach(card => {
    html += crearCardHTML(card, negocio);
  });
  
  container.innerHTML = html;
  
  // Agregar event listeners
  document.querySelectorAll('.card').forEach(cardEl => {
    cardEl.addEventListener('click', function() {
      const cardType = this.dataset.type;
      const cardAction = this.dataset.action;
      
      if (cardAction === 'modal') {
        abrirModal(cardType, negocio);
      } else if (cardAction === 'link') {
        const url = this.dataset.url;
        window.open(url, '_blank');
      } else if (cardAction === 'compartir') {
        abrirModalCompartir(negocio);
      }
    });
  });
}

/**
 * Generar cards según categoría del negocio
 */
function generarCardsSegunCategoria(negocio) {
  const categoria = negocio.categoria.toLowerCase();
  
  // Cards base que todos tienen
  const cardsBase = [
    {
      type: 'compartir',
      title: 'Compartir Perfil',
      desc: 'QR, redes sociales y más',
      icon: '🔗',
      gradient: 'gradient-purple',
      size: 'small',
      badge: '✨ NUEVO',
      action: 'compartir'
    },
    {
      type: 'whatsapp',
      title: 'WhatsApp',
      desc: 'Respuesta rápida garantizada',
      icon: '💬',
      gradient: 'gradient-green',
      size: 'small',
      action: 'link',
      url: negocio.whatsapp ? `https://wa.me/52${negocio.whatsapp}?text=${encodeURIComponent('Hola ' + negocio.nombre + ', encontré tu negocio en deedpri')}` : null
    },
    {
      type: 'llamar',
      title: 'Llamar Ahora',
      desc: negocio.telefono || 'Teléfono no disponible',
      icon: '📞',
      gradient: 'gradient-blue',
      size: 'small',
      action: 'link',
      url: negocio.telefono ? `tel:${negocio.telefono}` : null
    },
    {
      type: 'ubicacion',
      title: 'Cómo Llegar',
      desc: 'Mapa + video con indicaciones',
      icon: '📍',
      gradient: 'gradient-orange',
      size: 'medium',
      badge: '🎥 VIDEO',
      action: 'modal'
    },
    {
      type: 'horario',
      title: 'Horarios',
      desc: negocio.horario || 'Consulta horarios',
      icon: '🕐',
      gradient: 'gradient-purple',
      size: 'small',
      action: 'modal'
    }
  ];
  
  // Cards específicas por categoría
  let cardsEspecificas = [];
  
  if (categoria === 'alimentos') {
    // RESTAURANTES, CAFÉS, PIZZERÍAS
    cardsEspecificas = [
      {
        type: 'menu',
        title: 'Menú Digital',
        desc: 'Platillos, precios y especialidades del día',
        icon: '📋',
        gradient: 'gradient-yellow',
        size: 'tall',
        badge: '⚡ NUEVO',
        action: 'modal'
      },
      {
        type: 'galeria',
        title: 'Galería de Fotos',
        desc: 'Nuestros platillos e instalaciones',
        icon: '📸',
        gradient: 'gradient-pink',
        size: 'tall',
        action: 'modal'
      }
    ];
    
    if (negocio.cupon || (negocio.oferta && negocio.oferta.activa)) {
      cardsEspecificas.unshift({
        type: 'ofertas',
        title: 'Ofertas HOY',
        desc: negocio.cupon || negocio.oferta?.descripcion || '¡Promociones especiales!',
        icon: '🎟️',
        gradient: 'gradient-yellow',
        size: 'medium',
        badge: '¡HOY!',
        action: 'modal'
      });
    }
  } else if (categoria === 'servicios') {
    // PLOMEROS, ELECTRICISTAS, MECÁNICOS
    cardsEspecificas = [
      {
        type: 'servicios',
        title: 'Nuestros Servicios',
        desc: 'Todo lo que hacemos',
        icon: '🛠️',
        gradient: 'gradient-blue',
        size: 'tall',
        action: 'modal'
      },
      {
        type: 'precios',
        title: 'Precios Aproximados',
        desc: 'Cotizaciones sin sorpresas',
        icon: '💰',
        gradient: 'gradient-green',
        size: 'medium',
        action: 'modal'
      },
      {
        type: 'galeria',
        title: 'Trabajos Recientes',
        desc: 'Antes y después',
        icon: '📸',
        gradient: 'gradient-purple',
        size: 'medium',
        action: 'modal'
      }
    ];
  } else if (categoria === 'salud') {
    // DOCTORES, DENTISTAS
    cardsEspecificas = [
      {
        type: 'agendar',
        title: 'Agendar Cita',
        desc: 'Reserva tu consulta',
        icon: '📅',
        gradient: 'gradient-blue',
        size: 'tall',
        badge: 'RÁPIDO',
        action: 'modal'
      },
      {
        type: 'servicios',
        title: 'Tratamientos',
        desc: 'Especialidades y servicios',
        icon: '🩺',
        gradient: 'gradient-green',
        size: 'medium',
        action: 'modal'
      },
      {
        type: 'galeria',
        title: 'Instalaciones',
        desc: 'Conoce nuestro consultorio',
        icon: '🏥',
        gradient: 'gradient-purple',
        size: 'medium',
        action: 'modal'
      }
    ];
  } else {
    // CATEGORÍA GENÉRICA
    cardsEspecificas = [
      {
        type: 'info',
        title: 'Acerca de',
        desc: negocio.descripcion || 'Conoce más sobre nosotros',
        icon: 'ℹ️',
        gradient: 'gradient-blue',
        size: 'tall',
        action: 'modal'
      },
      {
        type: 'galeria',
        title: 'Galería',
        desc: 'Nuestros productos y servicios',
        icon: '📸',
        gradient: 'gradient-purple',
        size: 'medium',
        action: 'modal'
      }
    ];
  }
  
  // Combinar cards: específicas primero, luego base
  return [...cardsEspecificas, ...cardsBase];
}

/**
 * Crear HTML de una card
 */
function crearCardHTML(card, negocio) {
  if (!card.url && card.action === 'link') {
    return ''; // No crear card si no tiene URL y necesita link
  }
  
  const badge = card.badge ? `<div class="card-badge">${card.badge}</div>` : '';
  
  return `
    <div class="card" data-type="${card.type}" data-action="${card.action}" data-url="${card.url || ''}">
      <div class="card-visual ${card.size} ${card.gradient}">
        <div class="card-icon">${card.icon}</div>
        ${badge}
      </div>
      <div class="card-content">
        <h3 class="card-title">${card.title}</h3>
        <p class="card-desc">${card.desc}</p>
      </div>
    </div>
  `;
}

/**
 * Abrir modal con contenido
 */
function abrirModal(tipo, negocio) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  let contenido = '';
  
  switch(tipo) {
    case 'menu':
      contenido = `
        <h2>📋 Menú Digital</h2>
        <p>Aquí irá el menú completo del negocio.</p>
        <p><strong>Nota:</strong> Esta funcionalidad se desarrollará con el sistema de administración.</p>
        <p>Por ahora, <a href="tel:${negocio.telefono}">llama al ${negocio.telefono}</a> para consultar el menú.</p>
      `;
      break;
    
    case 'ubicacion':
      contenido = `
        <h2>📍 Cómo Llegar</h2>
        <p><strong>Dirección:</strong> ${negocio.direccion}</p>
        <p><strong>Nota:</strong> Aquí se mostrará un video de cómo llegar desde puntos clave.</p>
        <br>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(negocio.direccion + ', ' + negocio.municipio)}" 
           target="_blank" 
           style="display: inline-block; padding: 1rem 2rem; background: #ea4335; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Abrir en Google Maps
        </a>
      `;
      break;
    
    case 'galeria':
      let galeriaHTML = '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">';
      if (negocio.galeria && negocio.galeria.length > 0) {
        negocio.galeria.forEach(foto => {
          galeriaHTML += `<img src="${foto}" alt="${negocio.nombre}" style="width: 100%; border-radius: 8px;">`;
        });
      } else {
        galeriaHTML += '<p>Galería próximamente</p>';
      }
      galeriaHTML += '</div>';
      
      contenido = `
        <h2>📸 Galería</h2>
        ${galeriaHTML}
      `;
      break;
    
    case 'ofertas':
      contenido = `
        <h2>🎟️ Ofertas Especiales</h2>
        <div style="background: #fff9e6; padding: 2rem; border-radius: 12px; border: 2px solid #ffd300; margin: 1rem 0;">
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">
            ${negocio.oferta?.titulo || negocio.cupon}
          </h3>
          <p style="font-size: 1.1rem; line-height: 1.6;">
            ${negocio.oferta?.descripcion || negocio.cupon}
          </p>
        </div>
        <p>¡Menciona que viste esta oferta en deedpri!</p>
      `;
      break;
    
    case 'horario':
      contenido = `
        <h2>🕐 Horarios de Atención</h2>
        <p style="font-size: 1.1rem; line-height: 1.8;">${negocio.horario}</p>
        <br>
        <p><strong>Última actualización:</strong> Hoy</p>
      `;
      break;
    
    case 'servicios':
      contenido = `
        <h2>🛠️ Nuestros Servicios</h2>
        <p>${negocio.descripcion}</p>
        <br>
        <p><strong>Nota:</strong> Lista detallada de servicios disponible próximamente.</p>
      `;
      break;
    
    case 'precios':
      contenido = `
        <h2>💰 Precios Aproximados</h2>
        <p>Cotizaciones sin sorpresas. Todos nuestros precios son transparentes.</p>
        <br>
        <p><strong>Nota:</strong> Lista de precios disponible próximamente.</p>
        <p>Por ahora, <a href="https://wa.me/52${negocio.whatsapp}" target="_blank">contáctanos por WhatsApp</a> para cotizaciones.</p>
      `;
      break;
    
    case 'agendar':
      contenido = `
        <h2>📅 Agendar Cita</h2>
        <p>Reserva tu consulta de forma rápida y sencilla.</p>
        <br>
        <p><strong>Nota:</strong> Sistema de citas en línea próximamente.</p>
        <p>Por ahora, <a href="tel:${negocio.telefono}">llama al ${negocio.telefono}</a> para agendar.</p>
      `;
      break;
    
    default:
      contenido = `
        <h2>${negocio.nombre}</h2>
        <p>${negocio.descripcion}</p>
      `;
  }
  
  modalBody.innerHTML = contenido;
  modal.classList.add('active');
}

/**
 * Inicializar modal
 */
function inicializarModal() {
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  
  // Cerrar con botón
  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  // Cerrar con overlay
  modalOverlay.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

/**
 * Actualizar Open Graph tags para previews en redes sociales
 */
function actualizarOpenGraph(negocio) {
  const urlBase = window.location.origin;
  // Para GitHub Pages, usar .html en carpeta /perfil/
  const urlPerfil = negocio.slug 
    ? `${urlBase}/perfil/${negocio.slug}.html` 
    : `${urlBase}/perfil-premium.html?id=${negocio.id}`;
  
  const titulo = `${negocio.nombre} - deedpri`;
  const descripcion = negocio.descripcion || `${negocio.subcategoria || negocio.categoria} en ${negocio.municipio}`;
  const imagen = negocio.foto || '';
  
  // Open Graph
  document.getElementById('og-url').content = urlPerfil;
  document.getElementById('og-title').content = titulo;
  document.getElementById('og-description').content = descripcion;
  document.getElementById('og-image').content = imagen;
  
  // Twitter
  document.getElementById('twitter-url').content = urlPerfil;
  document.getElementById('twitter-title').content = titulo;
  document.getElementById('twitter-description').content = descripcion;
  document.getElementById('twitter-image').content = imagen;
}

/**
 * Obtener URL para compartir (optimizado para GitHub Pages)
 */
function obtenerUrlCompartir(negocio) {
  const urlBase = window.location.origin;
  
  // Para GitHub Pages, usar .html al final en carpeta /perfil/
  if (negocio.slug) {
    return `${urlBase}/perfil/${negocio.slug}.html`;
  }
  // Fallback: URL con ID
  return `${urlBase}/perfil/${negocio.id}.html`;
}

/**
 * Generar URL de QR Code
 */
function generarQR(url, tamanio = 400) {
  // Usar API pública de QR Code
  return `https://api.qrserver.com/v1/create-qr-code/?size=${tamanio}x${tamanio}&data=${encodeURIComponent(url)}`;
}

/**
 * Abrir modal de compartir
 */
function abrirModalCompartir(negocio) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  
  const urlCompartir = obtenerUrlCompartir(negocio);
  const urlQR = generarQR(urlCompartir, 400);
  const textoCompartir = `¡Conoce ${negocio.nombre} en deedpri!`;
  
  // URLs para compartir en redes
  const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(textoCompartir + ' ' + urlCompartir)}`;
  const urlFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlCompartir)}`;
  const urlTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textoCompartir)}&url=${encodeURIComponent(urlCompartir)}`;
  
  const contenido = `
    <h2>🔗 Compartir Perfil</h2>
    <p style="margin-bottom: 2rem; color: #666;">Comparte tu perfil en redes sociales</p>
    
    <!-- URL para copiar -->
    <div style="background: #f5f5f5; padding: 1rem; border-radius: 12px; margin-bottom: 2rem;">
      <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">Tu enlace:</p>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <input type="text" 
               value="${urlCompartir}" 
               id="url-compartir" 
               readonly
               style="flex: 1; padding: 0.8rem; border: 2px solid #ddd; border-radius: 8px; font-size: 0.95rem;">
        <button onclick="copiarUrl()" 
                style="padding: 0.8rem 1.5rem; background: #ffd300; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
          <i class="fas fa-copy"></i> Copiar
        </button>
      </div>
      <p id="copiado-msg" style="color: #2e7d32; font-size: 0.85rem; margin-top: 0.5rem; display: none;">
        ✅ ¡Copiado al portapapeles!
      </p>
    </div>
    
    <!-- Botones de redes sociales -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
      <a href="${urlWhatsApp}" 
         target="_blank"
         style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: #25D366; color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">
        <i class="fab fa-whatsapp" style="font-size: 1.5rem;"></i>
        WhatsApp
      </a>
      
      <a href="${urlFacebook}" 
         target="_blank"
         style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: #1877f2; color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">
        <i class="fab fa-facebook" style="font-size: 1.5rem;"></i>
        Facebook
      </a>
      
      <a href="${urlTwitter}" 
         target="_blank"
         style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem; background: #1da1f2; color: white; text-decoration: none; border-radius: 12px; font-weight: 600;">
        <i class="fab fa-twitter" style="font-size: 1.5rem;"></i>
        Twitter
      </a>
    </div>
    
    <!-- QR Code -->
    <div style="text-align: center; padding: 2rem; background: #f9f9f9; border-radius: 16px;">
      <h3 style="margin-bottom: 1rem; font-size: 1.1rem;">📱 Código QR</h3>
      <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
        Descarga este código QR para ponerlo en tu local o imprimir
      </p>
      <img src="${urlQR}" 
           alt="QR Code" 
           style="max-width: 300px; width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 1rem;">
      <br>
      <a href="${urlQR}" 
         download="qr-${negocio.slug || negocio.id}.png"
         style="display: inline-block; padding: 1rem 2rem; background: #2a2a2a; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 1rem;">
        <i class="fas fa-download"></i> Descargar QR
      </a>
    </div>
  `;
  
  modalBody.innerHTML = contenido;
  modal.classList.add('active');
}

/**
 * Copiar URL al portapapeles
 */
function copiarUrl() {
  const input = document.getElementById('url-compartir');
  input.select();
  input.setSelectionRange(0, 99999); // Para móviles
  
  navigator.clipboard.writeText(input.value).then(() => {
    const msg = document.getElementById('copiado-msg');
    msg.style.display = 'block';
    
    setTimeout(() => {
      msg.style.display = 'none';
    }, 3000);
  }).catch(err => {
    console.error('Error al copiar:', err);
    alert('URL copiada: ' + input.value);
  });
}

// Hacer funciones globales para que funcionen desde HTML inline
window.copiarUrl = copiarUrl;
window.abrirModalCompartir = abrirModalCompartir;

console.log('✅ perfil-premium.js cargado');
