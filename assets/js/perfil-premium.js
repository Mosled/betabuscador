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

console.log('✅ perfil-premium.js cargado');
