/* ========================================
   PERFIL DE NEGOCIO - JAVASCRIPT
   Carga dinámica de información
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 Perfil de negocio cargado');
  
  // Obtener ID del negocio desde URL
  const urlParams = new URLSearchParams(window.location.search);
  const negocioId = parseInt(urlParams.get('id'));
  
  if (!negocioId) {
    console.error('❌ No se proporcionó ID de negocio');
    window.location.href = 'index.html';
    return;
  }
  
  // Buscar negocio en la base de datos
  const negocio = negociosDB.find(n => n.id === negocioId);
  
  if (!negocio) {
    console.error('❌ Negocio no encontrado');
    alert('Negocio no encontrado');
    window.location.href = 'index.html';
    return;
  }
  
  console.log('✅ Negocio encontrado:', negocio.nombre);
  
  // Cargar información
  cargarInformacion(negocio);
  cargarNegociosSimilares(negocio);
  inicializarBotones(negocio);
});

/**
 * Cargar toda la información del negocio
 */
function cargarInformacion(negocio) {
  // Título de la página
  document.getElementById('page-title').textContent = `${negocio.nombre} - deedpri`;
  
  // Hero - Foto
  document.getElementById('negocio-foto').src = negocio.foto;
  document.getElementById('negocio-foto').alt = negocio.nombre;
  
  // Hero - Badge del plan
  const badgePlan = document.getElementById('badge-plan');
  if (negocio.plan === 'premium-plus') {
    badgePlan.textContent = '👑 PREMIUM PLUS';
    badgePlan.style.background = 'linear-gradient(135deg, #ffd300, #ffed4e)';
  } else if (negocio.plan === 'premium') {
    badgePlan.textContent = '⭐ DESTACADO';
  } else {
    badgePlan.style.display = 'none';
  }
  
  // Badge verificado
  if (!negocio.verificado) {
    document.getElementById('badge-verificado').style.display = 'none';
  }
  
  // Hero - Nombre y categoría
  document.getElementById('negocio-nombre').textContent = negocio.nombre;
  document.getElementById('negocio-categoria').textContent = `${negocio.subcategoria || negocio.categoria} • ${negocio.municipio}`;
  
  // Hero - Rating
  if (negocio.rating && negocio.reviews) {
    const starsHTML = generarEstrellas(negocio.rating);
    document.getElementById('stars').innerHTML = starsHTML;
    document.getElementById('rating-text').textContent = `${negocio.rating} (${negocio.reviews} reseñas)`;
  } else {
    document.getElementById('rating-container').style.display = 'none';
  }
  
  // Cupón (si tiene)
  if (negocio.cupon) {
    document.getElementById('cupon-section').style.display = 'block';
    document.getElementById('cupon-texto').textContent = negocio.cupon;
  }
  
  // Descripción
  document.getElementById('negocio-descripcion').textContent = negocio.descripcion || 'Sin descripción disponible.';
  
  // Galería (solo premium/premium-plus)
  if (negocio.galeria && negocio.galeria.length > 0 && negocio.plan !== 'gratis') {
    document.getElementById('galeria-section').style.display = 'block';
    const galeriaHTML = negocio.galeria.map(foto => 
      `<img src="${foto}" alt="${negocio.nombre}">`
    ).join('');
    document.getElementById('galeria-grid').innerHTML = galeriaHTML;
  }
  
  // Horarios
  document.getElementById('negocio-horario').textContent = negocio.horario || 'Horario no especificado';
  
  // Redes sociales
  if (negocio.facebook || negocio.instagram) {
    document.getElementById('redes-section').style.display = 'block';
    let redesHTML = '';
    
    if (negocio.facebook) {
      redesHTML += `
        <a href="${negocio.facebook}" target="_blank" rel="noopener">
          <i class="fab fa-facebook"></i> Facebook
        </a>
      `;
    }
    
    if (negocio.instagram) {
      redesHTML += `
        <a href="https://instagram.com/${negocio.instagram.replace('@', '')}" target="_blank" rel="noopener">
          <i class="fab fa-instagram"></i> Instagram
        </a>
      `;
    }
    
    document.getElementById('redes-links').innerHTML = redesHTML;
  }
  
  // Contacto
  document.getElementById('negocio-direccion').textContent = negocio.direccion || 'Dirección no especificada';
  
  if (negocio.telefono) {
    document.getElementById('negocio-telefono').textContent = negocio.telefono;
  } else {
    document.getElementById('telefono-item').style.display = 'none';
  }
  
  if (negocio.email) {
    document.getElementById('email-item').style.display = 'block';
    document.getElementById('negocio-email').textContent = negocio.email;
  }
}

