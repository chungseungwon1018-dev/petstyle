// Mock Database
const mockGroomers = [
    {
        id: 1,
        name: "김서연 원장",
        shop: "퍼피살롱 시그니처 (강남)",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
        portfolio: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&q=80", // cute dog
        specialties: ["poodle", "teddy"],
        location: "gangnam",
        rating: 4.9,
        reviews: 342,
        price: "85,000",
        tags: ["푸들 전문", "테디베어컷 장인", "스트레스 프리"]
    },
    {
        id: 2,
        name: "이지훈 실장",
        shop: "비숑부티크 청담",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
        portfolio: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80", // fluffy white dog
        specialties: ["bichon", "helmet"],
        location: "gangnam",
        rating: 4.8,
        reviews: 215,
        price: "110,000",
        tags: ["비숑 가위컷", "하이바컷 전문", "사진 맛집"]
    },
    {
        id: 3,
        name: "박지민 디자이너",
        shop: "포메스타일 홍대점",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
        portfolio: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80", // pomeranian-like
        specialties: ["pomeranian", "boo"],
        location: "hongdae",
        rating: 4.9,
        reviews: 189,
        price: "75,000",
        tags: ["포메 곰돌이컷", "물개컷", "친절보스"]
    },
    {
        id: 4,
        name: "최유리 원장",
        shop: "펫스파 & 그루밍 판교",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
        portfolio: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",
        specialties: ["maltese", "basic", "sporing"],
        location: "bundang",
        rating: 4.7,
        reviews: 420,
        price: "60,000",
        tags: ["말티즈 스포팅", "베이비컷", "스파 코스"]
    },
    {
        id: 5,
        name: "정태양 수석",
        shop: "어반도그 한남",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80",
        portfolio: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80",
        specialties: ["poodle", "sporing", "helmet"],
        location: "hongdae",
        rating: 4.8,
        reviews: 156,
        price: "90,000",
        tags: ["올가위컷", "프리미엄 케어", "디테일 장인"]
    },
    {
        id: 6,
        name: "강하늘 디자이너",
        shop: "보송살롱 강남",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        portfolio: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80", // maltese / bichon mix look
        specialties: ["bichon", "maltese", "teddy", "basic"],
        location: "gangnam",
        rating: 4.6,
        reviews: 98,
        price: "70,000",
        tags: ["비숑 스포팅", "꼼꼼한 상담", "빠른 손"]
    }
];

// DOM Elements
const dList = document.getElementById('designer-list');
const resultCount = document.getElementById('result-count');
const noResults = document.getElementById('no-results');
const searchBtn = document.getElementById('search-btn');

// Modal Elements
const modal = document.getElementById('booking-modal');
const closeModalBtn = document.getElementById('close-modal');
const bookingForm = document.getElementById('booking-form');
const mImg = document.getElementById('modal-designer-img');
const mName = document.getElementById('modal-designer-name');
const mShop = document.getElementById('modal-shop-name');
const mPrice = document.getElementById('modal-price');

// Toast
const toast = document.getElementById('toast');

// Current Selection
let currentDesigner = null;

// Initialize
function init() {
    renderGroomers(mockGroomers);
    setupEventListeners();
}

// Render Groomers
function renderGroomers(data) {
    dList.innerHTML = '';
    
    if (data.length === 0) {
        noResults.classList.remove('hidden');
        resultCount.textContent = '0';
        return;
    }
    
    noResults.classList.add('hidden');
    resultCount.textContent = data.length;
    
    data.forEach((g, index) => {
        const delay = index * 0.1; // Staggered animation
        
        const tagsHtml = g.tags.map(t => `<span class="tag">${t}</span>`).join('');
        
        const card = document.createElement('div');
        card.className = 'designer-card show';
        card.style.animationDelay = `${delay}s`;
        
        card.innerHTML = `
            <img src="${g.portfolio}" alt="포트폴리오" class="card-portfolio">
            <div class="card-body">
                <img src="${g.avatar}" alt="${g.name}" class="designer-avatar">
                <h3 class="designer-name">${g.name}</h3>
                <div class="designer-shop"><i class="ri-store-2-line"></i> ${g.shop}</div>
                <div class="tags">${tagsHtml}</div>
                
                <div class="stats">
                    <div class="rating">
                        <i class="ri-star-fill"></i> ${g.rating} <span>(<small>${g.reviews}</small>)</span>
                    </div>
                    <div class="price">
                        ${g.price}<span>원~</span>
                    </div>
                </div>
                
                <button class="btn-book" onclick="openModal(${g.id})">실시간 예약하기</button>
            </div>
        `;
        
        dList.appendChild(card);
    });
}

// Search & Filter
function handleSearch() {
    const breed = document.getElementById('breed-select').value;
    const style = document.getElementById('style-select').value;
    const loc = document.getElementById('location-select').value;
    
    const filtered = mockGroomers.filter(g => {
        const matchBreed = !breed || g.specialties.includes(breed);
        const matchStyle = !style || g.specialties.includes(style);
        const matchLoc = !loc || g.location === loc;
        return matchBreed && matchStyle && matchLoc;
    });
    
    // Smooth scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    renderGroomers(filtered);
}

// Modal Logic
window.openModal = function(id) {
    currentDesigner = mockGroomers.find(g => g.id === id);
    if(!currentDesigner) return;
    
    mImg.src = currentDesigner.avatar;
    mName.textContent = currentDesigner.name;
    mShop.textContent = currentDesigner.shop;
    mPrice.textContent = `${currentDesigner.price}원`;
    
    // Reset form
    bookingForm.reset();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success animation/toast
        closeModal();
        showToast();
    });
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Run
document.addEventListener('DOMContentLoaded', init);
