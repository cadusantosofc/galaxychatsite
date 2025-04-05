// Menu Responsivo
$(document).ready(function() {
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
    
    initMenu();
    
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
});

    // Substitua o código existente do FAQ por esta versão melhorada
    $(document).ready(function() {
        // FAQ Accordion - Versão Melhorada
        $('.faq-question').click(function() {
            const $this = $(this);
            const $faqItem = $this.closest('.faq-item');
            const $answer = $this.next('.faq-answer');
            const $icon = $this.find('i');
            
            // Fecha todos os outros FAQs
            $('.faq-item').not($faqItem).removeClass('active');
            $('.faq-question').not($this).removeClass('active');
            $('.faq-answer').not($answer).removeClass('show');
            $('.faq-question i').not($icon).removeClass('fa-chevron-up').addClass('fa-chevron-down');
            
            // Toggle do FAQ atual
            $faqItem.toggleClass('active');
            $this.toggleClass('active');
            $answer.toggleClass('show');
            $icon.toggleClass('fa-chevron-up fa-chevron-down');
            
            // Anima o scroll para o FAQ aberto em mobile
            if($this.hasClass('active') && $(window).width() < 100) {
                $('html, body').animate({
                    scrollTop: $faqItem.offset().top - 20
                }, 300);
            }
        });
        
        // Abre o primeiro FAQ por padrão (opcional)
        // $('.faq-item:first-child .faq-question').trigger('click');
    });

    // Configuração dos Swipers
    const screenshotsSwiper = new Swiper('.screenshots-swiper', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 30,
        grabCursor: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 'auto',
                spaceBetween: 30
            }
        }
    });

const pricingSwiper = new Swiper('.pricing-swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    initialSlide: 2,
    spaceBetween: 0,
    grabCursor: true,
    speed: 400,
    effect: 'slide',
    breakpoints: {
        768: {
            slidesPerView: 2.5,
            spaceBetween: 15,
        },
        1024: {
            slidesPerView: 3.5,
            spaceBetween: 30,
        }
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    }
});

// Adicionar classe popular ao plano Essencial
$(document).ready(function() {
    $('.pricing-card:nth-child(3)').addClass('popular');
    $('.pricing-card.popular').prepend('<div class="popular-tag">MAIS POPULAR</div>');
});

// Modal dos Prints
$(document).ready(function() {
    const printsModal = $('#printsModal');
    const printsModalImg = $('#printsModalImage');
    const printsModalClose = $('.prints-modal-close');

    $('.screenshot-img').click(function(e) {
        e.preventDefault();
        printsModal.fadeIn(200);
        printsModalImg.attr('src', $(this).attr('src'));
    });

    printsModalClose.click(function() {
        printsModal.fadeOut(200);
    });

    printsModal.click(function(e) {
        if (e.target === this) {
            printsModal.fadeOut(200);
        }
    });

    $(document).keydown(function(e) {
        if (e.key === 'Escape' && printsModal.is(':visible')) {
            printsModal.fadeOut(200);
        }
    });
});

// Botão Voltar ao Topo - Versão Corrigida
$(document).ready(function() {
    const backToTop = $('.back-to-top');
    
    // Mostrar/ocultar ao rolar
    function toggleBackToTop() {
        if ($(window).scrollTop() > 300) {
            backToTop.addClass('show');
        } else {
            backToTop.removeClass('show');
        }
    }
    
    // Inicializar
    toggleBackToTop();
    
    // Atualizar ao rolar
    $(window).scroll(function() {
        toggleBackToTop();
    });
    
    // Clicar no botão
    backToTop.click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 'smooth');
    });
});