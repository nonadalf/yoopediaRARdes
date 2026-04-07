document.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-toggle]");
  if (btn) {
    const targetClass = btn.getAttribute("data-toggle");
    const target = document.querySelector("." + targetClass);
    if (!target) return;
    document.querySelectorAll(".popup").forEach(p => {
      if (p !== target) p.classList.remove("active");
    });
    target.classList.toggle("active");
  }
  if (e.target.closest("[data-close]")) {
    e.target.closest(".popup").classList.remove("active");
  }
});

document.addEventListener("click", function (e) {
  if (!e.target.closest(".popup") && !e.target.closest("[data-toggle]")) {
    document.querySelectorAll(".popup").forEach(p => {
      p.classList.remove("active");
    });
  }
});


























// كود لاضافة فايربيز
// Initialize Firebase
// حفظ مقالة جديدة في Firebase
// ==================== Firebase Configuration ====================
const firebaseConfig = {
  apiKey: "AIzaSyB4I1rTrkmdL73FQkniFhJY5R__WT52SSM",
  authDomain: "yoopediarardes.firebaseapp.com",
  databaseURL: "https://yoopediarardes-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "yoopediarardes",
  storageBucket: "yoopediarardes.firebasestorage.app",
  messagingSenderId: "114801044653",
  appId: "1:114801044653:web:24b7186558e30083f12a24",
  measurementId: "G-FYYYYY899R"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// ==================== Popup Toggle ====================
document.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-toggle]");
  if (btn) {
    const targetClass = btn.getAttribute("data-toggle");
    const target = document.querySelector("." + targetClass);
    if (!target) return;
    document.querySelectorAll(".popup").forEach(p => {
      if (p !== target) p.classList.remove("active");
    });
    target.classList.toggle("active");
  }
  if (e.target.closest("[data-close]")) {
    e.target.closest(".popup").classList.remove("active");
  }
});

// Close popups when clicking outside
document.addEventListener("click", function (e) {
  if (!e.target.closest(".popup") && !e.target.closest("[data-toggle]")) {
    document.querySelectorAll(".popup").forEach(p => {
      p.classList.remove("active");
    });
  }
});

// ==================== إضافة مقالة جديدة ====================
const btnAddArticle = document.getElementById('btnAddArticle');

if (btnAddArticle) {
  btnAddArticle.addEventListener('click', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('articleTitle').value.trim();
    const category = document.getElementById('articleCategory').value.trim();
    const description = document.getElementById('articleDesc').value.trim();

    if (!title || !category || !description) {
      alert('⚠️ الرجاء ملء جميع الحقول!');
      return;
    }

    // حفظ في Firebase
    db.ref('articles').push({
      title: title,
      category: category,
      description: description,
      timestamp: Date.now(),
      author: auth.currentUser ? auth.currentUser.email : 'anonymous'
    }).then(() => {
      alert('✅ تم إضافة المقالة!');
      
      // مسح النموذج
      document.getElementById('articleTitle').value = '';
      document.getElementById('articleCategory').value = '';
      document.getElementById('articleDesc').value = '';
      
      // إغلاق الـ popup
      document.querySelector('.articleList').classList.remove('active');
      
      // تحديث المقالات
      loadArticles();
    }).catch((error) => {
      alert('❌ خطأ: ' + error.message);
      console.error(error);
    });
  });
} else {
  console.warn('⚠️ لم يتم العثور على زر إضافة المقالة');
}

// ==================== جلب وعرض المقالات ====================
function loadArticles() {
  db.ref('articles').on('value', (snapshot) => {
    const articles = snapshot.val();
    if (articles) {
      console.log('✅ المقالات:', articles);
      displayArticles(articles);
      
      // تحديث عدد المقالات
      const count = Object.keys(articles).length;
      const articleCount = document.querySelector('.numberOfArticle span');
      if (articleCount) {
        articleCount.textContent = `${count} مقالات`;
      }
    } else {
      console.log('❌ لا توجد مقالات');
      displayArticles({});
    }
  });
}

// عرض المقالات في الصفحة
function displayArticles(articlesData) {
  const boxes = document.querySelector('.starArticle .boxes');
  if (!boxes) return;
  
  boxes.innerHTML = '';
  
  if (!articlesData || Object.keys(articlesData).length === 0) {
    boxes.innerHTML = '<p style="text-align: center; width: 100%; color: #999;">لا توجد مقالات حتى الآن</p>';
    return;
  }
  
  Object.entries(articlesData).forEach(([id, article]) => {
    const box = document.createElement('div');
    box.className = 'box';
    box.style.cursor = 'pointer';
    box.style.flexDirection = 'column';
    box.style.wordWrap = 'break-word';
    
    box.innerHTML = `
      <div style="padding: 0.5em; text-align: center; width: 100%;">
        <strong style="display: block; margin-bottom: 0.3em; font-size: 0.9em;">${article.title}</strong>
        <small style="color: #666; display: block;">${article.category}</small>
      </div>
    `;
    
    // اضغط على المقالة لـ عرض التفاصيل
    box.addEventListener('click', () => {
      alert(`📖 ${article.title}\n\n${article.description}`);
    });
    
    boxes.appendChild(box);
  });
}

// تحميل المقالات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
  loadArticles();
});

// ==================== البحث ====================
const btnSearch = document.querySelector('.btnSearch');

if (btnSearch) {
  btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    
    const searchQuery = document.querySelector('.searchInput').value.toLowerCase().trim();

    if (!searchQuery) {
      alert('⚠️ أدخل نصاً للبحث!');
      return;
    }

    db.ref('articles').once('value', (snapshot) => {
      const articles = snapshot.val();
      
      if (!articles) {
        alert('❌ لا توجد مقالات');
        return;
      }

      // البحث
      const results = Object.entries(articles).filter(([id, article]) => 
        article.title.toLowerCase().includes(searchQuery) ||
        article.category.toLowerCase().includes(searchQuery) ||
        article.description.toLowerCase().includes(searchQuery)
      );

      if (results.length > 0) {
        console.log('✅ نتائج البحث:', results);
        displaySearchResults(Object.fromEntries(results));
        alert(`✅ تم العثور على ${results.length} مقالات`);
      } else {
        alert('❌ لم يتم العثور على مقالات');
        displayArticles({});
      }
    });
  });
} else {
  console.warn('⚠️ لم يتم العثور على زر البحث');
}

// عرض نتائج البحث
function displaySearchResults(results) {
  const boxes = document.querySelector('.starArticle .boxes');
  if (!boxes) return;
  
  boxes.innerHTML = '';
  
  Object.entries(results).forEach(([id, article]) => {
    const box = document.createElement('div');
    box.className = 'box';
    box.style.cursor = 'pointer';
    box.style.flexDirection = 'column';
    
    box.innerHTML = `
      <div style="padding: 0.5em; text-align: center; width: 100%;">
        <strong style="display: block; margin-bottom: 0.3em; font-size: 0.9em;">${article.title}</strong>
        <small style="color: #666; display: block;">${article.category}</small>
      </div>
    `;
    
    box.addEventListener('click', () => {
      alert(`📖 ${article.title}\n\n${article.description}`);
    });
    
    boxes.appendChild(box);
  });
}