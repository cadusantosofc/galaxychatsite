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
    
    // Variáveis para controle do zoom e arrasto
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let initialPinchDistance = 0;
    let lastZoomPoint = { x: 0, y: 0 };
    
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
    function handleImageZoom(e) {
        e.preventDefault();
        const image = $('.print-modal-img');
        const modalBody = $('.print-modal-body');
        const rect = modalBody[0].getBoundingClientRect();
        
        // Calcula a posição do mouse relativa à imagem
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Salva o ponto de zoom
        lastZoomPoint = { x: mouseX, y: mouseY };
        
        // Determina a direção do zoom
        const delta = e.deltaY || e.originalEvent.deltaY;
        const zoomFactor = delta > 0 ? 0.9 : 1.1;
        
        // Aplica o zoom com limite mínimo e máximo
        const newScale = Math.min(Math.max(scale * zoomFactor, 1), 4);
        
        if (newScale !== scale) {
            // Calcula o ponto de origem do zoom em relação à posição atual da imagem
            const originX = (mouseX - translateX) / scale;
            const originY = (mouseY - translateY) / scale;
            
            // Atualiza a escala
            scale = newScale;
            
            // Atualiza a posição para manter o ponto sob o mouse
            translateX = mouseX - (originX * scale);
            translateY = mouseY - (originY * scale);
            
            updateImageTransform(image);
        }
    }
    
    function handleTouchStart(e) {
        const touches = e.originalEvent.touches;
        
        if (touches.length === 2) {
            // Início do pinch zoom
            e.preventDefault();
            initialPinchDistance = getPinchDistance(touches);
            const rect = $('.print-modal-body')[0].getBoundingClientRect();
            lastZoomPoint = {
                x: (touches[0].clientX + touches[1].clientX) / 2 - rect.left,
                y: (touches[0].clientY + touches[1].clientY) / 2 - rect.top
            };
        } else if (touches.length === 1 && scale > 1) {
            // Início do arrasto (apenas se estiver com zoom)
            isDragging = true;
            startX = touches[0].clientX - translateX;
            startY = touches[0].clientY - translateY;
        }
    }
    
    function handleTouchMove(e) {
        const touches = e.originalEvent.touches;
        const image = $('.print-modal-img');
        
        if (touches.length === 2) {
            // Pinch zoom
            e.preventDefault();
            const currentDistance = getPinchDistance(touches);
            const rect = $('.print-modal-body')[0].getBoundingClientRect();
            const pinchCenterX = (touches[0].clientX + touches[1].clientX) / 2 - rect.left;
            const pinchCenterY = (touches[0].clientY + touches[1].clientY) / 2 - rect.top;
            
            if (initialPinchDistance > 0) {
                const zoomFactor = currentDistance / initialPinchDistance;
                const newScale = Math.min(Math.max(scale * zoomFactor, 1), 4);
                
                if (newScale !== scale) {
                    // Calcula o ponto de origem do zoom em relação à posição atual
                    const originX = (pinchCenterX - translateX) / scale;
                    const originY = (pinchCenterY - translateY) / scale;
                    
                    // Atualiza a escala
                    scale = newScale;
                    
                    // Atualiza a posição para manter o centro do pinch
                    translateX = pinchCenterX - (originX * scale);
                    translateY = pinchCenterY - (originY * scale);
                    
                    updateImageTransform(image);
                }
            }
            
            // Atualiza o ponto de zoom
            lastZoomPoint = { x: pinchCenterX, y: pinchCenterY };
            initialPinchDistance = currentDistance;
        } else if (touches.length === 1 && isDragging) {
            // Arrasto
            e.preventDefault();
            translateX = touches[0].clientX - startX;
            translateY = touches[0].clientY - startY;
            updateImageTransform(image);
        }
    }
    
    function updateImageTransform(image) {
        const modalBody = $('.print-modal-body');
        const bodyRect = modalBody[0].getBoundingClientRect();
        const imageRect = image[0].getBoundingClientRect();
        
        // Calcula os limites de arrasto baseado no zoom
        const maxTranslateX = Math.max(0, (imageRect.width * scale - bodyRect.width) / 2);
        const maxTranslateY = Math.max(0, (imageRect.height * scale - bodyRect.height) / 2);
        
        // Limita o arrasto para manter a imagem sempre visível
        translateX = Math.min(Math.max(translateX, -maxTranslateX), maxTranslateX);
        translateY = Math.min(Math.max(translateY, -maxTranslateY), maxTranslateY);
        
        // Aplica a transformação com suavização
        image.css({
            'transform': `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
            'transform-origin': '0 0',
            'transition': isDragging ? 'none' : 'transform 0.2s ease-out'
        });
        
        // Atualiza o cursor baseado no zoom
        modalBody.css('cursor', scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default');
    }
    
    function getPinchDistance(touches) {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }
    
    // Event Listeners
    $('.print-modal-body')
        .on('wheel', handleImageZoom)
        .on('touchstart', handleTouchStart)
        .on('touchmove', handleTouchMove)
        .on('touchend touchcancel', function() {
            isDragging = false;
            initialPinchDistance = 0;
            $(this).css('cursor', scale > 1 ? 'grab' : 'default');
        })
        .on('mousedown', function(e) {
            if (scale > 1) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                $(this).css('cursor', 'grabbing');
            }
        })
        .on('mousemove', function(e) {
            if (isDragging && scale > 1) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                updateImageTransform($('.print-modal-img'));
            }
        })
        .on('mouseup mouseleave', function() {
            isDragging = false;
            $(this).css('cursor', scale > 1 ? 'grab' : 'default');
        });
    
    // Reset zoom ao fechar o modal
    function resetZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        isDragging = false;
        initialPinchDistance = 0;
        lastZoomPoint = { x: 0, y: 0 };
        $('.print-modal-img').css({
            'transform': '',
            'transform-origin': '0 0',
            'transition': 'transform 0.3s ease-out'
        });
        $('.print-modal-body').css('cursor', 'default');
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