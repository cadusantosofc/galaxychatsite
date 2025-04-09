// Funcionalidades gerais do site
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
    $('.pricing-card:nth-child(3)').addClass('popular');
    $('.pricing-card.popular').prepend('<div class="popular-tag">MAIS POPULAR</div>');

    // Modal dos Prints - Versão Melhorada
    const printsModal = $('#printsModal');
    const printsModalImg = $('#printsModalImage');
    const printsModalClose = $('.print-modal-close');
    const printsModalTitle = $('#printsModalTitle');
    const printsModalCaption = $('#printsModalCaption');
    const printsModalCounter = $('#printModalCounter');
    const prevButton = $('.print-modal-prev');
    const nextButton = $('.print-modal-next');
    const zoomInButton = $('.print-modal-zoom-in');
    const zoomOutButton = $('.print-modal-zoom-out');
    const zoomResetButton = $('.print-modal-zoom-reset');
    
    // Armazenar todas as imagens de screenshot disponíveis
    const screenshotImages = $('.screenshot-img');
    let currentImageIndex = 0;
    let zoomLevel = 1;
    
    // Variáveis para controle do arrastar da imagem
    let isDragging = false;
    let startX, startY;
    let translateX = 0;
    let translateY = 0;
    
    // Variável para armazenar a posição do scroll
    let scrollPosition = 0;
    
    // Abrir o modal quando clicar na imagem
    $('.screenshot-img').click(function(e) {
        e.preventDefault();
        
        // Armazenar a posição atual do scroll
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Armazenar o índice da imagem clicada
        currentImageIndex = screenshotImages.index(this);
        
        // Atualizar o contador
        updateCounter();
        
        // Obter informações da imagem
        const imgSrc = $(this).attr('src');
        const imgAlt = $(this).attr('alt');
        
        // Atualizar o título e a legenda
        printsModalTitle.text('Galaxy Chat - ' + imgAlt);
        printsModalCaption.text(imgAlt);
        
        // Definir a imagem e mostrar o modal
        printsModalImg.attr('src', imgSrc);
        printsModal.fadeIn(300);
        
        // Adicionar a classe para impedir scroll do corpo
        $('body').addClass('modal-open');
        
        // Definir a posição do scroll para o body
        $('body').css('top', -scrollPosition + 'px');
        
        // Resetar o zoom
        resetZoom();
    });
    
    // Fechar o modal
    function closeModal() {
        printsModal.fadeOut(300);
        
        // Remover a classe para permitir scroll do corpo novamente
        $('body').removeClass('modal-open');
        $('body').css('top', '');
        
        // Restaurar a posição do scroll
        window.scrollTo(0, scrollPosition);
        
        setTimeout(resetZoom, 300);
    }
    
    printsModalClose.click(closeModal);
    
    // Fechar ao clicar fora da imagem
    printsModal.click(function(e) {
        if (e.target === this || $(e.target).hasClass('print-modal-content') || $(e.target).hasClass('print-modal-body')) {
            closeModal();
        }
    });
    
    // Fechar com a tecla ESC
    $(document).keydown(function(e) {
        if (e.key === 'Escape' && printsModal.is(':visible')) {
            closeModal();
        }
        
        // Navegação com as setas do teclado
        if (printsModal.is(':visible')) {
            if (e.key === 'ArrowLeft') {
                navigateToPrevImage();
            } else if (e.key === 'ArrowRight') {
                navigateToNextImage();
            }
        }
    });
    
    // Atualizar o contador de imagens
    function updateCounter() {
        printsModalCounter.text((currentImageIndex + 1) + '/' + screenshotImages.length);
    }
    
    // Funções de zoom
    function applyZoom() {
        printsModalImg.css('transform', `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`);
        
        // Adicionar cursor de arrasto apenas quando tiver zoom
        if (zoomLevel > 1) {
            printsModalImg.css('cursor', 'grab');
            // Mostrar mensagem de ajuda
            if (!$('.print-modal-drag-hint').length) {
                const dragHint = $('<div class="print-modal-drag-hint">Arraste para mover a imagem</div>');
                $('.print-modal-body').append(dragHint);
                dragHint.fadeIn(300).delay(2000).fadeOut(300, function() {
                    $(this).remove();
                });
            }
        } else {
            printsModalImg.css('cursor', 'default');
            // Resetar posição quando não tiver zoom
            translateX = 0;
            translateY = 0;
            // Remover mensagem se existir
            $('.print-modal-drag-hint').remove();
        }
    }
    
    function resetZoom() {
        zoomLevel = 1;
        translateX = 0;
        translateY = 0;
        applyZoom();
    }
    
    zoomInButton.click(function() {
        zoomLevel += 0.25;
        if (zoomLevel > 3) zoomLevel = 3; // Limite máximo de zoom
        applyZoom();
    });
    
    zoomOutButton.click(function() {
        zoomLevel -= 0.25;
        if (zoomLevel < 0.5) zoomLevel = 0.5; // Limite mínimo de zoom
        applyZoom();
    });
    
    zoomResetButton.click(resetZoom);
    
    // Permitir zoom com clique duplo na imagem
    printsModalImg.dblclick(function() {
        if (zoomLevel === 1) {
            zoomLevel = 2;
        } else {
            zoomLevel = 1;
        }
        applyZoom();
    });
    
    // Implementar arrasto da imagem com zoom
    printsModalImg.on('mousedown touchstart', function(e) {
        if (zoomLevel <= 1) return; // Não arrastar se não tiver zoom
        
        isDragging = true;
        printsModalImg.css('cursor', 'grabbing');
        
        // Obter posição inicial do mouse/toque
        if (e.type === 'touchstart') {
            startX = e.originalEvent.touches[0].clientX - translateX;
            startY = e.originalEvent.touches[0].clientY - translateY;
        } else {
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        }
        
        e.preventDefault();
    });
    
    // Implementar o zoom com a roda do mouse
    $('.print-modal, .print-modal-body, .print-modal-img').on('wheel', function(e) {
        e.preventDefault(); // Impedir o scroll da página
        
        if (!printsModal.is(':visible')) return;
        
        const delta = e.originalEvent.deltaY;
        const zoomSpeed = 0.1; // Velocidade do zoom
        
        // Aplicar zoom
        if (delta < 0) { // Scroll para cima - aumentar zoom
            zoomLevel += zoomSpeed;
            if (zoomLevel > 3) zoomLevel = 3; // Limite máximo
        } else { // Scroll para baixo - diminuir zoom
            zoomLevel -= zoomSpeed;
            if (zoomLevel < 0.5) zoomLevel = 0.5; // Limite mínimo
        }
        
        applyZoom();
        return false; // Adicionando para reforçar a prevenção de scroll
    });
    
    $(document).on('mousemove touchmove', function(e) {
        if (!isDragging) return;
        
        let currentX, currentY;
        
        // Obter posição atual do mouse/toque
        if (e.type === 'touchmove') {
            currentX = e.originalEvent.touches[0].clientX;
            currentY = e.originalEvent.touches[0].clientY;
        } else {
            currentX = e.clientX;
            currentY = e.clientY;
        }
        
        // Calcular nova posição
        translateX = currentX - startX;
        translateY = currentY - startY;
        
        // Limitar arrasto com base no zoom
        const maxTranslate = 100 * (zoomLevel - 1);
        translateX = Math.max(-maxTranslate, Math.min(maxTranslate, translateX));
        translateY = Math.max(-maxTranslate, Math.min(maxTranslate, translateY));
        
        applyZoom();
        e.preventDefault();
    });
    
    $(document).on('mouseup touchend', function() {
        if (isDragging) {
            isDragging = false;
            printsModalImg.css('cursor', 'grab');
        }
    });
    
    // Resetar a posição da imagem quando mudar de imagem
    function changeImage(newImageIndex) {
        currentImageIndex = newImageIndex;
        
        const img = $(screenshotImages[currentImageIndex]);
        const imgSrc = img.attr('src');
        const imgAlt = img.attr('alt');
        
        // Atualizar os detalhes do modal
        printsModalImg.attr('src', imgSrc);
        printsModalTitle.text('Galaxy Chat - ' + imgAlt);
        printsModalCaption.text(imgAlt);
        updateCounter();
        resetZoom();
    }
    
    // Atualizar as funções de navegação para usar a nova função changeImage
    function navigateToPrevImage() {
        let newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : screenshotImages.length - 1;
        changeImage(newIndex);
    }
    
    function navigateToNextImage() {
        let newIndex = currentImageIndex < screenshotImages.length - 1 ? currentImageIndex + 1 : 0;
        changeImage(newIndex);
    }
    
    // Lidar com os botões de navegação
    prevButton.click(navigateToPrevImage);
    nextButton.click(navigateToNextImage);
    
    // Botão Voltar ao Topo - Versão Corrigida
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