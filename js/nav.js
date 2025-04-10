// Script para navegação consistente em todas as páginas
$(document).ready(function() {
    // Inserir o cabeçalho HTML diretamente no início do body
    const headerHtml = `
    <!-- Header -->
    <header>
        <div class="container">
            <nav class="main-nav">
                <div class="nav-wrapper">
                    <div class="logo">
                        <a class="link" href="index.html">
                            <i class="fas fa-comments"></i>
                            <span>Galaxy Chat</span>
                        </a>
                    </div>
                    <div class="nav-container">
                        <ul class="nav-links">
                            <li><a href="index.html#features">Funcionalidades</a></li>
                            <li><a href="index.html#how-it-works">Como Funciona</a></li>
                            <li><a href="index.html#pricing">Planos</a></li>
                            <li><a href="index.html#faq">Dúvidas</a></li>
                            <li><a href="https://galaxychat.gitbook.io/docs">Documentação</a></li>
                            <li><a href="https://app.galaxychat.com.br/#/signup" class="nav-cta">Teste Grátis</a></li>
                        </ul>
                    </div>
                    <button class="mobile-menu-btn" aria-label="Menu">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </nav>
        </div>
    </header>
    `;
    
    // Inserir no início do body
    $('body').prepend(headerHtml);
    
    // Aguardar um momento para garantir que os elementos foram inseridos
    setTimeout(function() {
        const mobileMenuBtn = $('.mobile-menu-btn');
        const navContainer = $('.nav-container');
        
        // Toggle do menu mobile
        mobileMenuBtn.on('click', function() {
            navContainer.slideToggle(200);
            $(this).toggleClass('active');
        });

        // Fechar menu ao clicar em um link
        $('.nav-links a').on('click', function() {
            if ($(window).width() <= 992) {
                navContainer.slideUp(200);
                mobileMenuBtn.removeClass('active');
            }
        });

        // Fechar menu ao clicar fora
        $(document).on('click', function(e) {
            if ($(window).width() <= 992) {
                if (!navContainer.is(e.target) && 
                    !mobileMenuBtn.is(e.target) && 
                    navContainer.has(e.target).length === 0 && 
                    mobileMenuBtn.has(e.target).length === 0) {
                    navContainer.slideUp(200);
                    mobileMenuBtn.removeClass('active');
                }
            }
        });

        // Verificar o modo do menu
        function checkMenuMode() {
            if ($(window).width() <= 992) {
                mobileMenuBtn.show();
                navContainer.hide();
            } else {
                mobileMenuBtn.hide();
                navContainer.show();
            }
        }

        // Inicialização
        checkMenuMode();
        
        // Verificar ao redimensionar
        $(window).on('resize', function() {
            checkMenuMode();
        });
    }, 100);
    
    function highlightActiveMenuItem() {
        const currentPath = window.location.pathname;
        $('.nav-links a').removeClass('active');
        
        if (currentPath.includes('sobrenos.html')) {
            $('.nav-links a[href="sobrenos.html"]').addClass('active');
        } else if (currentPath.includes('trabalheconosco.html')) {
            $('.nav-links a[href="trabalheconosco.html"]').addClass('active');
        } else if (currentPath.includes('termosdeuso.html')) {
            $('.nav-links a[href="termosdeuso.html"]').addClass('active');
        } else if (currentPath.includes('privacidade.html')) {
            $('.nav-links a[href="privacidade.html"]').addClass('active');
        }
    }
    
    highlightActiveMenuItem();
}); 