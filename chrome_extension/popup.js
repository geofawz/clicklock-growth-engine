/**
 * Meta Ad Library Scraper Pro - Popup Dashboard Script
 */

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const statusDot = document.getElementById('mas-status-dot');
  const statusLabel = document.getElementById('mas-status-label');

  const btnScrapeVisible = document.getElementById('btn-scrape-visible');
  const btnAutoScroll = document.getElementById('btn-autoscroll');
  const btnStopScroll = document.getElementById('btn-stop-scroll');
  const btnClearData = document.getElementById('btn-clear-data');
  const btnOpenInpage = document.getElementById('btn-open-inpage');
  const selectScrollLimit = document.getElementById('select-scroll-limit');

  const progressContainer = document.getElementById('mas-progress-container');
  const progressFill = document.getElementById('mas-progress-fill');

  const statTotal = document.getElementById('stat-total');
  const statImages = document.getElementById('stat-images');
  const statVideos = document.getElementById('stat-videos');
  const statCarousel = document.getElementById('stat-carousel');

  const btnExportExcel = document.getElementById('btn-export-excel');
  const btnExportCSV = document.getElementById('btn-export-csv');
  const btnExportJSON = document.getElementById('btn-export-json');
  const btnCopyClipboard = document.getElementById('btn-copy-clipboard');

  const inputSearch = document.getElementById('input-search');
  const selectFilterMedia = document.getElementById('select-filter-media');
  const adsContainer = document.getElementById('mas-ads-container');

  // App State
  const scrapedAds = new Map();
  let isScrolling = false;
  let activeTab = null;
  let scrollTimer = null;

  // 1. Check Active Tab Status
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs.length > 0) {
      activeTab = tabs[0];
    }
  } catch (err) {
    console.error('Error querying active tab:', err);
  }

  const isAdLibrary = activeTab && activeTab.url && activeTab.url.includes('facebook.com/ads/library');

  if (isAdLibrary) {
    statusDot.className = 'mas-dot active';
    statusLabel.innerText = 'متصل بمكتبة الإعلانات ✅';

    // First attempt: Ask content script for existing ads or perform scrape
    try {
      chrome.tabs.sendMessage(activeTab.id, { action: 'getData' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.ads) {
          // Content script not ready yet, scrape visible directly
          scrapeVisibleAds(false);
        } else if (response.ads && response.ads.length > 0) {
          response.ads.forEach(ad => {
            if (ad && ad.libraryId) scrapedAds.set(ad.libraryId, ad);
          });
          updateStats();
          renderFeed();
        } else {
          scrapeVisibleAds(false);
        }
      });
    } catch (e) {
      scrapeVisibleAds(false);
    }
  } else {
    statusDot.className = 'mas-dot warning';
    statusLabel.innerText = 'غير متصل (افتح مكتبة الإعلانات)';
    btnScrapeVisible.innerText = '🌐 فتح مكتبة الإعلانات';
    btnScrapeVisible.addEventListener('click', () => {
      chrome.tabs.create({
        url: 'https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=SA&media_type=all'
      });
      window.close();
    });
    return;
  }

  // 2. Attach Event Listeners
  btnScrapeVisible.addEventListener('click', () => scrapeVisibleAds(true));
  btnAutoScroll.addEventListener('click', startAutoScroll);
  btnStopScroll.addEventListener('click', stopAutoScroll);
  btnClearData.addEventListener('click', clearAllData);
  if (btnOpenInpage) {
    btnOpenInpage.addEventListener('click', openInPageDrawer);
  }

  btnExportExcel.addEventListener('click', exportToExcel);
  btnExportCSV.addEventListener('click', exportToCSV);
  btnExportJSON.addEventListener('click', exportToJSON);
  btnCopyClipboard.addEventListener('click', copyToClipboard);

  inputSearch.addEventListener('input', renderFeed);
  selectFilterMedia.addEventListener('change', renderFeed);

  // ==========================================================
  // CORE SCRAPING EXECUTION
  // ==========================================================

  async function scrapeVisibleAds(showToast = false) {
    if (!activeTab || !activeTab.id) {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs || !tabs[0]) return 0;
      activeTab = tabs[0];
    }

    try {
      // Send message to content script first
      const resp = await new Promise((resolve) => {
        chrome.tabs.sendMessage(activeTab.id, { action: 'scrape' }, (res) => {
          if (chrome.runtime.lastError) {
            resolve(null);
          } else {
            resolve(res);
          }
        });
      });

      if (resp && resp.ads) {
        let newCount = 0;
        resp.ads.forEach(ad => {
          if (ad && ad.libraryId) {
            if (!scrapedAds.has(ad.libraryId)) newCount++;
            scrapedAds.set(ad.libraryId, ad);
          }
        });

        updateStats();
        renderFeed();

        if (showToast) {
          if (newCount > 0) {
            alert(`✅ تم سحب ${newCount} إعلان جديد بنجاح! الإجمالي الآن: ${scrapedAds.size}`);
          } else if (scrapedAds.size > 0) {
            alert(`ℹ️ جميع الإعلانات الظاهرة (${scrapedAds.size}) تم سحبها مسبقاً.`);
          } else {
            alert('⚠️ لم يتم العثور على إعلانات في الصفحة الحالية. تأكد من تحميل النتائج بالكامل.');
          }
        }
        return newCount;
      }

      // Fallback: Execute standalone scraping function via chrome.scripting
      const results = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: extractAdsFromPageDirectly
      });

      if (results && results[0] && Array.isArray(results[0].result)) {
        const foundAds = results[0].result;
        let newCount = 0;
        foundAds.forEach(ad => {
          if (ad && ad.libraryId) {
            if (!scrapedAds.has(ad.libraryId)) newCount++;
            scrapedAds.set(ad.libraryId, ad);
          }
        });

        updateStats();
        renderFeed();

        if (showToast) {
          if (newCount > 0) {
            alert(`✅ تم سحب ${newCount} إعلان جديد بنجاح! الإجمالي الآن: ${scrapedAds.size}`);
          } else if (scrapedAds.size > 0) {
            alert(`ℹ️ جميع الإعلانات الظاهرة (${scrapedAds.size}) تم سحبها مسبقاً.`);
          } else {
            alert('⚠️ لم يتم العثور على إعلانات في الصفحة الحالية. تأكد من اكتمال تحميل نتائج البحث.');
          }
        }
        return newCount;
      }
    } catch (err) {
      console.error('Scrape execution error:', err);
      if (showToast) {
        alert(`حدث خطأ أثناء محاولة قراءة الصفحة:\n${err.message || err}\n\nيرجى عمل Refresh لصفحة فيسبوك.`);
      }
    }
    return 0;
  }

  function openInPageDrawer() {
    if (!activeTab || !activeTab.id) return;
    chrome.tabs.sendMessage(activeTab.id, { action: 'openDrawer' }, () => {
      window.close();
    });
  }

  // ==========================================================
  // AUTO-SCROLL ENGINE
  // ==========================================================

  async function startAutoScroll() {
    if (isScrolling) return;

    const limit = parseInt(selectScrollLimit.value, 10) || 50;
    isScrolling = true;

    btnAutoScroll.style.display = 'none';
    btnStopScroll.style.display = 'inline-flex';
    progressContainer.style.display = 'block';

    // Notify content script to start auto-scroll in page context as well
    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, { action: 'startAutoScroll' });
    }

    let noNewRounds = 0;

    scrollTimer = setInterval(async () => {
      if (!isScrolling) return;

      await scrapeVisibleAds(false);
      const current = scrapedAds.size;

      // Update progress bar
      const pct = Math.min(100, Math.round((current / limit) * 100));
      progressFill.style.width = `${pct}%`;

      if (current >= limit) {
        stopAutoScroll();
        alert(`🎉 تم بنجاح سحب ${current} إعلان وفق الحد المطلوب!`);
        return;
      }

      // Scroll active tab down via scripting
      try {
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: () => {
            window.scrollBy({ top: window.innerHeight * 1.1, behavior: 'smooth' });
          }
        });
      } catch (e) {}
    }, 1200);
  }

  function stopAutoScroll() {
    isScrolling = false;
    clearInterval(scrollTimer);
    btnAutoScroll.style.display = 'inline-flex';
    btnStopScroll.style.display = 'none';
    progressContainer.style.display = 'none';

    if (activeTab && activeTab.id) {
      chrome.tabs.sendMessage(activeTab.id, { action: 'stopAutoScroll' });
    }
  }

  function clearAllData() {
    if (scrapedAds.size === 0) return;
    if (confirm('هل أنت متأكد من مسح جميع الإعلانات المسحوبة؟')) {
      scrapedAds.clear();
      updateStats();
      renderFeed();
      if (activeTab && activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'clearAll' });
      }
    }
  }

  // ==========================================================
  // IN-PAGE EXTRACTION FUNCTION (Executed inside target tab)
  // ==========================================================

  function extractAdsFromPageDirectly() {
    const adList = [];
    const processedIds = new Set();

    // 1. Locate all potential card containers
    const allDivs = document.querySelectorAll('div, span');
    const adContainers = new Set();

    allDivs.forEach(el => {
      const text = el.textContent || '';
      if (text.includes('Library ID:') || text.includes('معرف المكتبة:') || text.includes('ID:')) {
        const idMatches = text.match(/(?:Library ID|معرف المكتبة|ID)[:\s]*[0-9]{10,25}/gi);
        if (idMatches && idMatches.length === 1) {
          let curr = el;
          let candidate = null;
          for (let i = 0; i < 12; i++) {
            if (!curr || !curr.parentElement || curr.tagName === 'BODY') break;
            curr = curr.parentElement;
            if (curr.offsetHeight > 200 && curr.offsetWidth > 220) {
              const inner = curr.innerText || '';
              const matches = inner.match(/(?:Library ID|معرف المكتبة|ID)[:\s]*[0-9]{10,25}/gi);
              if (matches && matches.length === 1) {
                candidate = curr;
              } else if (matches && matches.length > 1) {
                break;
              }
            }
          }
          if (candidate) adContainers.add(candidate);
        }
      }
    });

    adContainers.forEach(card => {
      try {
        const fullText = card.innerText || '';
        const idMatch = fullText.match(/(?:Library ID|معرف المكتبة|ID)[:\s]*([0-9]{10,25})/i);
        if (!idMatch) return;
        const libraryId = idMatch[1];
        if (processedIds.has(libraryId)) return;
        processedIds.add(libraryId);

        // Status & Dates
        let status = 'Active';
        if (fullText.includes('Inactive') || fullText.includes('غير نشط')) status = 'Inactive';

        const startedMatch = fullText.match(/(?:Started running on|بدأ تشغيله في)\s*([A-Za-z0-9,\s]+?)(?:·|\n|$)/i);
        const startedRunningDate = startedMatch ? startedMatch[1].trim() : '';

        const activeTimeMatch = fullText.match(/(?:Total active time|إجمالي وقت النشاط)\s*([A-Za-z0-9\s]+?)(?:\n|$)/i);
        const totalActiveTime = activeTimeMatch ? activeTimeMatch[1].trim() : '';

        const versionsMatch = fullText.match(/([0-9]+)\s*(?:ads use this creative|إعلانات تستخدم هذا)/i);
        const multipleVersionsCount = versionsMatch ? `${versionsMatch[1]} ads` : (fullText.includes('multiple versions') ? 'Multiple versions' : '1 ad');

        // Page Name & Avatar
        let pageName = '';
        const nameEl = card.querySelector('a[href*="facebook.com/"], a[role="link"], h1, h2, h3, h4, span[class*="x8t9es0"]');
        if (nameEl && nameEl.innerText.trim()) {
          pageName = nameEl.innerText.trim();
        }
        if (!pageName) {
          const lines = fullText.split('\n').map(l => l.trim()).filter(Boolean);
          const spIdx = lines.findIndex(l => l.toLowerCase() === 'sponsored' || l.includes('مُموَّل'));
          if (spIdx > 0) pageName = lines[spIdx - 1];
          else if (lines.length > 2) pageName = lines[1];
        }

        let pageProfilePic = '';
        const avatarImg = card.querySelector('img[src*="scontent"], img[alt*="profile"], img[alt*="avatar"]');
        if (avatarImg) pageProfilePic = avatarImg.src;

        // Platforms
        const platforms = [];
        if (card.querySelector('svg[aria-label*="Facebook"]') || fullText.includes('Facebook')) platforms.push('Facebook');
        if (card.querySelector('svg[aria-label*="Instagram"]') || fullText.includes('Instagram')) platforms.push('Instagram');
        if (card.querySelector('svg[aria-label*="Messenger"]') || fullText.includes('Messenger')) platforms.push('Messenger');
        if (card.querySelector('svg[aria-label*="Audience Network"]') || fullText.includes('Audience Network')) platforms.push('Audience Network');
        const platformsStr = platforms.length > 0 ? platforms.join(', ') : 'Facebook, Instagram';

        // Primary Copy
        let primaryText = '';
        const copyElements = Array.from(card.querySelectorAll('div[class*="x11i5rnt"], div[dir="auto"], span[dir="auto"], div[style*="white-space"]'))
          .map(e => e.innerText ? e.innerText.trim() : '')
          .filter(t => t.length > 15 && !t.includes('Library ID') && !t.includes('Started running') && !t.includes('See ad details'));
        if (copyElements.length > 0) {
          primaryText = copyElements.sort((a, b) => b.length - a.length)[0];
        }

        // Media
        let mediaType = 'Image';
        const mediaUrls = [];
        let videoSrc = '';

        const videoEl = card.querySelector('video');
        if (videoEl) {
          mediaType = 'Video';
          videoSrc = videoEl.src || (videoEl.querySelector('source') ? videoEl.querySelector('source').src : '');
          if (videoEl.poster) mediaUrls.push(videoEl.poster);
          if (videoSrc) mediaUrls.push(videoSrc);
        }

        const imgs = Array.from(card.querySelectorAll('img'))
          .filter(i => i.src && !i.src.includes('profile') && !i.src.includes('avatar') && (i.offsetWidth > 60 || i.naturalWidth > 60 || i.src.includes('scontent')));

        if (imgs.length > 1 && mediaType !== 'Video') mediaType = 'Carousel';
        imgs.forEach(i => {
          if (!mediaUrls.includes(i.src)) mediaUrls.push(i.src);
        });

        // Destination Link & CTA
        let headline = '';
        let description = '';
        let ctaText = '';
        let destinationUrl = '';

        const linkEl = card.querySelector('a[href*="l.facebook.com/l.php"], a[target="_blank"]');
        if (linkEl && !linkEl.href.includes('facebook.com/ads/library')) {
          const rawHref = linkEl.href;
          if (rawHref.includes('l.facebook.com/l.php')) {
            try {
              const u = new URL(rawHref).searchParams.get('u');
              destinationUrl = u ? decodeURIComponent(u) : rawHref;
            } catch (e) { destinationUrl = rawHref; }
          } else {
            destinationUrl = rawHref;
          }

          const linkLines = (linkEl.innerText || '').split('\n').map(l => l.trim()).filter(Boolean);
          if (linkLines.length >= 1) headline = linkLines[0];
          if (linkLines.length >= 2) description = linkLines[1];
        }

        const ctaMatch = fullText.match(/(?:Order now|Shop now|Learn more|Get offer|Sign up|Book now|Apply now|Contact us|Download|اطلب الآن|تسوق الآن|معرفة المزيد|الحصول على العرض|حجز الآن|تواصل معنا)/i);
        if (ctaMatch) ctaText = ctaMatch[0];

        adList.push({
          libraryId,
          status,
          startedRunningDate,
          totalActiveTime,
          multipleVersionsCount,
          pageName: pageName || 'Competitor Brand',
          pageProfilePic,
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
          adLibraryUrl: `https://www.facebook.com/ads/library/?id=${libraryId}`,
          scrapedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
      } catch (err) {}
    });

    return adList;
  }

  // ==========================================================
  // UI STATS & RENDER FEED
  // ==========================================================

  function updateStats() {
    const total = scrapedAds.size;
    let images = 0, videos = 0, carousels = 0;

    scrapedAds.forEach(ad => {
      if (ad.mediaType === 'Video') videos++;
      else if (ad.mediaType === 'Carousel') carousels++;
      else images++;
    });

    statTotal.innerText = total;
    statImages.innerText = images;
    statVideos.innerText = videos;
    statCarousel.innerText = carousels;
  }

  function renderFeed() {
    const query = (inputSearch.value || '').toLowerCase();
    const mediaFilter = selectFilterMedia.value;

    const adsArray = Array.from(scrapedAds.values());
    const filtered = adsArray.filter(ad => {
      if (mediaFilter !== 'all' && ad.mediaType !== mediaFilter) return false;
      if (query) {
        const text = `${ad.pageName} ${ad.primaryText} ${ad.headline} ${ad.libraryId} ${ad.destinationUrl}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      adsContainer.innerHTML = `
        <div class="mas-empty-state">
          <div class="mas-empty-icon">📊</div>
          <div class="mas-empty-title">لا توجد إعلانات مطابقة</div>
          <p class="mas-empty-hint">حاول تغيير كلمة البحث أو سحب المزيد من الإعلانات.</p>
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
        <div class="mas-ad-card">
          <div class="mas-card-visual">
            ${thumbImg}
            <span class="${badgeClass}">${badgeLabel}</span>
          </div>
          <div class="mas-card-details">
            <div class="mas-card-header">
              <span class="mas-card-advertiser">${escapeHTML(ad.pageName)}</span>
              <span class="mas-status-tag ${ad.status.toLowerCase()}">${ad.status === 'Active' ? 'نشط' : 'غير نشط'}</span>
              <span class="mas-id-tag">ID: ${ad.libraryId}</span>
            </div>
            <div class="mas-card-meta">
              <span>📅 ${ad.startedRunningDate || 'تاريخ غير محدد'}</span>
              ${ad.totalActiveTime ? `<span>⏱️ ${ad.totalActiveTime}</span>` : ''}
              <span>📦 ${ad.multipleVersionsCount}</span>
            </div>
            <p class="mas-card-text">${escapeHTML(ad.primaryText || 'لا يوجد نص إعلاني')}</p>
            ${ad.headline ? `<div class="mas-card-headline">🏷️ ${escapeHTML(ad.headline)}</div>` : ''}
            <div class="mas-card-links">
              ${ad.destinationUrl ? `<a href="${ad.destinationUrl}" target="_blank" class="mas-btn-link" title="${escapeHTML(ad.destinationUrl)}">🔗 صفحة الهبوط ${ad.ctaText ? `(${ad.ctaText})` : ''}</a>` : ''}
              <a href="${ad.adLibraryUrl}" target="_blank" class="mas-btn-link secondary">🏛️ Ad Library</a>
            </div>
          </div>
        </div>
      `;
    });

    adsContainer.innerHTML = html;
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

  // ==========================================================
  // EXPORT ENGINE
  // ==========================================================

  function getExportDataset() {
    const list = Array.from(scrapedAds.values());
    if (list.length === 0) {
      alert('⚠️ لا توجد بيانات إعلانات لتصديرها. يرجى سحب الإعلانات أولاً.');
      return null;
    }
    return list;
  }

  function exportToExcel() {
    const data = getExportDataset();
    if (!data) return;

    if (typeof XLSX === 'undefined') {
      alert('مكتبة SheetJS غير متوفرة، سيتم التصدير بصيغة CSV بدلاً من ذلك.');
      exportToCSV();
      return;
    }

    const rows = data.map((ad, idx) => ({
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

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 6 }, { wch: 22 }, { wch: 12 }, { wch: 24 }, { wch: 18 },
      { wch: 14 }, { wch: 25 }, { wch: 30 }, { wch: 14 }, { wch: 60 },
      { wch: 35 }, { wch: 25 }, { wch: 18 }, { wch: 50 }, { wch: 50 },
      { wch: 40 }, { wch: 45 }, { wch: 22 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Competitor Ads");

    const brandSlug = (data[0].pageName || 'competitor').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_');
    const filename = `Facebook_Ads_${brandSlug}_${new Date().toISOString().substring(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, filename);
  }

  function exportToCSV() {
    const data = getExportDataset();
    if (!data) return;

    const headers = [
      "Library ID", "Status", "Started Date", "Active Duration", "Versions",
      "Page Name", "Platforms", "Media Type", "Primary Copy Text", "Headline",
      "Description", "CTA Button", "Landing Page URL", "Media URLs",
      "Avatar URL", "Ad Library Link", "Scraped At"
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

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const brandSlug = (data[0].pageName || 'competitor').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_');
    const filename = `Facebook_Ads_${brandSlug}_${new Date().toISOString().substring(0, 10)}.csv`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportToJSON() {
    const data = getExportDataset();
    if (!data) return;

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const brandSlug = (data[0].pageName || 'competitor').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_');
    const filename = `Facebook_Ads_${brandSlug}_${new Date().toISOString().substring(0, 10)}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
      .then(() => alert(`📋 تم نسخ ${data.length} إعلان إلى الحافظة بنجاح! يمكنك لصقها في Excel أو Google Sheets مباشرة.`))
      .catch(() => alert('تعذر النسخ التلقائي للحافظة.'));
  }
});
