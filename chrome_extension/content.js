/**
 * Meta Ad Library Scraper Pro - Content Script
 * Highly resilient, intelligent parser for Facebook Ad Library
 */

(() => {
  // Prevent duplicate injection
  if (window.__metaAdScraperProLoaded) return;
  window.__metaAdScraperProLoaded = true;

  // Global state
  const state = {
    scrapedAds: new Map(), // key: libraryId -> ad object
    isAutoScrolling: false,
    autoScrollLimit: 50,
    scrollTimer: null,
    drawerOpen: false,
    currentFilter: 'all',
    searchQuery: ''
  };

  // Initialize on document ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    createFloatingLauncher();
    createDrawerModal();
    setupMessageListener();

    // Auto-detect visible ads after brief delay for dynamic load
    setTimeout(() => {
      scrapeVisibleAds(false);
    }, 1500);
  }

  // ==========================================================
  // 1. UI INJECTION: Floating Button & Drawer
  // ==========================================================

  function createFloatingLauncher() {
    if (document.getElementById('mas-floating-launcher')) return;

    const launcher = document.createElement('div');
    launcher.id = 'mas-floating-launcher';
    launcher.title = 'Meta Ad Library Scraper Pro';
    launcher.innerHTML = `
      <div class="mas-launcher-inner">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#FFFFFF">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        <span class="mas-launcher-text">Meta Scraper</span>
        <span class="mas-launcher-badge" id="mas-launcher-count">0</span>
      </div>
    `;

    launcher.addEventListener('click', toggleDrawer);
    document.body.appendChild(launcher);
  }

  function createDrawerModal() {
    if (document.getElementById('mas-drawer-modal')) return;

    const drawer = document.createElement('div');
    drawer.id = 'mas-drawer-modal';
    drawer.innerHTML = `
      <div class="mas-drawer-overlay" id="mas-drawer-backdrop"></div>
      <div class="mas-drawer-content">
        <!-- Header -->
        <div class="mas-drawer-header">
          <div class="mas-header-info">
            <div class="mas-header-logo">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#D4AF37">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div>
              <div class="mas-title">Meta Ad Library Scraper Pro</div>
              <div class="mas-subtitle">كاشف إعلانات المنافسين الذكي • Clicklock Intelligence</div>
            </div>
          </div>
          <button class="mas-close-icon-btn" id="mas-btn-close-drawer" title="إغلاق">✕</button>
        </div>

        <!-- Controls Toolbar -->
        <div class="mas-drawer-controls">
          <div class="mas-btn-row">
            <button class="mas-ui-btn mas-ui-btn-primary" id="mas-btn-scrape">
              ⚡ سحب الإعلانات الظاهرة
            </button>
            <button class="mas-ui-btn mas-ui-btn-accent" id="mas-btn-autoscroll">
              🚀 سحب تلقائي (Auto-Scroll)
            </button>
            <button class="mas-ui-btn mas-ui-btn-danger" id="mas-btn-stopscroll" style="display:none;">
              ⏸️ إيقاف التمرير
            </button>
            <select class="mas-ui-select" id="mas-scroll-limit-select">
              <option value="25">25 إعلان</option>
              <option value="50" selected>50 إعلان</option>
              <option value="100">100 إعلان</option>
              <option value="250">250 إعلان</option>
              <option value="9999">كل الإعلانات (بدون حد)</option>
            </select>
            <button class="mas-ui-btn mas-ui-btn-outline" id="mas-btn-clear-all">
              🗑️ مسح
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="mas-progress-track" id="mas-progress-track" style="display:none;">
            <div class="mas-progress-thumb" id="mas-progress-thumb"></div>
          </div>

          <!-- Stats Counters -->
          <div class="mas-stats-strip">
            <div class="mas-stat-pill">
              <span class="mas-stat-num" id="mas-stat-total">0</span>
              <span class="mas-stat-label">الإجمالي</span>
            </div>
            <div class="mas-stat-pill">
              <span class="mas-stat-num" id="mas-stat-images">0</span>
              <span class="mas-stat-label">صور</span>
            </div>
            <div class="mas-stat-pill">
              <span class="mas-stat-num" id="mas-stat-videos">0</span>
              <span class="mas-stat-label">فيديو</span>
            </div>
            <div class="mas-stat-pill">
              <span class="mas-stat-num" id="mas-stat-carousel">0</span>
              <span class="mas-stat-label">كاروسيل</span>
            </div>
          </div>
        </div>

        <!-- Export Center -->
        <div class="mas-export-bar">
          <span class="mas-export-heading">تصدير البيانات المباشر:</span>
          <div class="mas-export-btn-group">
            <button class="mas-export-btn mas-exp-excel" id="mas-export-excel">
              📗 Excel (.xlsx)
            </button>
            <button class="mas-export-btn mas-exp-csv" id="mas-export-csv">
              📄 ملف CSV
            </button>
            <button class="mas-export-btn mas-exp-json" id="mas-export-json">
              📦 ملف JSON
            </button>
            <button class="mas-export-btn mas-exp-tsv" id="mas-export-copy">
              📋 نسخ للجدول
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="mas-filter-bar">
          <input type="text" class="mas-filter-input" id="mas-search-input" placeholder="ابحث في نص الإعلان، المعلن، العنوان، معرف الإعلان..." />
          <select class="mas-filter-dropdown" id="mas-filter-media-select">
            <option value="all">كل الوسائط</option>
            <option value="Video">فيديو فقط</option>
            <option value="Image">صور فقط</option>
            <option value="Carousel">كاروسيل فقط</option>
          </select>
        </div>

        <!-- Feed List / Cards Container -->
        <div class="mas-feed-body" id="mas-feed-container">
          <div class="mas-empty-notice">
            <div class="mas-empty-glyph">🔎</div>
            <div class="mas-empty-main">لا توجد إعلانات مسحوبة بعد</div>
            <div class="mas-empty-sub">اضغط على زر <b>"سحب الإعلانات الظاهرة"</b> أو <b>"سحب تلقائي"</b> لبدء جمع البيانات فوراً.</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mas-drawer-footer">
          <span>Meta Ad Library Scraper Pro • Clicklock Saudi Edition</span>
        </div>
      </div>
    `;

    document.body.appendChild(drawer);

    // Bind Drawer Events
    document.getElementById('mas-btn-close-drawer').addEventListener('click', closeDrawer);
    document.getElementById('mas-drawer-backdrop').addEventListener('click', closeDrawer);
    document.getElementById('mas-btn-scrape').addEventListener('click', () => scrapeVisibleAds(true));
    document.getElementById('mas-btn-autoscroll').addEventListener('click', startAutoScroll);
    document.getElementById('mas-btn-stopscroll').addEventListener('click', stopAutoScroll);
    document.getElementById('mas-btn-clear-all').addEventListener('click', clearAllAds);

    document.getElementById('mas-export-excel').addEventListener('click', exportToExcel);
    document.getElementById('mas-export-csv').addEventListener('click', exportToCSV);
    document.getElementById('mas-export-json').addEventListener('click', exportToJSON);
    document.getElementById('mas-export-copy').addEventListener('click', copyToClipboard);

    document.getElementById('mas-search-input').addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderFeed();
    });

    document.getElementById('mas-filter-media-select').addEventListener('change', (e) => {
      state.currentFilter = e.target.value;
      renderFeed();
    });
  }

  function toggleDrawer() {
    state.drawerOpen ? closeDrawer() : openDrawer();
  }

  function openDrawer() {
    state.drawerOpen = true;
    const modal = document.getElementById('mas-drawer-modal');
    if (modal) modal.classList.add('mas-active');
  }

  function closeDrawer() {
    state.drawerOpen = false;
    const modal = document.getElementById('mas-drawer-modal');
    if (modal) modal.classList.remove('mas-active');
  }

  // ==========================================================
  // 2. SMART PARSER ENGINE: Real-World Meta Ad Library Extraction
  // ==========================================================

  function scrapeVisibleAds(showNotification = false) {
    const rawCards = findAdCardContainers();
    let newCount = 0;

    rawCards.forEach(cardEl => {
      const parsed = parseSingleAdCard(cardEl);
      if (parsed && parsed.libraryId) {
        if (!state.scrapedAds.has(parsed.libraryId)) {
          newCount++;
        }
        // Save or enrich
        state.scrapedAds.set(parsed.libraryId, parsed);
      }
    });

    updateCounters();
    renderFeed();

    if (showNotification) {
      if (newCount > 0) {
        showToastNotice(`✅ تم سحب ${newCount} إعلان جديد بنجاح! الإجمالي الآن: ${state.scrapedAds.size}`);
      } else if (state.scrapedAds.size > 0) {
        showToastNotice(`ℹ️ جميع الإعلانات الظاهرة (${state.scrapedAds.size}) مسحوبة مسبقاً.`);
      } else {
        showToastNotice(`⚠️ لم يتم العثور على إعلانات في الصفحة. تأكد من تحميل النتائج.`);
      }
    }

    return newCount;
  }

  /**
   * Identifies all distinct ad card containers on the page
   */
  function findAdCardContainers() {
    const containers = new Set();

    // Strategy 1: Find all elements containing text "Library ID:" or "ID:" or "معرف المكتبة:"
    const allDivs = document.querySelectorAll('div, span');
    allDivs.forEach(el => {
      const text = el.textContent || '';
      if (text.includes('Library ID:') || text.includes('معرف المكتبة:') || text.includes('ID:')) {
        const idMatches = text.match(/(?:Library ID|معرف المكتبة|ID)[:\s]*[0-9]{10,25}/gi);
        if (idMatches && idMatches.length === 1) {
          // Ascend to the root card container
          let curr = el;
          let candidate = null;
          for (let step = 0; step < 12; step++) {
            if (!curr || !curr.parentElement || curr.tagName === 'BODY') break;
            curr = curr.parentElement;
            
            // Check if curr is a valid card container
            if (curr.offsetHeight > 200 && curr.offsetWidth > 220) {
              const innerText = curr.innerText || '';
              const matchesInCurr = innerText.match(/(?:Library ID|معرف المكتبة|ID)[:\s]*[0-9]{10,25}/gi);
              if (matchesInCurr && matchesInCurr.length === 1) {
                candidate = curr;
              } else if (matchesInCurr && matchesInCurr.length > 1) {
                // We went one step too high into the feed container!
                break;
              }
            }
          }
          if (candidate) {
            containers.add(candidate);
          }
        }
      }
    });

    // Strategy 2: Check known class patterns as fallback
    if (containers.size === 0) {
      const classCandidates = document.querySelectorAll('div[class*="x1lh4ggc"], div[class*="xh8yej3"], div[class*="x1yztbdb"], div[class*="_99s5"]');
      classCandidates.forEach(el => {
        const text = el.innerText || '';
        if (text.includes('Library ID') || text.includes('معرف المكتبة') || text.includes('Started running') || text.includes('بدأ تشغيله')) {
          containers.add(el);
        }
      });
    }

    return Array.from(containers);
  }

  /**
   * Parses individual Ad Card DOM node into structured data object
   */
  function parseSingleAdCard(card) {
    if (!card) return null;
    const fullText = card.innerText || '';
    if (!fullText) return null;

    // 1. Library ID
    const idMatch = fullText.match(/(?:Library ID|معرف المكتبة|ID)[:\s]*([0-9]{10,25})/i);
    if (!idMatch) return null;
    const libraryId = idMatch[1];

    // 2. Status
    let status = 'Active';
    if (fullText.includes('Inactive') || fullText.includes('غير نشط')) {
      status = 'Inactive';
    }

    // 3. Started Running Date & Active Duration
    const startedMatch = fullText.match(/(?:Started running on|بدأ تشغيله في)\s*([A-Za-z0-9,\s]+?)(?:·|\n|$)/i);
    const startedRunningDate = startedMatch ? startedMatch[1].trim() : '';

    const activeTimeMatch = fullText.match(/(?:Total active time|إجمالي وقت النشاط)\s*([A-Za-z0-9\s]+?)(?:\n|$)/i);
    const totalActiveTime = activeTimeMatch ? activeTimeMatch[1].trim() : '';

    // 4. Multiple Versions
    const versionsMatch = fullText.match(/([0-9]+)\s*(?:ads use this creative and text|إعلانات تستخدم هذا التصميم والنص|ads use this creative|إعلانات تستخدم هذا)/i);
    const multipleVersionsCount = versionsMatch ? `${versionsMatch[1]} ads` : (fullText.includes('multiple versions') || fullText.includes('عدة إصدارات') ? 'Multiple versions' : '1 ad');

    // 5. Page / Advertiser Name & Avatar
    let pageName = '';
    let pageProfilePic = '';
    let pageUrl = '';

    const pageLinkEl = card.querySelector('a[href*="facebook.com/"], a[role="link"], a[class*="xt0psk2"]');
    if (pageLinkEl) {
      pageUrl = pageLinkEl.href || '';
      const nameSpan = pageLinkEl.querySelector('span') || pageLinkEl;
      if (nameSpan && nameSpan.innerText.trim()) {
        pageName = nameSpan.innerText.trim();
      }
    }

    if (!pageName) {
      const headingEl = card.querySelector('h1, h2, h3, h4, div[role="heading"], span[class*="x8t9es0"]');
      if (headingEl && headingEl.innerText.trim()) {
        pageName = headingEl.innerText.trim();
      }
    }

    if (!pageName) {
      const lines = fullText.split('\n').map(l => l.trim()).filter(Boolean);
      const sponsoredIdx = lines.findIndex(l => l.toLowerCase() === 'sponsored' || l.includes('مُموَّل'));
      if (sponsoredIdx > 0) {
        pageName = lines[sponsoredIdx - 1];
      } else if (lines.length > 2) {
        pageName = lines[1];
      }
    }

    const avatarImg = card.querySelector('img[src*="scontent"], img[alt*="profile"], img[alt*="avatar"], img[height="40"], img[height="36"], img[height="32"]');
    if (avatarImg) {
      pageProfilePic = avatarImg.src;
    }

    // 6. Platforms
    const platforms = [];
    if (card.querySelector('svg[aria-label*="Facebook"], span[aria-label*="Facebook"]') || fullText.includes('Facebook')) platforms.push('Facebook');
    if (card.querySelector('svg[aria-label*="Instagram"], span[aria-label*="Instagram"]') || fullText.includes('Instagram')) platforms.push('Instagram');
    if (card.querySelector('svg[aria-label*="Messenger"], span[aria-label*="Messenger"]') || fullText.includes('Messenger')) platforms.push('Messenger');
    if (card.querySelector('svg[aria-label*="Audience Network"]') || fullText.includes('Audience Network')) platforms.push('Audience Network');
    const platformsStr = platforms.length > 0 ? platforms.join(', ') : 'Facebook, Instagram';

    // 7. Media Extraction (Video, Image, Carousel)
    let mediaType = 'Image';
    const mediaUrls = [];
    let videoSrc = '';

    // Check for video
    const videoEl = card.querySelector('video');
    if (videoEl) {
      mediaType = 'Video';
      videoSrc = videoEl.src || (videoEl.querySelector('source') ? videoEl.querySelector('source').src : '');
      if (videoEl.poster && !mediaUrls.includes(videoEl.poster)) {
        mediaUrls.push(videoEl.poster);
      }
      if (videoSrc && !mediaUrls.includes(videoSrc)) {
        mediaUrls.push(videoSrc);
      }
    }

    // Check for carousel items
    const carouselItems = card.querySelectorAll('ul li img, div[role="listitem"] img, div[class*="x1y1aw1k"] img');
    if (carouselItems.length > 1 && mediaType !== 'Video') {
      mediaType = 'Carousel';
      carouselItems.forEach(img => {
        if (img.src && !img.src.includes('profile') && !img.src.includes('avatar') && !mediaUrls.includes(img.src)) {
          mediaUrls.push(img.src);
        }
      });
    }

    // Fallback image search inside creative body
    if (mediaUrls.length === 0) {
      const allImgs = Array.from(card.querySelectorAll('img')).filter(img => {
        if (!img.src) return false;
        if (img.src.includes('profile') || img.src.includes('avatar') || img.src.includes('s60x60')) return false;
        return (img.offsetWidth > 80 || img.naturalWidth > 80 || img.src.includes('scontent'));
      });

      if (allImgs.length > 1 && mediaType !== 'Video') {
        mediaType = 'Carousel';
      }

      allImgs.forEach(img => {
        if (!mediaUrls.includes(img.src)) mediaUrls.push(img.src);
      });
    }

    // 8. Primary Copy / Ad Caption
    let primaryText = '';
    // Candidate selectors: div.x11i5rnt.x1iorvi4, div[dir="auto"], div[style*="white-space"]
    const textElements = Array.from(card.querySelectorAll('div[class*="x11i5rnt"], div[dir="auto"], span[dir="auto"], div[style*="white-space"]'))
      .map(el => el.innerText ? el.innerText.trim() : '')
      .filter(t => {
        if (t.length < 15) return false;
        if (t.includes('Library ID:') || t.includes('Started running') || t.includes('Total active time')) return false;
        if (t.includes('See summary details') || t.includes('See ad details') || t.includes('عرض تفاصيل الإعلان')) return false;
        if (t === pageName) return false;
        return true;
      });

    if (textElements.length > 0) {
      // Sort by length descending to get the most comprehensive caption
      primaryText = textElements.sort((a, b) => b.length - a.length)[0];
    }

    // 9. Destination CTA Link, Headline & Description
    let headline = '';
    let description = '';
    let ctaText = '';
    let destinationUrl = '';

    const outboundLinks = Array.from(card.querySelectorAll('a[href*="l.facebook.com/l.php"], a[target="_blank"], a[role="button"], a[class*="x1hl2dhg"]'))
      .filter(a => a.href && !a.href.includes('facebook.com/ads/library') && !a.href.includes('facebook.com/help'));

    if (outboundLinks.length > 0) {
      const link = outboundLinks[0];
      destinationUrl = decodeFacebookRedirect(link.href);

      const linkLines = (link.innerText || '').split('\n').map(l => l.trim()).filter(Boolean);
      if (linkLines.length >= 1) headline = linkLines[0];
      if (linkLines.length >= 2) description = linkLines[1];
    }

    // CTA Button text match
    const ctaMatch = fullText.match(/(?:Order now|Shop now|Learn more|Get offer|Sign up|Book now|Apply now|Contact us|Download|Watch more|Listen now|اطلب الآن|تسوق الآن|معرفة المزيد|الحصول على العرض|حجز الآن|تواصل معنا|تنزيل|مشاهدة المزيد)/i);
    if (ctaMatch) {
      ctaText = ctaMatch[0];
    }

    const adLibraryUrl = `https://www.facebook.com/ads/library/?id=${libraryId}`;

    return {
      libraryId,
      status,
      startedRunningDate,
      totalActiveTime,
      multipleVersionsCount,
      pageName: pageName || 'Competitor Brand',
      pageProfilePic,
      pageUrl,
      platforms: platformsStr,
      primaryText: primaryText || headline || '',
      mediaType,
      mediaUrls: mediaUrls.join(' | '),
      primaryThumbnail: mediaUrls[0] || '',
      videoSrc,
      headline: headline || '',
      description: description || '',
      ctaText: ctaText || '',
      destinationUrl: destinationUrl || '',
      adLibraryUrl,
      scrapedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
  }

  function decodeFacebookRedirect(url) {
    if (!url) return '';
    try {
      if (url.includes('l.facebook.com/l.php')) {
        const parsed = new URL(url);
        const u = parsed.searchParams.get('u');
        if (u) return decodeURIComponent(u);
      }
      return url;
    } catch (e) {
      return url;
    }
  }

  // ==========================================================
  // 3. AUTO-SCROLL ENGINE
  // ==========================================================

  function startAutoScroll() {
    if (state.isAutoScrolling) return;

    const selectEl = document.getElementById('mas-scroll-limit-select');
    state.autoScrollLimit = selectEl ? parseInt(selectEl.value, 10) || 50 : 50;
    state.isAutoScrolling = true;

    const btnAuto = document.getElementById('mas-btn-autoscroll');
    const btnStop = document.getElementById('mas-btn-stopscroll');
    const progressTrack = document.getElementById('mas-progress-track');

    if (btnAuto) btnAuto.style.display = 'none';
    if (btnStop) btnStop.style.display = 'inline-flex';
    if (progressTrack) progressTrack.style.display = 'block';

    let consecutiveNoNew = 0;
    let lastScrollHeight = 0;

    state.scrollTimer = setInterval(() => {
      if (!state.isAutoScrolling) return;

      const newFound = scrapeVisibleAds(false);
      const currentTotal = state.scrapedAds.size;

      // Update progress bar
      const thumb = document.getElementById('mas-progress-thumb');
      if (thumb) {
        const pct = Math.min(100, Math.round((currentTotal / state.autoScrollLimit) * 100));
        thumb.style.width = `${pct}%`;
      }

      // Check target count reached
      if (currentTotal >= state.autoScrollLimit) {
        stopAutoScroll();
        showToastNotice(`🎉 تم بنجاح سحب ${currentTotal} إعلان وفق الحد المطلوب!`);
        return;
      }

      // Check bottom of page reached
      const currentHeight = document.documentElement.scrollHeight;
      if (newFound === 0 && currentHeight === lastScrollHeight) {
        consecutiveNoNew++;
        if (consecutiveNoNew >= 5) {
          stopAutoScroll();
          showToastNotice(`✅ تم الوصول لنهاية نتائج البحث. إجمالي الإعلانات المسحوبة: ${currentTotal}`);
          return;
        }
      } else {
        consecutiveNoNew = 0;
      }
      lastScrollHeight = currentHeight;

      // Click "See more" if collapsed text exists
      document.querySelectorAll('div[role="button"], span[role="button"]').forEach(btn => {
        const txt = btn.innerText || '';
        if (txt.includes('See more') || txt.includes('عرض المزيد')) {
          btn.click();
        }
      });

      // Scroll smoothly down
      window.scrollBy({
        top: window.innerHeight * 1.1,
        behavior: 'smooth'
      });
    }, 1100);
  }

  function stopAutoScroll() {
    state.isAutoScrolling = false;
    clearInterval(state.scrollTimer);

    const btnAuto = document.getElementById('mas-btn-autoscroll');
    const btnStop = document.getElementById('mas-btn-stopscroll');
    const progressTrack = document.getElementById('mas-progress-track');

    if (btnAuto) btnAuto.style.display = 'inline-flex';
    if (btnStop) btnStop.style.display = 'none';
    if (progressTrack) progressTrack.style.display = 'none';
  }

  function clearAllAds() {
    if (state.scrapedAds.size === 0) return;
    if (confirm('هل أنت متأكد من مسح جميع الإعلانات المسحوبة من الذاكرة؟')) {
      state.scrapedAds.clear();
      updateCounters();
      renderFeed();
      showToastNotice('🗑️ تم مسح جميع الإعلانات.');
    }
  }

  // ==========================================================
  // 4. UI FEED RENDERER & STATS
  // ==========================================================

  function updateCounters() {
    const total = state.scrapedAds.size;
    let images = 0, videos = 0, carousels = 0;

    state.scrapedAds.forEach(ad => {
      if (ad.mediaType === 'Video') videos++;
      else if (ad.mediaType === 'Carousel') carousels++;
      else images++;
    });

    const badge = document.getElementById('mas-launcher-count');
    if (badge) badge.innerText = total;

    const elTotal = document.getElementById('mas-stat-total');
    const elImages = document.getElementById('mas-stat-images');
    const elVideos = document.getElementById('mas-stat-videos');
    const elCarousel = document.getElementById('mas-stat-carousel');

    if (elTotal) elTotal.innerText = total;
    if (elImages) elImages.innerText = images;
    if (elVideos) elVideos.innerText = videos;
    if (elCarousel) elCarousel.innerText = carousels;
  }

  function renderFeed() {
    const container = document.getElementById('mas-feed-container');
    if (!container) return;

    const adsArray = Array.from(state.scrapedAds.values());
    const filtered = adsArray.filter(ad => {
      // Media filter
      if (state.currentFilter !== 'all' && ad.mediaType !== state.currentFilter) {
        return false;
      }
      // Search query
      if (state.searchQuery) {
        const text = `${ad.pageName} ${ad.primaryText} ${ad.headline} ${ad.libraryId} ${ad.destinationUrl}`.toLowerCase();
        if (!text.includes(state.searchQuery)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="mas-empty-notice">
          <div class="mas-empty-glyph">🔍</div>
          <div class="mas-empty-main">لا توجد إعلانات مطابقة</div>
          <div class="mas-empty-sub">حاول تغيير معايير البحث أو تصفية الوسائط.</div>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(ad => {
      const isVideo = ad.mediaType === 'Video';
      const isCarousel = ad.mediaType === 'Carousel';
      const badgeClass = isVideo ? 'mas-media-badge video' : (isCarousel ? 'mas-media-badge carousel' : 'mas-media-badge image');
      const badgeLabel = isVideo ? '🎥 فيديو' : (isCarousel ? '🖼️ كاروسيل' : '📷 صورة');

      const thumbImg = ad.primaryThumbnail ? `<img src="${ad.primaryThumbnail}" class="mas-card-thumb" alt="Thumbnail" />` : `<div class="mas-card-thumb-placeholder">لا توجد صورة</div>`;

      html += `
        <div class="mas-feed-card">
          <div class="mas-card-left">
            <div class="mas-thumb-wrapper">
              ${thumbImg}
              <span class="${badgeClass}">${badgeLabel}</span>
              ${isVideo ? '<span class="mas-play-icon">▶</span>' : ''}
            </div>
          </div>
          <div class="mas-card-right">
            <div class="mas-card-meta-top">
              <span class="mas-card-brand">${escapeHTML(ad.pageName)}</span>
              <span class="mas-card-status ${ad.status.toLowerCase()}">${ad.status === 'Active' ? 'نشط' : 'غير نشط'}</span>
              <span class="mas-card-id">ID: ${ad.libraryId}</span>
            </div>

            <div class="mas-card-dates">
              <span>📅 ${ad.startedRunningDate || 'تاريخ غير محدد'}</span>
              ${ad.totalActiveTime ? `<span>⏱️ ${ad.totalActiveTime}</span>` : ''}
              <span>📦 ${ad.multipleVersionsCount}</span>
            </div>

            <div class="mas-card-copy">${escapeHTML(ad.primaryText || 'لا يوجد نص إعلاني')}</div>

            ${ad.headline ? `<div class="mas-card-headline">🏷️ ${escapeHTML(ad.headline)}</div>` : ''}

            <div class="mas-card-footer-actions">
              ${ad.destinationUrl ? `<a href="${ad.destinationUrl}" target="_blank" class="mas-link-btn" title="${escapeHTML(ad.destinationUrl)}">🔗 صفحة الهبوط ${ad.ctaText ? `(${ad.ctaText})` : ''}</a>` : ''}
              <a href="${ad.adLibraryUrl}" target="_blank" class="mas-link-btn outline">🏛️ فيسبوك Ad Library</a>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToastNotice(msg) {
    let toast = document.getElementById('mas-toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mas-toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // ==========================================================
  // 5. EXPORT ENGINE: Excel (.xlsx), CSV, JSON, TSV
  // ==========================================================

  function getExportDataset() {
    const list = Array.from(state.scrapedAds.values());
    if (list.length === 0) {
      alert('⚠️ لا توجد إعلانات مسحوبة لتصديرها. يرجى سحب الإعلانات أولاً.');
      return null;
    }
    return list;
  }

  function exportToExcel() {
    const data = getExportDataset();
    if (!data) return;

    if (typeof XLSX === 'undefined') {
      alert('مكتبة SheetJS غير محملة. جاري تصدير CSV بدلاً من ذلك.');
      exportToCSV();
      return;
    }

    // Prepare formatted rows
    const excelRows = data.map((ad, idx) => ({
      "م": idx + 1,
      "معرف الإعلان (Library ID)": ad.libraryId,
      "الحالة (Status)": ad.status,
      "تاريخ بدء التشغيل (Started Date)": ad.startedRunningDate,
      "مدة النشاط (Active Duration)": ad.totalActiveTime,
      "عدد النسخ (Versions)": ad.multipleVersionsCount,
      "اسم الصفحة / المنافس (Page Name)": ad.pageName,
      "المنصات (Platforms)": ad.platforms,
      "نوع الوسائط (Media Type)": ad.mediaType,
      "نص الإعلان الرئيسي (Primary Copy Text)": ad.primaryText,
      "عنوان المنتج / الرابط (Headline)": ad.headline,
      "الوصف (Description)": ad.description,
      "زر اتخاذ الإجراء (CTA Button)": ad.ctaText,
      "رابط صفحة الهبوط (Landing Page URL)": ad.destinationUrl,
      "روابط الصور / الفيديو (Media URLs)": ad.mediaUrls,
      "رابط صورة المعلن (Avatar URL)": ad.pageProfilePic,
      "رابط الإعلان بالمكتبة (Ad Library Link)": ad.adLibraryUrl,
      "تاريخ السحب (Scraped At)": ad.scrapedAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    // Auto-fit column widths
    const colWidths = [
      { wch: 6 },   // م
      { wch: 22 },  // Library ID
      { wch: 12 },  // Status
      { wch: 24 },  // Started Date
      { wch: 18 },  // Active Time
      { wch: 14 },  // Versions
      { wch: 25 },  // Page Name
      { wch: 30 },  // Platforms
      { wch: 14 },  // Media Type
      { wch: 60 },  // Primary Text
      { wch: 35 },  // Headline
      { wch: 25 },  // Description
      { wch: 18 },  // CTA
      { wch: 50 },  // Destination URL
      { wch: 50 },  // Media URLs
      { wch: 40 },  // Avatar URL
      { wch: 45 },  // Ad Library Link
      { wch: 22 }   // Scraped At
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Competitor Ads");

    const filename = `Facebook_Ads_${sanitizeFilename(data[0].pageName)}_${getDateSlug()}.xlsx`;
    XLSX.writeFile(workbook, filename);
    showToastNotice(`📗 تم تحميل ملف الإكسيل بنجاح: ${filename}`);
  }

  function exportToCSV() {
    const data = getExportDataset();
    if (!data) return;

    const headers = [
      "Library ID",
      "Status",
      "Started Date",
      "Active Duration",
      "Versions",
      "Page Name",
      "Platforms",
      "Media Type",
      "Primary Copy Text",
      "Headline",
      "Description",
      "CTA Button",
      "Landing Page URL",
      "Media URLs",
      "Avatar URL",
      "Ad Library Link",
      "Scraped At"
    ];

    const rows = data.map(ad => [
      `"${(ad.libraryId || '').replace(/"/g, '""')}"`,
      `"${(ad.status || '').replace(/"/g, '""')}"`,
      `"${(ad.startedRunningDate || '').replace(/"/g, '""')}"`,
      `"${(ad.totalActiveTime || '').replace(/"/g, '""')}"`,
      `"${(ad.multipleVersionsCount || '').replace(/"/g, '""')}"`,
      `"${(ad.pageName || '').replace(/"/g, '""')}"`,
      `"${(ad.platforms || '').replace(/"/g, '""')}"`,
      `"${(ad.mediaType || '').replace(/"/g, '""')}"`,
      `"${(ad.primaryText || '').replace(/"/g, '""')}"`,
      `"${(ad.headline || '').replace(/"/g, '""')}"`,
      `"${(ad.description || '').replace(/"/g, '""')}"`,
      `"${(ad.ctaText || '').replace(/"/g, '""')}"`,
      `"${(ad.destinationUrl || '').replace(/"/g, '""')}"`,
      `"${(ad.mediaUrls || '').replace(/"/g, '""')}"`,
      `"${(ad.pageProfilePic || '').replace(/"/g, '""')}"`,
      `"${(ad.adLibraryUrl || '').replace(/"/g, '""')}"`,
      `"${(ad.scrapedAt || '').replace(/"/g, '""')}"`
    ]);

    // UTF-8 BOM for Arabic support in Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const filename = `Facebook_Ads_${sanitizeFilename(data[0].pageName)}_${getDateSlug()}.csv`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToastNotice(`📄 تم تحميل ملف CSV بنجاح: ${filename}`);
  }

  function exportToJSON() {
    const data = getExportDataset();
    if (!data) return;

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const filename = `Facebook_Ads_${sanitizeFilename(data[0].pageName)}_${getDateSlug()}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToastNotice(`📦 تم تحميل ملف JSON بنجاح: ${filename}`);
  }

  function copyToClipboard() {
    const data = getExportDataset();
    if (!data) return;

    const headers = [
      "Library ID", "Status", "Started Date", "Active Duration", "Versions",
      "Page Name", "Platforms", "Media Type", "Primary Copy Text", "Headline",
      "CTA Button", "Landing Page URL", "Ad Library Link"
    ];

    const lines = [headers.join('\t')];
    data.forEach(ad => {
      lines.push([
        ad.libraryId,
        ad.status,
        ad.startedRunningDate,
        ad.totalActiveTime,
        ad.multipleVersionsCount,
        ad.pageName,
        ad.platforms,
        ad.mediaType,
        (ad.primaryText || '').replace(/[\t\n\r]+/g, ' '),
        (ad.headline || '').replace(/[\t\n\r]+/g, ' '),
        ad.ctaText,
        ad.destinationUrl,
        ad.adLibraryUrl
      ].join('\t'));
    });

    navigator.clipboard.writeText(lines.join('\n'))
      .then(() => showToastNotice(`📋 تم نسخ ${data.length} إعلان إلى الحافظة! يمكنك لصقها الآن في Excel أو Google Sheets.`))
      .catch(() => alert('تعذر النسخ التلقائي للحافظة. يرجى تجربة تصدير Excel أو CSV.'));
  }

  function sanitizeFilename(name) {
    if (!name) return 'competitor';
    return name.replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_').substring(0, 30);
  }

  function getDateSlug() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  // ==========================================================
  // 6. MESSAGE LISTENER (Inter-Process Communication with Popup)
  // ==========================================================

  function setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'ping') {
        sendResponse({ status: 'ready', count: state.scrapedAds.size });
      } else if (request.action === 'scrape') {
        const count = scrapeVisibleAds(false);
        sendResponse({ success: true, count, ads: Array.from(state.scrapedAds.values()) });
      } else if (request.action === 'getData') {
        sendResponse({ ads: Array.from(state.scrapedAds.values()) });
      } else if (request.action === 'openDrawer') {
        openDrawer();
        sendResponse({ success: true });
      } else if (request.action === 'startAutoScroll') {
        startAutoScroll();
        sendResponse({ success: true });
      } else if (request.action === 'stopAutoScroll') {
        stopAutoScroll();
        sendResponse({ success: true });
      } else if (request.action === 'clearAll') {
        state.scrapedAds.clear();
        updateCounters();
        renderFeed();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  // Expose global methods for external execution
  window.__metaScraper = {
    scrapeVisible: scrapeVisibleAds,
    startAutoScroll,
    stopAutoScroll,
    openDrawer,
    closeDrawer,
    getAds: () => Array.from(state.scrapedAds.values())
  };
})();
