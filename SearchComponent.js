class SearchComponent {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        // 创建搜索框和结果容器
        this.container.innerHTML = `
            <div class="search-container">
                <div class="search-box">
                    <input type="text" placeholder="请输入分类号或关键词..." class="search-input">
                    <button class="search-button">搜索</button>
                </div>
                <div class="search-results"></div>
            </div>
        `;

        // 获取DOM元素
        this.input = this.container.querySelector('.search-input');
        this.button = this.container.querySelector('.search-button');
        this.resultsContainer = this.container.querySelector('.search-results');

        // 绑定事件
        this.button.addEventListener('click', () => this.handleSearch());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
    }

    async handleSearch() {
        const query = this.input.value.trim();
        if (!query) return;

        const results = await this.search(query);
        this.displayResults(results);
    }

    async search(query) {
        // 导入搜索函数
        const { searchAll } = await import('./data.js');
        return searchAll(query);
    }

    displayResults(results) {
        if (results.length === 0) {
            this.resultsContainer.innerHTML = '<div class="no-results">未找到相关结果</div>';
            return;
        }

        const html = results.map(result => {
            if (result.type === 'ipc') {
                return `
                    <div class="result-item" data-code="${result.code}">
                        <div class="result-title">${result.title}</div>
                        <div class="result-match">匹配类型: ${result.matchType}</div>
                        <div class="result-desc">${result.description}</div>
                    </div>
                `;
            } else {
                return `
                    <div class="result-item" data-id="${result.id}">
                        <div class="result-title">${result.industry}</div>
                        <div class="result-match">匹配类型: ${result.matchType}</div>
                    </div>
                `;
            }
        }).join('');

        this.resultsContainer.innerHTML = html;

        // 添加点击事件
        this.resultsContainer.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => this.handleResultClick(item));
        });
    }

    handleResultClick(item) {
        const code = item.dataset.code;
        const id = item.dataset.id;
        
        if (code) {
            // 跳转到IPC分类号位置
            const element = document.querySelector(`[data-ipc="${code}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                element.classList.add('highlight');
                setTimeout(() => element.classList.remove('highlight'), 2000);
            }
        } else if (id) {
            // 跳转到产业分类位置
            const element = document.querySelector(`[data-industry="${id}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                element.classList.add('highlight');
                setTimeout(() => element.classList.remove('highlight'), 2000);
            }
        }
    }
}

export default SearchComponent; 