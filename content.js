// 这个脚本会自动注入到Google Scholar页面中
// 用于提供额外的页面交互功能

console.log('Google Scholar 论文抓取器已加载');

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapePapers') {
    scrapePapersWithDetails()
      .then(papers => sendResponse({ success: true, papers }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // 保持消息通道开放
  }
});

// 抓取论文并获取详细信息
async function scrapePapersWithDetails() {
  const papers = [];
  const rows = document.querySelectorAll('tr.gsc_a_tr');
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    try {
      const titleLink = row.querySelector('a.gsc_a_at');
      const title = titleLink ? titleLink.textContent.trim() : '';
      const detailUrl = titleLink ? titleLink.getAttribute('href') : '';
      const yearSpan = row.querySelector('span.gsc_a_h');
      const year = yearSpan ? yearSpan.textContent.trim() : '';
      
      let abstract = '';
      let fullUrl = '';
      let publicationDate = '';
      
      // 如果有详情链接,尝试获取摘要
      if (detailUrl) {
        try {
          const detailPageUrl = 'https://scholar.google.com' + detailUrl;
          const response = await fetch(detailPageUrl);
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // 获取摘要
          const abstractDiv = doc.querySelector('#gsc_oci_descr .gsh_small');
          if (abstractDiv) {
            abstract = abstractDiv.textContent.trim();
          }
          
          // 获取论文链接
          const paperLink = doc.querySelector('a.gsc_oci_title_link');
          if (paperLink) {
            fullUrl = paperLink.getAttribute('href');
          }
          
          // 获取发表日期
          const dateFields = doc.querySelectorAll('.gs_scl');
          for (const field of dateFields) {
            const label = field.querySelector('.gsc_oci_field');
            if (label && label.textContent.includes('发表日期')) {
              const value = field.querySelector('.gsc_oci_value');
              if (value) {
                publicationDate = value.textContent.trim();
              }
            }
          }
          
        } catch (e) {
          console.error('获取论文详情失败:', e);
        }
      }
      
      papers.push({
        index: i + 1,
        title: title,
        year: year,
        publicationDate: publicationDate,
        detailUrl: detailUrl ? 'https://scholar.google.com' + detailUrl : '',
        paperUrl: fullUrl,
        abstract: abstract
      });
      
      // 添加延迟以避免过快请求
      if (i < rows.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (e) {
      console.error('解析论文行时出错:', e);
    }
  }
  
  return papers;
}
