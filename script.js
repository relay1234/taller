/**
 * Taller de Inteligencia Emocional
 * JavaScript para interactividad
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar componentes
  initNavigation();
  initTabs();
  initAccordion();
  initCompromiso();
  initScrollEffects();
  initFormPersistence();
});

/**
 * Navegación móvil
 */
function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navbar = document.getElementById("navbar");

  // Toggle menú móvil
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Cerrar menú al hacer click en un enlace
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
    } else {
      navbar.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
  });
}

/**
 * Tabs de las 5 dimensiones
 */
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.dataset.tab;

      // Remover activo de todos
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Activar el seleccionado
      button.classList.add("active");
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add("active");
      }

      // Scroll suave al contenido
      const dimensionesSection = document.getElementById("dimensiones");
      if (dimensionesSection) {
        const offset = dimensionesSection.offsetTop + 200;
        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Accordion de casos de estudio
 */
function initAccordion() {
  const casoHeaders = document.querySelectorAll(".caso-header");

  casoHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const casoItem = header.parentElement;
      const isOpen = casoItem.classList.contains("open");

      // Cerrar todos los demás
      document.querySelectorAll(".caso-item").forEach((item) => {
        item.classList.remove("open");
      });

      // Toggle el actual
      if (!isOpen) {
        casoItem.classList.add("open");

        // Scroll suave al caso abierto
        setTimeout(() => {
          casoItem.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    });
  });
}

/**
 * Generador de compromiso
 */