/**
 * Generar estrellas de rating
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
 * Cargar negocios similares (misma categoría)
 */
function cargarNegociosSimilares(negocioActual) {
  const similares = negociosDB
    .filter(n => 
      n.id !== negocioActual.id && 
      n.categoria === negocioActual.categoria
    )
    .slice(0, 3); // Máximo 3
  
  if (similares.length === 0) {
    document.querySelector('.similares-section').style.display = 'none';
    return;
  }
  
  const similaresHTML = similares.map(negocio => {
    const rating = negocio.rating ? `
      <div class="similar-rating">
        <i class="fas fa-star"></i>
        ${negocio.rating}
      </div>
    ` : '';
    
    return `
      <a href="perfil.html?id=${negocio.id}" class="similar-card">
        <img src="${negocio.foto}" alt="${negocio.nombre}">
        <div class="similar-info">
          <h3>${negocio.nombre}</h3>
          <p>${negocio.subcategoria || negocio.categoria}</p>
          ${rating}
        </div>
      </a>
    `;
  }).join('');
  
  document.getElementById('similares-grid').innerHTML = similaresHTML;
}

/**
 * Inicializar botones de acción
 */
function inicializarBotones(negocio) {
  // Botón WhatsApp
  const btnWhatsapp = document.getElementById('btn-whatsapp');
  if (negocio.whatsapp) {
    const mensaje = encodeURIComponent(`Hola ${negocio.nombre}, encontré tu negocio en deedpri`);
    btnWhatsapp.href = `https://wa.me/52${negocio.whatsapp}?text=${mensaje}`;
  } else {
    btnWhatsapp.style.display = 'none';
  }
  
  // Botón Llamar
  const btnLlamar = document.getElementById('btn-llamar');
  if (negocio.telefono) {
    btnLlamar.href = `tel:${negocio.telefono}`;
  } else {
    btnLlamar.style.display = 'none';
  }
  
  // Botón Dirección (Google Maps)
  const btnDireccion = document.getElementById('btn-direccion');
  if (negocio.coordenadas) {
    btnDireccion.href = `https://www.google.com/maps?q=${negocio.coordenadas.lat},${negocio.coordenadas.lng}`;
    btnDireccion.target = '_blank';
  } else if (negocio.direccion) {
    const direccionEncoded = encodeURIComponent(`${negocio.direccion}, ${negocio.municipio}`);
    btnDireccion.href = `https://www.google.com/maps/search/?api=1&query=${direccionEncoded}`;
    btnDireccion.target = '_blank';
  } else {
    btnDireccion.style.display = 'none';
  }
  
  // Botón Compartir
  const btnCompartir = document.getElementById('btn-compartir');
  btnCompartir.addEventListener('click', function() {
    const url = window.location.href;
    const texto = `Mira ${negocio.nombre} en deedpri`;
    
    // Si el navegador soporta Web Share API
    if (navigator.share) {
      navigator.share({
        title: negocio.nombre,
        text: texto,
        url: url
      }).catch(err => console.log('Error al compartir:', err));
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(url).then(() => {
        alert('¡Enlace copiado al portapapeles!');
      }).catch(err => {
        console.error('Error al copiar:', err);
      });
    }
  });
}

console.log('✅ perfil.js cargado');
