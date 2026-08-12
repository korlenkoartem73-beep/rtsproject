(function() {
  'use strict';

  // =====================================================
  // 1. КАРТИНКИ ДЛЯ ПРОЕКТОВ И ПРОФИЛЯ
  // =====================================================
  
  // 🔥 ЗДЕСЬ ВСТАВЛЯЙТЕ ССЫЛКИ НА КАРТИНКИ
  const images = {
    // Фото для профиля (аватарка)
    profile: 'https://i.postimg.cc/your-folder/avatar.jpg',
    
    // Картинки для проектов
    comic: 'https://i.postimg.cc/g2qnHJGq/Copilot-20260505-193955.png',
    video: 'https://www.youtube.com/watch?v=zwdssj5I9Fg',
    game: 'https://i.postimg.cc/ZRVNFLh4/image.png'
  };

  /**
   * Функция для установки всех изображений
   */
  function setAllImages() {
    // Устанавливаем фото профиля
    const heroImage = document.getElementById('heroImage');
    const heroPlaceholder = document.querySelector('#heroPreview .placeholder-icon');
    if (heroImage && images.profile) {
      heroImage.src = images.profile;
      heroImage.style.display = 'block';
      if (heroPlaceholder) heroPlaceholder.style.display = 'none';
    }

    // Устанавливаем картинку для комикса
    const comicImg = document.getElementById('projectImg1');
    const comicPlaceholder = document.querySelector('#projectImage1 .placeholder-icon');
    if (comicImg && images.comic) {
      comicImg.src = images.comic;
      comicImg.style.display = 'block';
      if (comicPlaceholder) comicPlaceholder.style.display = 'none';
    }

    // Устанавливаем картинку для видеопроекта
    const videoImg = document.getElementById('projectImg2');
    const videoPlaceholder = document.querySelector('#projectImage2 .placeholder-icon');
    if (videoImg && images.video) {
      videoImg.src = images.video;
      videoImg.style.display = 'block';
      if (videoPlaceholder) videoPlaceholder.style.display = 'none';
    }

    // Устанавливаем картинку для JS игры
    const gameImg = document.getElementById('projectImg3');
    const gamePlaceholder = document.querySelector('#projectImage3 .placeholder-icon');
    if (gameImg && images.game) {
      gameImg.src = images.game;
      gameImg.style.display = 'block';
      if (gamePlaceholder) gamePlaceholder.style.display = 'none';
    }
  }

  // =====================================================
  // 2. ВИДЕО-ССЫЛКА (только для видеопроекта)
  // =====================================================
  
  // 🔥 ЗДЕСЬ ВСТАВЛЯЙТЕ ССЫЛКУ НА ВИДЕО
  const videoLink = 'https://www.youtube.com/watch?v=zwdssj5I9Fg';

  /**
   * Функция для обновления видео-ссылки
   */
  function updateVideoLink(url) {
    const videoBtns = document.querySelectorAll('[data-video="video"]');
    videoBtns.forEach(btn => {
      btn.href = url;
    });
  }

  /**
   * Вспомогательная функция для извлечения ID видео из ссылки
   */
  function extractVideoId(url) {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) return youtubeMatch[1];
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return vimeoMatch[1];
    return null;
  }

  /**
   * Функция для открытия видео в модальном окне
   */
  function openVideoModal(url) {
    let modal = document.querySelector('.video-modal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'video-modal';
      modal.innerHTML = `
        <div class="video-modal-content">
          <span class="video-modal-close">&times;</span>
          <div class="video-modal-body">
            <iframe 
              width="100%" 
              height="400" 
              src="" 
              frameborder="0" 
              allowfullscreen
              allow="autoplay; encrypted-media"
            ></iframe>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      modal.querySelector('.video-modal-close').addEventListener('click', function() {
        modal.style.display = 'none';
        const iframe = modal.querySelector('iframe');
        iframe.src = '';
      });
      
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          this.style.display = 'none';
          const iframe = this.querySelector('iframe');
          iframe.src = '';
        }
      });
    }
    
    let embedUrl = url;
    const videoId = extractVideoId(url);
    
    if (videoId) {
      if (url.includes('youtube') || url.includes('youtu.be')) {
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (url.includes('vimeo')) {
        embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }
    }
    
    const iframe = modal.querySelector('iframe');
    iframe.src = embedUrl;
    modal.style.display = 'flex';
  }

  /**
   * Функция для применения видео-ссылки при загрузке
   */
  function applyVideoOnLoad() {
    // Обновляем ссылку
    updateVideoLink(videoLink);
    
    // Добавляем обработчики на кнопки видео
    const videoBtns = document.querySelectorAll('[data-video="video"]');
    videoBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        const href = this.href;
        if (href && !href.startsWith('#')) {
          e.preventDefault();
          openVideoModal(href);
        }
      });
    });
  }

  /**
   * Функция для обновления видео-ссылки
   */
  function setVideoLink(url) {
    videoLink = url;
    updateVideoLink(url);
    console.log(`✅ Видео-ссылка обновлена: ${url}`);
  }

  // =====================================================
  // 3. ИНИЦИАЛИЗАЦИЯ
  // =====================================================
  
  document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем все изображения
    setAllImages();
    
    // Применяем видео-ссылку
    applyVideoOnLoad();
    
    console.log('🚀 Портфолио загружено!');
    console.log('📝 Для изменения ссылок используйте:');
    console.log('  images.profile = "новая_ссылка"');
    console.log('  images.comic = "новая_ссылка"');
    console.log('  images.video = "новая_ссылка"');
    console.log('  images.game = "новая_ссылка"');
    console.log('  setVideoLink("https://...") - для видео');
  });

  // =====================================================
  // 4. ЭКСПОРТ ФУНКЦИЙ
  // =====================================================
  
  window.images = images;
  window.setAllImages = setAllImages;
  window.setVideoLink = setVideoLink;
  window.openVideoModal = openVideoModal;

})();