function initCompromiso() {
  const generarBtn = document.getElementById("generarCompromiso");
  const resultado = document.getElementById("compromisoResultado");

  if (generarBtn && resultado) {
    generarBtn.addEventListener("click", () => {
      // Obtener valores
      const dimensionSelected = document.querySelector(
        'input[name="dimension"]:checked',
      );
      const accion = document.getElementById("accionDiaria").value.trim();
      const nombre = document.getElementById("nombreCompleto").value.trim();
      const fecha = document.getElementById("fechaCompromiso").value;

      // Validación
      if (!dimensionSelected) {
        showNotification(
          "Por favor selecciona una dimensión a mejorar",
          "error",
        );
        return;
      }
      if (!accion) {
        showNotification("Por favor escribe tu acción diaria", "error");
        return;
      }
      if (!nombre) {
        showNotification("Por favor escribe tu nombre", "error");
        return;
      }
      if (!fecha) {
        showNotification("Por favor selecciona la fecha", "error");
        return;
      }

      // Mapear nombre de dimensión
      const dimensionNames = {
        autoconocimiento: "Autoconocimiento",
        autorregulacion: "Autorregulación",
        automotivacion: "Automotivación",
        empatia: "Empatía",
        habilidades: "Habilidades Sociales",
      };

      // Formatear fecha
      const fechaObj = new Date(fecha + "T00:00:00");
      const fechaFormateada = fechaObj.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Actualizar resultado
      document.getElementById("resultNombre").textContent = nombre;
      document.getElementById("resultDimension").textContent =
        dimensionNames[dimensionSelected.value];
      document.getElementById("resultAccion").textContent = accion;
      document.getElementById("resultFecha").textContent = fechaFormateada;

      // Mostrar resultado
      resultado.classList.add("active");

      // Scroll al resultado
      setTimeout(() => {
        resultado.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      // Guardar en localStorage
      saveCompromiso({
        nombre,
        dimension: dimensionSelected.value,
        accion,
        fecha,
      });

      showNotification("¡Compromiso generado exitosamente!", "success");
    });
  }

  // Cargar compromiso guardado
  loadCompromiso();
}

/**
 * Guardar compromiso en localStorage
 */
function saveCompromiso(data) {
  try {
    localStorage.setItem("ie_compromiso", JSON.stringify(data));
  } catch (e) {
    console.log("No se pudo guardar el compromiso");
  }
}

/**
 * Cargar compromiso desde localStorage
 */
function loadCompromiso() {
  try {
    const saved = localStorage.getItem("ie_compromiso");
    if (saved) {
      const data = JSON.parse(saved);

      // Restaurar valores
      const dimensionInput = document.querySelector(
        `input[name="dimension"][value="${data.dimension}"]`,
      );
      if (dimensionInput) dimensionInput.checked = true;

      const accionInput = document.getElementById("accionDiaria");
      if (accionInput && data.accion) accionInput.value = data.accion;

      const nombreInput = document.getElementById("nombreCompleto");
      if (nombreInput && data.nombre) nombreInput.value = data.nombre;

      const fechaInput = document.getElementById("fechaCompromiso");
      if (fechaInput && data.fecha) fechaInput.value = data.fecha;
    }
  } catch (e) {
    console.log("No se pudo cargar el compromiso guardado");
  }
}

/**
 * Efectos de scroll
 */
function initScrollEffects() {
  // Intersection Observer para animaciones al scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Observar elementos animables
  document
    .querySelectorAll(".card, .caso-item, .arbol-section, .compromiso-step")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(el);
    });

  // Añadir clase visible para animar
  document
    .querySelectorAll(".card, .caso-item, .arbol-section, .compromiso-step")
    .forEach((el) => {
      el.classList.add("animate-on-scroll");
    });

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = 80; // Altura del navbar
        const targetPosition = target.offsetTop - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Añadir estilos para animación
const style = document.createElement("style");
style.textContent = `
    .animate-on-scroll.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

/**
 * Persistencia de formularios
 */
function initFormPersistence() {
  const STORAGE_KEY = "ie_taller_responses";

  // Cargar respuestas guardadas
  loadFormData();

  // Guardar al escribir (con debounce)
  let saveTimeout;
  document.querySelectorAll(".form-input, .form-textarea").forEach((input) => {
    input.addEventListener("input", () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(saveFormData, 1000);
    });
  });
}

/**
 * Guardar datos del formulario
 */
function saveFormData() {
  const data = {};

  document
    .querySelectorAll(".form-input, .form-textarea")
    .forEach((input, index) => {
      if (input.value.trim()) {
        data[`field_${index}`] = input.value;
      }
    });

  try {
    localStorage.setItem("ie_taller_responses", JSON.stringify(data));
  } catch (e) {
    console.log("No se pudieron guardar las respuestas");
  }
}

/**
 * Cargar datos del formulario
 */
function loadFormData() {
  try {
    const saved = localStorage.getItem("ie_taller_responses");
    if (saved) {
      const data = JSON.parse(saved);

      document
        .querySelectorAll(".form-input, .form-textarea")
        .forEach((input, index) => {
          const key = `field_${index}`;
          if (data[key]) {
            input.value = data[key];
          }
        });
    }
  } catch (e) {
    console.log("No se pudieron cargar las respuestas guardadas");
  }
}

/**
 * Mostrar notificaciones
 */
function showNotification(message, type = "info") {
  // Crear elemento de notificación
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;

  // Estilos de la notificación
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        background: ${type === "success" ? "#4a7c59" : type === "error" ? "#c44a4a" : "#4a5c7c"};
        color: white;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;

  notification.querySelector(".notification-content").style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;

  notification.querySelector(".notification-icon").style.cssText = `
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        font-size: 12px;
    `;

  document.body.appendChild(notification);

  // Animar entrada
  requestAnimationFrame(() => {
    notification.style.transform = "translateX(0)";
  });

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(150%)";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * Función para imprimir el compromiso
 */
function printCompromiso() {
  const resultado = document.getElementById("compromisoResultado");
  if (resultado && resultado.classList.contains("active")) {
    window.print();
  }
}

/**
 * Contador de progreso
 */
function updateProgress() {
  const allInputs = document.querySelectorAll(".form-input, .form-textarea");
  const filledInputs = Array.from(allInputs).filter(
    (input) => input.value.trim() !== "",
  );
  const progress = Math.round((filledInputs.length / allInputs.length) * 100);

  console.log(`Progreso del taller: ${progress}%`);
  return progress;
}

// Exponer funciones útiles globalmente
window.IETaller = {
  showNotification,
  updateProgress,
  printCompromiso,
};
