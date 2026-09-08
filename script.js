// Zonas horarias predeterminadas
const DEFAULT_TIMEZONES = [
    'America/New_York',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
    'UTC'
];

// Almacenar zonas horarias
let timezones = [...DEFAULT_TIMEZONES];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderizarRelojes();
    mostrarZonasDisponibles();
    
    // Actualizar relojes cada segundo
    setInterval(renderizarRelojes, 1000);
});

/**
 * Renderizar todos los relojes
 */
function renderizarRelojes() {
    const container = document.getElementById('clocksContainer');
    container.innerHTML = '';
    
    timezones.forEach((tz, index) => {
        const hora = obtenerHora(tz);
        const clockDiv = document.createElement('div');
        clockDiv.className = 'clock';
        
        clockDiv.innerHTML = `
            <div class="timezone-name">${formatearNombreZona(tz)}</div>
            <div class="digital-time">${hora.tiempo}</div>
            <div class="date-info">${hora.fecha}</div>
            <div class="utc-offset">UTC ${hora.offset}</div>
            <button class="remove-btn" onclick="eliminarZona('${tz}')">Eliminar</button>
        `;
        
        container.appendChild(clockDiv);
    });
}

/**
 * Obtener la hora actual en una zona horaria específica
 */
function obtenerHora(timezone) {
    try {
        const ahora = new Date();
        
        // Obtener la hora en la zona horaria especificada
        const formateador = new Intl.DateTimeFormat('es-ES', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        
        const partes = formateador.formatToParts(ahora);
        const hora = partes.find(p => p.type === 'hour').value;
        const minuto = partes.find(p => p.type === 'minute').value;
        const segundo = partes.find(p => p.type === 'second').value;
        
        const dia = partes.find(p => p.type === 'day').value;
        const mes = partes.find(p => p.type === 'month').value;
        const año = partes.find(p => p.type === 'year').value;
        
        const offset = calcularOffset(timezone);
        
        return {
            tiempo: `${hora}:${minuto}:${segundo}`,
            fecha: `${dia}/${mes}/${año}`,
            offset: offset
        };
    } catch (error) {
        console.error(`Error con la zona horaria ${timezone}:`, error);
        return {
            tiempo: '--:--:--',
            fecha: '--/--/--',
            offset: '?'
        };
    }
}

/**
 * Calcular el offset UTC para una zona horaria
 */
function calcularOffset(timezone) {
    const utc = new Date();
    const tz = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    
    const offset = (tz - utc) / 60000; // Diferencia en minutos
    const horas = Math.floor(offset / 60);
    const minutos = Math.abs(offset % 60);
    
    const signo = horas >= 0 ? '+' : '';
    const minutosStr = minutos === 0 ? '00' : String(minutos).padStart(2, '0');
    
    return `${signo}${String(horas).padStart(2, '0')}:${minutosStr}`;
}

/**
 * Formatear el nombre de la zona horaria
 */
function formatearNombreZona(timezone) {
    return timezone.replace(/_/g, ' ').replace(/\//g, ' - ');
}

/**
 * Agregar una nueva zona horaria
 */
function agregarZonaHoraria() {
    const input = document.getElementById('timezoneInput');
    const tz = input.value.trim();
    
    if (!tz) {
        alert('Por favor ingresa una zona horaria');
        return;
    }
    
    // Validar que sea una zona horaria válida
    try {
        new Intl.DateTimeFormat('en-US', { timeZone: tz });
        
        if (timezones.includes(tz)) {
            alert('Esta zona horaria ya está agregada');
            return;
        }
        
        timezones.push(tz);
        input.value = '';
        renderizarRelojes();
    } catch (error) {
        alert(`Zona horaria inválida: ${tz}`);
    }
}

/**
 * Eliminar una zona horaria
 */
function eliminarZona(timezone) {
    timezones = timezones.filter(tz => tz !== timezone);
    renderizarRelojes();
}

/**
 * Mostrar zonas horarias disponibles
 */
function mostrarZonasDisponibles() {
    const container = document.getElementById('timezonesInfo');
    
    const zonasComunes = [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/Anchorage',
        'Pacific/Honolulu',
        'Europe/London',
        'Europe/Paris',
        'Europe/Berlin',
        'Europe/Madrid',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Asia/Hong_Kong',
        'Asia/Singapore',
        'Asia/Dubai',
        'India/Kolkata',
        'Australia/Sydney',
        'Australia/Melbourne',
        'Pacific/Auckland',
        'UTC'
    ];
    
    container.innerHTML = zonasComunes
        .map(tz => `<div class="timezone-item">${formatearNombreZona(tz)}</div>`)
        .join('');
}

// Permitir agregar zona horaria con Enter
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('timezoneInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarZonaHoraria();
        }
    });
});