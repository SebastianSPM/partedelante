// Utilidades y funciones mejoradas para ABC Tech Platform
class ABCTechUI {
    constructor() {
        this.notifications = [];
        this.modals = [];
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupTableEnhancements();
        this.setupAnimations();
        this.setupResponsiveFeatures();
        this.setupAccessibility();
        this.setupNotificationSystem();
        this.setupLoadingStates();
        console.log('✅ ABC Tech UI inicializado correctamente');
    }

    // ===== VALIDACIÓN DE FORMULARIOS =====
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            this.wrapFormFields(form);
            
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
            
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showFormErrors(form);
                }
            });
        });
    }

    wrapFormFields(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!input.parentElement.classList.contains('form-group')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group';
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
            }
        });
    }

    validateField(field) {
        const isValid = this.isFieldValid(field);
        const formGroup = field.closest('.form-group');
        
        if (!isValid) {
            field.classList.add('error');
            formGroup?.classList.add('has-error');
            this.showFieldError(field, this.getFieldError(field));
        } else {
            field.classList.remove('error');
            formGroup?.classList.remove('has-error');
            this.clearFieldError(field);
        }
        
        return isValid;
    }

    isFieldValid(field) {
        // Campo requerido
        if (field.hasAttribute('required') && !field.value.trim()) {
            return false;
        }
        
        // Validar email
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(field.value);
        }
        
        // Validar número
        if (field.type === 'number' && field.value) {
            const num = parseFloat(field.value);
            return !isNaN(num) && num >= 0;
        }
        
        // Validar teléfono (formato colombiano)
        if (field.name === 'phone' && field.value) {
            const phoneRegex = /^(\+57)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/;
            return phoneRegex.test(field.value.replace(/\s/g, ''));
        }
        
        return true;
    }

    getFieldError(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            return 'Este campo es obligatorio';
        }
        
        if (field.type === 'email' && field.value) {
            return 'Por favor, ingresa un email válido';
        }
        
        if (field.type === 'number' && field.value) {
            return 'Por favor, ingresa un número válido mayor o igual a 0';
        }
        
        if (field.name === 'phone' && field.value) {
            return 'Por favor, ingresa un teléfono válido (ej: +57 300 123 4567)';
        }
        
        return 'Campo inválido';
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentElement.appendChild(errorDiv);
    }

    clearFieldError(field) {
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.classList.remove('error');
        field.closest('.form-group')?.classList.remove('has-error');
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    showFormErrors(form) {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        this.showNotification('Por favor, corrige los errores en el formulario', 'error');
    }

    // ===== MEJORAS PARA TABLAS =====
    setupTableEnhancements() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            if (!table.parentElement.classList.contains('table-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-container';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
            
            this.addTableSorting(table);
            this.addDeleteConfirmation(table);
            this.addTableSearch(table);
        });
    }

    addTableSorting(table) {
        const headers = table.querySelectorAll('th');
        
        headers.forEach((header, index) => {
            if (header.textContent.trim() && index < headers.length - 1) {
                header.style.cursor = 'pointer';
                header.title = 'Haz clic para ordenar';
                header.addEventListener('click', () => this.sortTable(table, index));
            }
        });
    }

    sortTable(table, columnIndex) {
        const rows = Array.from(table.querySelectorAll('tbody tr, tr:not(:first-child)'));
        const isAscending = !table.dataset.sortAsc || table.dataset.sortAsc === 'false';
        
        rows.sort((a, b) => {
            const aVal = a.cells[columnIndex]?.textContent.trim() || '';
            const bVal = b.cells[columnIndex]?.textContent.trim() || '';
            
            // Intentar ordenar como número
            const aNum = parseFloat(aVal.replace(/[^\d.-]/g, ''));
            const bNum = parseFloat(bVal.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAscending ? aNum - bNum : bNum - aNum;
            }
            
            // Ordenar como texto
            return isAscending ? 
                aVal.localeCompare(bVal, 'es', { numeric: true }) : 
                bVal.localeCompare(aVal, 'es', { numeric: true });
        });
        
        const tbody = table.querySelector('tbody') || table;
        rows.forEach(row => tbody.appendChild(row));
        
        table.dataset.sortAsc = isAscending.toString();
        this.updateSortIndicator(table, columnIndex, isAscending);
    }

    updateSortIndicator(table, columnIndex, isAscending) {
        table.querySelectorAll('th').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        
        const header = table.querySelectorAll('th')[columnIndex];
        header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
    }

    addDeleteConfirmation(table) {
        const deleteLinks = table.querySelectorAll('a[href*="delete"], button[data-action="delete"]');
        
        deleteLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showConfirmDialog(
                    '¿Estás seguro?',
                    'Esta acción no se puede deshacer',
                    () => {
                        if (link.tagName === 'A') {
                            window.location.href = link.href;
                        } else {
                            // Ejecutar acción personalizada
                            link.click();
                        }
                    }
                );
            });
        });
    }

    addTableSearch(table) {
        // Crear input de búsqueda si no existe
        if (!table.parentElement.querySelector('.table-search')) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'table-search';
            searchContainer.innerHTML = `
                <input type="text" placeholder="Buscar en la tabla..." class="table-search-input">
                <button type="button" class="table-search-clear" style="display: none;">×</button>
            `;
            
            table.parentElement.insertBefore(searchContainer, table);
            
            const searchInput = searchContainer.querySelector('.table-search-input');
            const clearBtn = searchContainer.querySelector('.table-search-clear');
            
            searchInput.addEventListener('input', (e) => {
                this.filterTable(table, e.target.value);
                clearBtn.style.display = e.target.value ? 'block' : 'none';
            });
            
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.filterTable(table, '');
                clearBtn.style.display = 'none';
            });
        }
    }

    filterTable(table, query) {
        const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
        const searchTerm = query.toLowerCase().trim();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    // ===== ANIMACIONES Y EFECTOS VISUALES =====
    setupAnimations() {
        // Observador para animaciones al hacer scroll
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.search-section, .create-section, .results-section').forEach(el => {
                observer.observe(el);
            });
        }

        // Efectos hover mejorados
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.disabled) {
                    button.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    // ===== CARACTERÍSTICAS RESPONSIVAS =====
    setupResponsiveFeatures() {
        this.setupMobileMenu();
        this.setupResponsiveTables();
        this.handleOrientationChange();
    }

    setupMobileMenu() {
        const nav = document.querySelector('nav');
        if (nav && nav.children.length > 3) {
            const menuButton = document.createElement('button');
            menuButton.className = 'mobile-menu-toggle';
            menuButton.innerHTML = '<span>☰</span> Menú';
            menuButton.style.display = 'none';
            
            nav.parentNode.insertBefore(menuButton, nav);
            
            menuButton.addEventListener('click', () => {
                nav.classList.toggle('mobile-open');
                menuButton.classList.toggle('active');
            });
        }
    }

    setupResponsiveTables() {
        const tables = document.querySelectorAll('table');
        
        const checkTableResponsiveness = () => {
            tables.forEach(table => {
                if (window.innerWidth <= 768) {
                    this.makeTableResponsive(table);
                } else {
                    this.resetTable(table);
                }
            });
        };
        
        checkTableResponsiveness();
        window.addEventListener('resize', this.debounce(checkTableResponsiveness, 250));
    }

    makeTableResponsive(table) {
        if (table.classList.contains('responsive-processed')) return;
        
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
        const rows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index]) {
                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
        
        table.classList.add('responsive-processed');
    }

    resetTable(table) {
        const cells = table.querySelectorAll('td[data-label]');
        cells.forEach(cell => {
            cell.removeAttribute('data-label');
        });
        table.classList.remove('responsive-processed');
    }

    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setupResponsiveTables();
            }, 100);
        });
    }

    // ===== ACCESIBILIDAD =====
    setupAccessibility() {
        // Agregar roles ARIA
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            table.setAttribute('role', 'table');
            table.setAttribute('aria-label', 'Tabla de datos');
        });
        
        // Etiquetas para formularios
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!input.getAttribute('aria-label') && input.placeholder) {
                input.setAttribute('aria-label', input.placeholder);
            }
        });
        
        // Navegación con teclado
        this.setupKeyboardNavigation();
        
        // Anuncios para lectores de pantalla
        this.setupScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape para cerrar modales
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Enter en enlaces
            if (e.key === 'Enter' && e.target.tagName === 'A') {
                e.target.click();
            }
            
            // Navegación con Tab mejorada
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    setupScreenReaderSupport() {
        // Crear región para anuncios
        if (!document.getElementById('sr-announcements')) {
            const announcements = document.createElement('div');
            announcements.id = 'sr-announcements';
            announcements.setAttribute('aria-live', 'polite');
            announcements.setAttribute('aria-atomic', 'true');
            announcements.className = 'sr-only';
            document.body.appendChild(announcements);
        }
    }

    announceToScreenReader(message) {
        const announcements = document.getElementById('sr-announcements');
        if (announcements) {
            announcements.textContent = message;
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }

    handleTabNavigation(e) {
        // Mejorar navegación por tabulación en formularios complejos
        const focusableElements = document.querySelectorAll(
            'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(e.target);
        
        // Lógica personalizada si es necesario
        if (currentIndex === -1) return;
    }

    // ===== SISTEMA DE NOTIFICACIONES =====
    setupNotificationSystem() {
        // Crear contenedor para notificaciones
        if (!document.getElementById('notifications-container')) {
            const container = document.createElement('div');
            container.id = 'notifications-container';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', duration = 5000, options = {}) {
        const id = 'notification-' + Date.now() + Math.random().toString(36).substr(2, 9);
        const notification = document.createElement('div');
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.className = `notification notification-${type}`;
        notification.id = id;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${icons[type] || icons.info}</div>
                <div class="notification-text">
                    <div class="notification-message">${message}</div>
                    ${options.subtitle ? `<div class="notification-subtitle">${options.subtitle}</div>` : ''}
                </div>
                <button class="notification-close" aria-label="Cerrar notificación">×</button>
            </div>
            <div class="notification-progress"></div>
        `;
        
        // Estilos
        this.applyNotificationStyles(notification, type);
        
        // Agregar al contenedor
        const container = document.getElementById('notifications-container');
        container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Configurar cierre
        const closeBtn = notification.querySelector('.notification-close');
        const closeNotification = () => this.closeNotification(notification);
        
        closeBtn.addEventListener('click', closeNotification);
        
        // Auto-cierre con barra de progreso
        if (duration > 0) {
            const progressBar = notification.querySelector('.notification-progress');
            progressBar.style.animation = `notification-progress ${duration}ms linear`;
            
            setTimeout(closeNotification, duration);
        }
        
        // Anunciar a lectores de pantalla
        this.announceToScreenReader(message);
        
        // Guardar referencia
        this.notifications.push({ id, element: notification });
        
        return notification;
    }

    applyNotificationStyles(notification, type) {
        const styles = {
            success: {
                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                border: '1px solid #86efac',
                color: '#166534'
            },
            error: {
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                border: '1px solid #fca5a5',
                color: '#991b1b'
            },
            warning: {
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1px solid #fcd34d',
                color: '#92400e'
            },
            info: {
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '1px solid #93c5fd',
                color: '#1e40af'
            }
        };
        
        const style = styles[type] || styles.info;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            maxWidth: '400px',
            minWidth: '300px',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            ...style
        });
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n.element !== notification);
        }, 300);
    }

    closeAllNotifications() {
        this.notifications.forEach(({ element }) => {
            this.closeNotification(element);
        });
    }

    // ===== SISTEMA DE DIÁLOGOS =====
    showConfirmDialog(title, message, onConfirm, onCancel = null, options = {}) {
        const dialogId = 'dialog-' + Date.now();
        const dialog = document.createElement('div');
        dialog.id = dialogId;
        dialog.className = 'dialog-overlay';
        
        dialog.innerHTML = `
            <div class="dialog" role="dialog" aria-labelledby="${dialogId}-title" aria-describedby="${dialogId}-desc">
                <div class="dialog-header">
                    <h3 id="${dialogId}-title">${title}</h3>
                </div>
                <div class="dialog-body">
                    <p id="${dialogId}-desc">${message}</p>
                </div>
                <div class="dialog-actions">
                    <button class="btn btn-secondary dialog-cancel">
                        ${options.cancelText || 'Cancelar'}
                    </button>
                    <button class="btn btn-danger dialog-confirm">
                        ${options.confirmText || 'Confirmar'}
                    </button>
                </div>
            </div>
        `;
        
        // Aplicar estilos
        this.applyDialogStyles(dialog);
        
        document.body.appendChild(dialog);
        
        // Animar entrada
        setTimeout(() => {
            dialog.classList.add('show');
        }, 50);
        
        // Configurar eventos
        const confirmBtn = dialog.querySelector('.dialog-confirm');
        const cancelBtn = dialog.querySelector('.dialog-cancel');
        
        const closeDialog = (confirmed = false) => {
            dialog.classList.remove('show');
            setTimeout(() => {
                if (dialog.parentNode) {
                    dialog.parentNode.removeChild(dialog);
                }
                this.modals = this.modals.filter(m => m.id !== dialogId);
            }, 300);
            
            if (confirmed && onConfirm) {
                onConfirm();
            } else if (!confirmed && onCancel) {
                onCancel();
            }
        };
        
        confirmBtn.addEventListener('click', () => closeDialog(true));
        cancelBtn.addEventListener('click', () => closeDialog(false));
        
        // Cerrar con click fuera
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                closeDialog(false);
            }
        });
        
        // Enfocar botón de confirmar
        setTimeout(() => confirmBtn.focus(), 100);
        
        // Guardar referencia
        this.modals.push({ id: dialogId, element: dialog, close: closeDialog });
        
        return dialog;
    }

    applyDialogStyles(dialog) {
        Object.assign(dialog.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '10001',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        const dialogBox = dialog.querySelector('.dialog');
        Object.assign(dialogBox.style, {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '0',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            transform: 'scale(0.9)',
            transition: 'transform 0.3s ease',
            overflow: 'hidden'
        });
        
        // Estilos adicionales para header, body, actions
        const header = dialog.querySelector('.dialog-header');
        Object.assign(header.style, {
            padding: '24px 24px 0',
            borderBottom: 'none'
        });
        
        const body = dialog.querySelector('.dialog-body');
        Object.assign(body.style, {
            padding: '16px 24px 24px',
            lineHeight: '1.6'
        });
        
        const actions = dialog.querySelector('.dialog-actions');
        Object.assign(actions.style, {
            padding: '0 24px 24px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
        });
        
        // Clase para mostrar
        dialog.classList.add('dialog-ready');
    }

    closeAllModals() {
        this.modals.forEach(modal => {
            if (modal.close) modal.close();
        });
    }

    // ===== ESTADOS DE CARGA =====
    setupLoadingStates() {
        // Interceptar formularios para mostrar estados de carga
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                this.showFormLoading(form);
            }
        });
    }

    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            const originalDisabled = submitBtn.disabled;
            
            submitBtn.innerHTML = '<span>Procesando...</span><div class="btn-spinner"></div>';
            submitBtn.disabled = true;
            
            // Restaurar después de un tiempo (fallback)
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = originalDisabled;
                }
            }, 10000);
        }
    }

    showLoadingSpinner(container, message = 'Cargando...') {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    hideLoadingSpinner(container) {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        if (!container) return;
        
        const spinner = container.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    // ===== UTILIDADES =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Validar conexión a internet
    checkConnection() {
        return navigator.onLine;
    }

    // Formatear números
    formatCurrency(amount, currency = 'COP') {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatNumber(number) {
        return new Intl.NumberFormat('es-CO').format(number);
    }

    // Formatear fechas
    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        }).format(new Date(date));
    }

    // Copiar al portapapeles
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copiado al portapapeles', 'success', 2000);
            return true;
        } catch (err) {
            console.error('Error al copiar:', err);
            this.showNotification('Error al copiar al portapapeles', 'error');
            return false;
        }
    }

    // Descargar datos como archivo
    downloadAsFile(data, filename, type = 'text/plain') {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    // Leer archivo
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
}

// Instancia global
let abcTechUI;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    abcTechUI = new ABCTechUI();
});

// Funciones globales de compatibilidad
function validateForm(formId) {
    const form = typeof formId === 'string' ? document.getElementById(formId) : formId;
    return abcTechUI ? abcTechUI.validateForm(form) : true;
}

function showNotification(message, type = 'info', duration = 5000) {
    if (abcTechUI) {
        return abcTechUI.showNotification(message, type, duration);
    }
}

function showConfirmDialog(title, message, onConfirm, onCancel) {
    if (abcTechUI) {
        return abcTechUI.showConfirmDialog(title, message, onConfirm, onCancel);
    }
}

// Estilos CSS adicionales inyectados dinámicamente
const additionalStyles = `
/* Contenedor de notificaciones */
.notifications-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    pointer-events: none;
}

/* Estilos de notificaciones */
.notification {
    pointer-events: auto;
    margin-bottom: 12px;
    position: relative;
    overflow: hidden;
}

.notification.show {
    transform: translateX(0) !important;
}

.notification-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.notification-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.notification-text {
    flex: 1;
    min-width: 0;
}

.notification-message {
    font-weight: 600;
    margin-bottom: 4px;
}

.notification-subtitle {
    font-size: 0.9rem;
    opacity: 0.8;
}

.notification-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
}

.notification-close:hover {
    opacity: 1;
}

.notification-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: rgba(0, 0, 0, 0.2);
    transform-origin: left;
}

@keyframes notification-progress {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
}

/* Estilos de diálogos mejorados */
.dialog-overlay.show {
    opacity: 1 !important;
}

.dialog-overlay.show .dialog {
    transform: scale(1) !important;
}

/* Campos con error mejorados */
.form-group.has-error input,
.form-group.has-error textarea,
.form-group.has-error select {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.field-error::before {
    content: '⚠️';
    font-size: 0.75rem;
}

/* Indicadores de ordenamiento */
th.sort-asc::after {
    content: ' ↑';
    color: #3b82f6;
    font-weight: bold;
}

th.sort-desc::after {
    content: ' ↓';
    color: #3b82f6;
    font-weight: bold;
}

th:hover {
    background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
}

/* Búsqueda en tabla */
.table-search {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.table-search-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.9rem;
}

.table-search-clear {
    background: #ef4444;
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Estados de carga mejorados */
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

.btn-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Menú móvil */
.mobile-menu-toggle {
    display: none;
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin: 0 auto 1rem;
}

.mobile-menu-toggle.active {
    background: #1d4ed8;
}

/* Responsive */
@media (max-width: 768px) {
    .notifications-container {
        left: 10px;
        right: 10px;
        top: 10px;
    }

    .notification {
        max-width: none;
        min-width: auto;
    }

    .mobile-menu-toggle {
        display: block;
    }

    nav {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }

    nav.mobile-open {
        max-height: 500px;
    }

    /* Tablas responsivas */
    .responsive-processed {
        border: 0;
    }

    .responsive-processed thead {
        display: none;
    }

    .responsive-processed tr {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        display: block;
        margin-bottom: 1rem;
        padding: 1rem;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .responsive-processed td {
        border: none;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0;
        text-align: right;
    }

    .responsive-processed td:last-child {
        border-bottom: none;
    }

    .responsive-processed td:before {
        content: attr(data-label) ':';
        font-weight: 600;
        color: #64748b;
        flex-shrink: 0;
        text-align: left;
    }
}

/* Utilidades */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);


// --- Código de tu ABCTechUI ya existente ---
// (todo tu código actual está aquí)

// ----------------------------
// Ejemplos de uso de la API
import { getClients, loginUser } from "./api.js";

// Obtener clientes y mostrarlos en consola
getClients().then(data => console.log(data));

// Hacer login de prueba
loginUser("usuario", "1234").then(data => console.log(data));
