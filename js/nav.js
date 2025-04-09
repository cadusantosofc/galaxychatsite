// Script para navegação consistente em todas as páginas
$(document).ready(function() {
    // Inserir o cabeçalho HTML diretamente no início do body
    const headerHtml = `
    <!-- Header -->
    <header>
        <div class="container">
            <nav>
                <div class="logo">
                    <a class="link" href="index.html">
                        <i class="fas fa-comments"></i>
                        <span>Galaxy Chat</span>
                    </a>
                </div>
                <button class="mobile-menu-btn" aria-label="Menu">
                    <i class="fas fa-bars"></i>
                </button>
                <ul class="nav-links" id="menu-items" style="display: none;">
                    <li><a href="index.html#features">Funcionalidades</a></li>
                    <li><a href="index.html#how-it-works">Como Funciona</a></li>
                    <li><a href="index.html#pricing">Planos</a></li>
                    <li><a href="index.html#faq">Dúvidas</a></li>
                    <li><a href="sobrenos.html">Sobre Nós</a></li>
                    <li><a href="https://app.galaxychat.com.br/#/signup" class="nav-cta">Teste Grátis</a></li>
                </ul>
            </nav>
        </div>
    </header>
    `;
    
    // Inserir no início do body
    $('body').prepend(headerHtml);
    
    const mobileMenuBtn = $('.mobile-menu-btn');
    const navLinks = $('.nav-links');
    
    // Inicialização do menu
    function initMenu() {
        if ($(window).width() <= 768) {
            navLinks.hide();
            mobileMenuBtn.show();
        } else {
            navLinks.show();
            mobileMenuBtn.hide();
        }
    }
    
    // Aguarde um pouco para garantir que o DOM esteja carregado
    setTimeout(function() {
        initMenu();
        highlightActiveMenuItem();
    }, 100);
    
    // Toggle do menu (mobile)
    mobileMenuBtn.click(function(e) {
        e.preventDefault();
        if ($(window).width() <= 768) {
            navLinks.slideToggle(200);
            mobileMenuBtn.toggleClass('active');
        }
    });

    // Fechar menu ao clicar em links (mobile)
    $('.nav-links a').click(function() {
        if ($(window).width() <= 768) {
            navLinks.slideUp(200);
            mobileMenuBtn.removeClass('active');
        }
    });

    // Fechar menu ao clicar fora (mobile)
    $(document).click(function(e) {
        if ($(window).width() <= 768) {
            if (!navLinks.is(e.target) && !mobileMenuBtn.is(e.target) && 
                navLinks.has(e.target).length === 0 && mobileMenuBtn.has(e.target).length === 0) {
                navLinks.slideUp(200);
                mobileMenuBtn.removeClass('active');
            }
        }
    });

    // Atualizar ao redimensionar
    $(window).resize(function() {
        initMenu();
    });
    
    // Destacar o item de menu ativo
    function highlightActiveMenuItem() {
        const currentPath = window.location.pathname;
        
        // Remover qualquer classe ativa anteriormente aplicada
        $('.nav-links a').removeClass('active');
        
        // Verificar a página atual e destacar o item de menu correspondente
        if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '') {
            // Na página inicial, não destacamos nenhum item específico
        } else if (currentPath.includes('sobrenos.html')) {
            $('.nav-links a[href="sobrenos.html"]').addClass('active');
        } else if (currentPath.includes('trabalheconosco.html')) {
            // Destacar "Sobre Nós" como seção relacionada
            $('.nav-links a[href="sobrenos.html"]').addClass('active');
        } else if (currentPath.includes('privacidade.html')) {
            // Não tem link direto no menu superior
        } else if (currentPath.includes('termosdeuso.html')) {
            // Não tem link direto no menu superior
        }
    }
}); 