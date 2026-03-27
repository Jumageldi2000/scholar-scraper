document.getElementById('scrapeBtn').addEventListener('click', async () => {
  const btn = document.getElementById('scrapeBtn');
  const statusDiv = document.getElementById('status');
  const progressDiv = document.getElementById('progress');
  
  btn.disabled = true;
  statusDiv.style.display = 'block';
  statusDiv.className = 'status info';
  statusDiv.textContent = '正在抓取论文列表...';
  progressDiv.textContent = '';
  
  try {
    // 获取当前活动标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // 检查是否在Google Scholar页面
    if (!tab.url.includes('scholar.google.com/citations')) {
      throw new Error('请在Google Scholar个人主页使用此扩展');
    }
    
    // 执行内容脚本获取详细信息
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapePapersWithDetails
    });
    
    const papers = results[0].result;
    
    if (!papers || papers.length === 0) {
      throw new Error('未找到任何论文');
    }
    
    statusDiv.className = 'status success';
    statusDiv.textContent = `成功抓取 ${papers.length} 篇论文!`;
    progressDiv.textContent = '正在生成CSV文件...';
    
    // 生成CSV并下载
    downloadCSV(papers);
    
    progressDiv.textContent = '✓ CSV文件已下载';
    
  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = '错误: ' + error.message;
    console.error(error);
  } finally {
    btn.disabled = false;
  }
});

// 在页面中执行的抓取函数(包含详细信息)
async function scrapePapersWithDetails() {
  const papers = [];
  const rows = document.querySelectorAll('tr.gsc_a_tr');
  
  // 更新页面上的进度提示
  const createProgressIndicator = () => {
    let indicator = document.getElementById('scraper-progress');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'scraper-progress';
      indicator.style.cssText = 'position:fixed;top:10px;right:10px;background:#1a73e8;color:white;padding:15px;border-radius:4px;z-index:10000;box-shadow:0 2px 8px rgba(0,0,0,0.2);';
      document.body.appendChild(indicator);
    }
    return indicator;
  };
  
  const indicator = createProgressIndicator();
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    indicator.textContent = `正在抓取论文 ${i + 1}/${rows.length}...`;
    
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
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
    } catch (e) {
      console.error('解析论文行时出错:', e);
    }
  }
  
  // 移除进度提示
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
  
  return papers;
}

// 生成并下载CSV文件
function downloadCSV(papers) {
  // CSV表头
  const headers = ['序号', '标题', '发表年份', '发表日期', '论文链接', 'Google Scholar详情链接', '摘要'];
  
  // 转义CSV字段
  function escapeCSV(str) {
    if (str === null || str === undefined) return '';
    str = String(str);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }
  
  // 构建CSV内容
  let csvContent = '\ufeff'; // BOM for UTF-8
  csvContent += headers.join(',') + '\n';
  
  papers.forEach(paper => {
    const row = [
      paper.index,
      escapeCSV(paper.title),
      escapeCSV(paper.year),
      escapeCSV(paper.publicationDate),
      escapeCSV(paper.paperUrl),
      escapeCSV(paper.detailUrl),
      escapeCSV(paper.abstract)
    ];
    csvContent += row.join(',') + '\n';
  });
  
  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `google_scholar_papers_${new Date().getTime()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
