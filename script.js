(function() {
  'use strict';

  // =====================================================
  // 1. HERO: ЗАГРУЗКА ФОТО
  // =====================================================
  const heroInput = document.getElementById('heroUpload');
  const heroPreview = document.getElementById('heroPreview');
  const heroImage = document.getElementById('heroImage');
  const heroPlaceholder = heroPreview?.querySelector('.placeholder-icon');

  if (heroInput && heroImage && heroPreview) {
    heroInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          heroImage.src = ev.target.result;
          heroImage.style.display = 'block';
          if (heroPlaceholder) heroPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // =====================================================
  // 2. ПРОЕКТЫ: ЗАГРУЗКА ИЗОБРАЖЕНИЙ
  // =====================================================
  const fileInputs = document.querySelectorAll('.projectFileInput');
  fileInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;

      const targetId = this.getAttribute('data-target');
      const previewId = this.getAttribute('data-preview');
      const imgElement = document.getElementById(targetId);
      const previewDiv = document.getElementById(previewId);

      if (!imgElement || !previewDiv) return;

      const reader = new FileReader();
      reader.onload = function(ev) {
        imgElement.src = ev.target.result;
        imgElement.style.display = 'block';
        // Скрыть плейсхолдер внутри preview
        const placeholder = previewDiv.querySelector('.placeholder-icon');
        if (placeholder) placeholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  });

  // =====================================================
  // 3. ВИДЕО-ССЫЛКИ: ОБНОВЛЕНИЕ И УПРАВЛЕНИЕ
  // =====================================================
  
  // База данных видео-ссылок для каждого проекта
  // 🔥 ЗДЕСЬ ВСТАВЛЯЙТЕ СВОИ ССЫЛКИ НА ВИДЕО
  const videoLinks = {
    comic: 'Copilot_20260505_193955',    // Ссылка для комикса
    video: 'https://www.youtube.com/watch?v=zwdssj5I9Fg',                    // Ссылка для видеопроекта
    game: 'https://codepen.io/eiiiqwlc-the-builder/pen/GgNEpay'     // Ссылка для JS игры
  };

  /**
   * Функция для обновления всех видео-ссылок в проектах
   * @param {Object} links - объект с новыми ссылками { comic, video, game }
   */
  function updateVideoLinks(links) {
    const projectCards = document.querySelectorAll('.project-card');
    const keys = ['comic', 'video', 'game'];
    
    projectCards.forEach((card, index) => {
      if (index >= keys.length) return;
      
      const key = keys[index];
      const newLink = links[key];
      
      if (!newLink) return;
      
      // Обновляем все кнопки видео в карточке
      const videoBtns = card.querySelectorAll('.project-video-btn, .video-link');
      videoBtns.forEach(btn => {
        btn.href = newLink;
      });
      
      // Если есть iframe с видео, обновляем src
      const iframe = card.querySelector('iframe');
      if (iframe) {
        const videoId = extractVideoId(newLink);
        if (videoId) {
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
        }
      }
    });
  }

  /**
   * Вспомогательная функция для извлечения ID видео из ссылки
   * @param {string} url - ссылка на видео
   * @returns {string|null} - ID видео или null
   */
  function extractVideoId(url) {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) return youtubeMatch[1];
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return vimeoMatch[1];
    
    return null;
  }

  /**
   * Функция для открытия видео в модальном окне
   * @param {string} url - ссылка на видео
   */
  function openVideoModal(url) {
    // Проверяем, есть ли уже модальное окно
    let modal = document.querySelector('.video-modal');
    
    if (!modal) {
      // Создаем модальное окно
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
      
      // Закрытие по клику на крестик
      modal.querySelector('.video-modal-close').addEventListener('click', function() {
        modal.style.display = 'none';
        const iframe = modal.querySelector('iframe');
        iframe.src = '';
      });
      
      // Закрытие по клику на фон
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          this.style.display = 'none';
          const iframe = this.querySelector('iframe');
          iframe.src = '';
        }
      });
    }
    
    // Определяем тип видео и формируем embed URL
    let embedUrl = url;
    const videoId = extractVideoId(url);
    
    if (videoId) {
      if (url.includes('youtube') || url.includes('youtu.be')) {
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (url.includes('vimeo')) {
        embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
      }
    }
    
    // Показываем модальное окно
    const iframe = modal.querySelector('iframe');
    iframe.src = embedUrl;
    modal.style.display = 'flex';
  }

  /**
   * Функция для автоматического применения видео-ссылок
   * при загрузке страницы
   */
  function applyVideoLinksOnLoad() {
    // Обновляем ссылки из базы данных
    updateVideoLinks(videoLinks);
    
    // Добавляем обработчики на кнопки видео для открытия в модальном окне
    const videoBtns = document.querySelectorAll('.project-video-btn, .video-link');
    videoBtns.forEach(btn => {
      // Сохраняем оригинальный обработчик, если он есть
      const originalClick = btn.onclick;
      
      btn.addEventListener('click', function(e) {
        // Если ссылка ведет на внешний ресурс и мы хотим открыть в модалке
        const href = this.href;
        if (href && !href.startsWith('#')) {
          e.preventDefault();
          openVideoModal(href);
        }
      });
    });
  }

  /**
   * Функция для добавления видео-ссылки в конкретный проект
   * @param {string} projectType - тип проекта ('comic', 'video', 'game')
   * @param {string} url - ссылка на видео
   */
  function setVideoLink(projectType, url) {
    if (videoLinks[projectType]) {
      videoLinks[projectType] = url;
      updateVideoLinks(videoLinks);
      console.log(`✅ Видео-ссылка для ${projectType} обновлена: ${url}`);
    } else {
      console.warn(`⚠️ Проект "${projectType}" не найден. Доступные: comic, video, game`);
    }
  }

  // =====================================================
  // 4. ИНИЦИАЛИЗАЦИЯ
  // =====================================================
  
  // Применяем видео-ссылки при загрузке
  document.addEventListener('DOMContentLoaded', function() {
    applyVideoLinksOnLoad();
    
    // Скрываем плейсхолдер в hero, если изображение уже загружено
    if (heroImage && heroImage.src && heroImage.src.length > 0 && heroImage.style.display !== 'none') {
      if (heroPlaceholder) heroPlaceholder.style.display = 'none';
    }
    
    // Логируем информацию в консоль для удобства
    console.log('🎬 Видео-ссылки загружены:', videoLinks);
    console.log('💡 Используйте setVideoLink("comic", "url") для обновления ссылок');
  });

  // =====================================================
  // 5. ЭКСПОРТ ФУНКЦИЙ (для использования в консоли)
  // =====================================================
  
  // Делаем функции доступными глобально для отладки и управления
  window.videoLinks = videoLinks;
  window.updateVideoLinks = updateVideoLinks;
  window.setVideoLink = setVideoLink;
  window.openVideoModal = openVideoModal;
  window.extractVideoId = extractVideoId;

  console.log('🚀 Портфолио загружено!');
  console.log('📝 Для изменения видео-ссылок используйте:');
  console.log('  setVideoLink("comic", "https://...")');
  console.log('  setVideoLink("video", "https://...")');
  console.log('  setVideoLink("game", "https://...")');
  console.log('📺 Для открытия видео в модалке: openVideoModal("https://...")');

})();