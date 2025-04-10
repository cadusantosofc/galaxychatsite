// Gerenciador de Cookies
const CookieManager = {
    // Configurações padrão
    config: {
        maxAge: 7, // dias
        essentialCookies: ['session_id', 'csrf_token'], // cookies essenciais que não serão removidos
        autoClean: true, // limpa cookies não essenciais automaticamente
    },

    // Inicializar gerenciador de cookies
    init() {
        if (this.config.autoClean) {
            this.cleanNonEssentialCookies();
        }
        this.showCookieConsent();
        this.setupAutoClean();
    },

    // Mostrar banner de consentimento de cookies
    showCookieConsent() {
        if (!this.getCookie('cookie_consent')) {
            const consentHtml = `
                <div id="cookie-consent" class="cookie-banner">
                    <div class="cookie-content">
                        <p>Utilizamos cookies essenciais para garantir a melhor experiência. 
                           Para proteger sua privacidade, limitamos o uso de cookies e limpamos regularmente os dados não essenciais.</p>
                        <div class="cookie-buttons">
                            <button id="accept-cookies" class="btn-primary">Aceitar Essenciais</button>
                            <button id="reject-cookies" class="btn-secondary">Rejeitar Não Essenciais</button>
                        </div>
                    </div>
                </div>`;

            document.body.insertAdjacentHTML('beforeend', consentHtml);

            // Eventos dos botões
            document.getElementById('accept-cookies').addEventListener('click', () => {
                this.setCookie('cookie_consent', 'accepted', this.config.maxAge);
                this.hideCookieBanner();
            });

            document.getElementById('reject-cookies').addEventListener('click', () => {
                this.setCookie('cookie_consent', 'rejected', this.config.maxAge);
                this.cleanNonEssentialCookies();
                this.hideCookieBanner();
            });
        }
    },

    // Esconder banner de cookies
    hideCookieBanner() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.remove();
        }
    },

    // Configurar limpeza automática
    setupAutoClean() {
        // Limpa cookies não essenciais a cada 24 horas
        setInterval(() => {
            this.cleanNonEssentialCookies();
        }, 24 * 60 * 60 * 1000);

        // Limpa ao fechar a página
        window.addEventListener('beforeunload', () => {
            this.cleanNonEssentialCookies();
        });
    },

    // Limpar cookies não essenciais
    cleanNonEssentialCookies() {
        const cookies = document.cookie.split(';');
        
        cookies.forEach(cookie => {
            const cookieName = cookie.split('=')[0].trim();
            if (!this.config.essentialCookies.includes(cookieName)) {
                this.deleteCookie(cookieName);
            }
        });
    },

    // Definir um cookie
    setCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
    },

    // Obter valor de um cookie
    getCookie(name) {
        const cookieName = name + "=";
        const cookies = document.cookie.split(';');
        
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    },

    // Deletar um cookie
    deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    },

    // Função para limpar todos os cookies
    deleteAllCookies() {
        const cookies = document.cookie.split(';');
        
        for (let cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        }
    },

    // Inicializar o sistema de limpeza
    init() {
        // Limpa cookies a cada 10 minutos (600000 ms)
        setInterval(() => {
            this.deleteAllCookies();
        }, 600000);

        // Também limpa ao carregar a página
        this.deleteAllCookies();
    }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    CookieManager.init();
}); 