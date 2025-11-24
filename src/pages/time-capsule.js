export function renderTimeCapsulePage() {
    return `
        <div class="page-container time-capsule-page">
            <h2>时间胶囊</h2>
            <p>这里记录着周深音乐旅程中的重要时刻和珍贵回忆。</p>
            
            <div class="timeline-container">
                <div class="timeline-wrapper">
                    <div class="timeline-line timeline-line-1"></div>
                    <div class="timeline-line timeline-line-2"></div>
                    <div class="timeline-line timeline-line-3"></div>
                    <div class="timeline-line timeline-line-4"></div>
                    <div class="timeline-line timeline-line-5"></div>
                    <div class="triangle-indicator"></div>
                    <div class="timeline-points" id="timeline-points">
                        <!-- 时间轴上的点将通过JS生成 -->
                    </div>
                </div>
            </div>
            
            <div class="main-content">
                <!-- 新增内容区域 -->
                <div class="content-section">
                    <div class="section-container">
                        <h2>什么是时光胶囊？</h2>
                        <p>时光胶囊是一种保存当前时刻信息的方式，将有价值的记忆、想法或物品封存起来，在未来某个特定时间重新开启。</p>
                        <p>这不仅仅是简单的存储，更是与未来自己的一次对话，一次跨越时空的心灵交流。</p>
                    </div>
                </div>
                
                <!-- 日历占位容器 -->
                <div class="calendar-wrapper">
                    <!-- 日历组件 -->
                    <div class="calendar-container" id="calendar-container">
                        <div class="calendar-header">
                            <span class="calendar-title">日历</span>
                            <button class="toggle-calendar" id="toggle-calendar">◀</button>
                        </div>
                        <div class="calendar-content" id="calendar-content">
                            <div class="calendar-nav">
                                <button class="nav-btn" id="prev-month">&lt;</button>
                                <span class="current-month" id="current-month">2023年6月</span>
                                <button class="nav-btn" id="next-month">&gt;</button>
                            </div>
                            <div class="calendar-grid">
                                <div class="weekdays">
                                    <div>日</div>
                                    <div>一</div>
                                    <div>二</div>
                                    <div>三</div>
                                    <div>四</div>
                                    <div>五</div>
                                    <div>六</div>
                                </div>
                                <div class="days-grid" id="days-grid">
                                    <!-- 日历日期将通过JS生成 -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 粒子类定义
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25; // 减慢速度
        this.speedY = Math.random() * 0.5 - 0.25; // 减慢速度
        
        // 初始位置存储，用于回到原位
        this.originX = this.x;
        this.originY = this.y;
        
        // 多种颜色选择，模拟真实星空中不同类型的星星
        const colors = [
            '255, 255, 255', // 白色
            '255, 255, 224', // 淡黄色
            '173, 216, 230', // 淡蓝色
            '255, 223, 186', // 橙色
            '221, 160, 221'  // 淡紫色
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.baseOpacity = Math.random() * 0.5 + 0.1;
        this.opacity = this.baseOpacity;
        
        // 闪烁相关属性
        this.oscillation = Math.random() * 0.05 + 0.01;
        this.angle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.05 + 0.01; // 不同的闪烁速度
        this.twinkleType = Math.floor(Math.random() * 3); // 不同的闪烁类型
        
        // 鼠标交互相关属性
        this.mouseEffect = 0; // 鼠标影响强度
        this.returnSpeed = 0.02 + Math.random() * 0.03; // 回到原位的速度
    }

    update(mouse) {
        // 更新位置
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检测
        if (this.x > this.canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > this.canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
        
        // 鼠标交互效果
        if (mouse.x !== undefined && mouse.y !== undefined) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                // 计算排斥力
                const force = (mouse.radius - distance) / mouse.radius;
                this.mouseEffect = force;
                
                // 应用排斥力
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * force * 5;
                this.y += Math.sin(angle) * force * 5;
            } else {
                // 逐渐减少鼠标影响
                this.mouseEffect *= 0.95;
                
                // 缓慢回到原始位置
                this.x += (this.originX - this.x) * this.returnSpeed;
                this.y += (this.originY - this.y) * this.returnSpeed;
            }
        }
        
        // 更复杂的闪烁效果
        this.angle += this.twinkleSpeed;
        
        switch(this.twinkleType) {
            case 0: // 平滑闪烁
                this.opacity = this.baseOpacity + Math.abs(Math.sin(this.angle)) * 0.4;
                break;
            case 1: // 脉冲闪烁
                this.opacity = this.baseOpacity + Math.pow(Math.abs(Math.sin(this.angle)), 5) * 0.5;
                break;
            case 2: // 随机闪烁
                this.opacity = this.baseOpacity + (Math.random() > 0.9 ? Math.random() * 0.5 : 0);
                break;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'rgba(' + this.color + ', ' + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 为较亮的粒子添加光晕效果
        if (this.opacity > 0.4) {
            const gradient = ctx.createRadialGradient(
                this.x, this.y, this.size,
                this.x, this.y, this.size * 2
            );
            gradient.addColorStop(0, 'rgba(' + this.color + ', ' + (this.opacity * 0.8) + ')');
            gradient.addColorStop(1, 'rgba(' + this.color + ', 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 粒子系统管理器
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.particles = [];
        this.mouse = {
            x: undefined,
            y: undefined,
            radius: 100
        };
        this.isVisible = true; // 控制粒子系统是否可见
        this.animationId = null; // 动画帧ID
        
        if (this.canvas && this.ctx) {
            this.init();
        }
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 鼠标事件监听
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseleave', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });
        
        // 创建粒子
        this.createParticles();
        
        // 启动动画循环
        this.animate();
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        if (!this.canvas) return;
        // 减少粒子数量到原来的1/3
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 9000);
        this.particles = []; // 清空现有粒子
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    handleMouseInteraction() {
        // 鼠标交互现在在粒子的update方法中处理
    }

    // 只绘制视口内的粒子以提高性能
    drawVisibleParticles() {
        if (!this.ctx || !this.canvas) return;
        
        // 获取视口尺寸
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 更新和绘制所有在视口内的粒子
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            // 只绘制在视口内的粒子（增加一些边距）
            if (particle.x >= -50 && particle.x <= viewportWidth + 50 && 
                particle.y >= -50 && particle.y <= viewportHeight + 50) {
                particle.update(this.mouse);
                particle.draw(this.ctx);
            }
        }
    }

    animate() {
        if (!this.ctx || !this.canvas || !this.isVisible) return;
        
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制可见粒子
        this.drawVisibleParticles();
        
        // 继续动画循环
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // 暂停动画
    pause() {
        this.isVisible = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    // 恢复动画
    resume() {
        this.isVisible = true;
        if (!this.animationId) {
            this.animate();
        }
    }
    
    // 销毁粒子系统
    destroy() {
        this.pause();
        this.particles = [];
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// 时间轴类
class Timeline {
    constructor() {
        this.pointsContainer = document.getElementById('timeline-points');
        this.timelineWrapper = document.querySelector('.timeline-wrapper');
        this.activePoint = null;
        this.currentPosition = 0;
        this.pointSpacing = 120; // 点之间的间距
        this.isDragging = false;
        this.startX = 0;
        this.startPosition = 0;
        this.indicator = document.querySelector('.triangle-indicator');
        this.allPointsData = []; // 存储所有点的数据
        this.visiblePoints = new Set(); // 存储当前可见的点
        this.init();
    }

    init() {
        if (this.pointsContainer && this.timelineWrapper) {
            this.generatePointsData(); // 仅生成数据
            this.renderVisiblePoints(); // 仅渲染可见点
            this.bindEvents();
            
            // 初始化时更新指示器位置
            setTimeout(() => {
                this.updateIndicatorPosition();
            }, 100);
            
            // 监听窗口大小变化，更新指示器位置
            window.addEventListener('resize', () => {
                this.updateIndicatorPosition();
            });
            
            // 监听滚动事件以更新可见点
            this.timelineWrapper.addEventListener('scroll', () => {
                this.renderVisiblePoints();
            });
        }
    }

    generatePointsData() {
        const today = new Date();
        const totalDays = 200; // 总共显示200天
        
        // 定义音符字符
        const musicalNotes = ["♪", "♫", "♩", "♬", "♭", "♮", "♯"];
        
        // 生成点数据
        for (let i = -100; i <= 100; i++) {
            const pointDate = new Date(today);
            pointDate.setDate(today.getDate() + i);
            
            // 计算点的位置
            const position = (i + 100) * this.pointSpacing;
            
            // 添加随机音符样式
            const randomNote = musicalNotes[Math.floor(Math.random() * musicalNotes.length)];
            
            // 添加日期数据（统一使用 YYYY-MM-DD 格式用于匹配）
            const dateStr = `${pointDate.getFullYear()}-${String(pointDate.getMonth() + 1).padStart(2, '0')}-${String(pointDate.getDate()).padStart(2, '0')}`;
            
            this.allPointsData.push({
                position,
                note: randomNote,
                date: dateStr,
                dateObj: pointDate
            });
        }
        
        // 设置容器宽度，确保有足够的空间容纳所有点
        this.pointsContainer.style.width = `${(totalDays + 1) * this.pointSpacing}px`;
    }
    
    renderVisiblePoints() {
        if (!this.pointsContainer) return;
        
        // 获取时间轴容器的宽度
        const containerWidth = this.timelineWrapper.offsetWidth;
        
        // 获取当前滚动位置
        const scrollPosition = -this.currentPosition;
        
        // 计算可见范围
        const visibleStart = scrollPosition - containerWidth;
        const visibleEnd = scrollPosition + containerWidth * 2;
        
        // 找出所有在可见范围内的点
        const newVisiblePoints = new Set();
        this.allPointsData.forEach((pointData, index) => {
            if (pointData.position >= visibleStart && pointData.position <= visibleEnd) {
                newVisiblePoints.add(index);
            }
        });
        
        // 找出需要添加和移除的点
        const pointsToAdd = [...newVisiblePoints].filter(index => !this.visiblePoints.has(index));
        const pointsToRemove = [...this.visiblePoints].filter(index => !newVisiblePoints.has(index));
        
        // 移除不在可见范围内的点
        pointsToRemove.forEach(index => {
            const point = this.pointsContainer.querySelector(`[data-index="${index}"]`);
            if (point) {
                this.pointsContainer.removeChild(point);
            }
        });
        
        // 获取需要渲染的点数据
        const pointsToRender = pointsToAdd.map(index => ({
            index,
            data: this.allPointsData[index]
        }));
        
        // 添加新的可见点
        pointsToRender.forEach(({index, data}) => {
            const point = document.createElement('div');
            point.className = 'timeline-point';
            point.style.left = `${data.position}px`;
            point.setAttribute('data-position', data.position);
            point.setAttribute('data-note', data.note);
            // 使用transform进行精确的垂直居中，确保与五线谱的第三线完美对齐
            point.style.top = '50%';
            point.style.transform = 'translateY(-50%)';
            point.setAttribute('data-date', data.date);
            point.setAttribute('data-index', index);
            
            // 使用CSS变量设置音符内容，便于样式控制
            point.style.setProperty('--note-content', `"${data.note}"`);
            point.setAttribute('data-note', data.note);
            
            // 添加鼠标悬停事件
            point.addEventListener('mouseenter', (e) => {
                const displayDateStr = `${data.dateObj.getFullYear()}/${String(data.dateObj.getMonth() + 1).padStart(2, '0')}/${String(data.dateObj.getDate()).padStart(2, '0')}`;
                e.target.setAttribute('data-date-display', displayDateStr);
                e.target.style.setProperty('--display-date', `"${displayDateStr}"`);
            });
            
            // 添加点击事件
            point.addEventListener('click', (e) => {
                this.selectPoint(e.target);
                // 触发日历更新
                window.dispatchEvent(new CustomEvent('timelineDateSelected', { 
                    detail: { date: data.dateObj }
                }));
                // 滑动到中心
                this.scrollToCenter(point);
            });
            
            this.pointsContainer.appendChild(point);
        });
        
        // 更新可见点集合
        this.visiblePoints = newVisiblePoints;
    }
    
    bindEvents() {
        if (!this.timelineWrapper) return;
        
        // 鼠标拖动事件
        this.timelineWrapper.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX;
            this.startPosition = this.currentPosition;
            this.timelineWrapper.style.cursor = 'grabbing';
            e.preventDefault();
            e.stopPropagation();
        });
        
        // 触摸事件处理，防止页面滚动
        this.timelineWrapper.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.startPosition = this.currentPosition;
            this.timelineWrapper.style.cursor = 'grabbing';
            e.preventDefault();
            e.stopPropagation();
        });
        
        this.timelineWrapper.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            const dx = e.touches[0].clientX - this.startX;
            this.currentPosition = this.startPosition + dx;
            
            // 限制拖动范围
            const containerWidth = this.timelineWrapper.offsetWidth;
            const contentWidth = this.pointsContainer.offsetWidth;
            const maxScroll = Math.max(0, contentWidth - containerWidth);
            
            this.currentPosition = Math.max(-maxScroll, Math.min(0, this.currentPosition));
            
            // 应用变换
            this.pointsContainer.style.transform = 'translateX(' + this.currentPosition + 'px)';
            e.preventDefault();
            e.stopPropagation();
        });
        
        this.timelineWrapper.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const dx = e.clientX - this.startX;
            this.currentPosition = this.startPosition + dx;
            
            // 限制拖动范围
            const containerWidth = this.timelineWrapper.offsetWidth;
            const contentWidth = this.pointsContainer.offsetWidth;
            const maxScroll = Math.max(0, contentWidth - containerWidth);
            
            this.currentPosition = Math.max(-maxScroll, Math.min(0, this.currentPosition));
            
            // 应用变换
            this.pointsContainer.style.transform = 'translateX(' + this.currentPosition + 'px)';
            e.preventDefault();
            e.stopPropagation();
        });
        
        this.timelineWrapper.addEventListener('mouseup', (e) => {
            this.isDragging = false;
            this.timelineWrapper.style.cursor = 'grab';
            e.stopPropagation();
        });
        
        // 防止鼠标移出页面时仍然保持拖动状态
        this.timelineWrapper.addEventListener('mouseleave', (e) => {
            this.isDragging = false;
            this.timelineWrapper.style.cursor = 'grab';
            e.stopPropagation();
        });
    }
    
    selectPoint(point) {
        // 移除之前选中点的激活状态
        if (this.activePoint) {
            this.activePoint.classList.remove('active');
        }
        
        // 设置新的激活点
        this.activePoint = point;
        point.classList.add('active');
        
        // 更新指示器位置
        this.updateIndicatorPosition();
    }
    
    // 滑动到中心
    scrollToCenter(point) {
        if (!this.pointsContainer || !this.timelineWrapper) return;
        
        // 获取时间轴容器的宽度
        const containerWidth = this.timelineWrapper.offsetWidth;
        
        // 获取点在容器中的位置（相对于容器）
        const pointPosition = parseFloat(point.getAttribute('data-position'));
        
        // 计算需要移动的距离，使点居中
        const scrollPosition = -(pointPosition - containerWidth / 2);
        
        // 限制滚动范围
        const contentWidth = this.pointsContainer.offsetWidth;
        const maxScroll = Math.max(0, contentWidth - containerWidth);
        this.currentPosition = Math.max(-maxScroll, Math.min(0, scrollPosition));
        
        // 平滑滚动到中心位置
        this.pointsContainer.style.transition = 'transform 0.3s ease';
        this.pointsContainer.style.transform = 'translateX(' + this.currentPosition + 'px)';
        
        // 动画结束后更新指示标位置并移除过渡效果
        setTimeout(() => {
            this.pointsContainer.style.transition = '';
            this.updateIndicatorPosition();
        }, 300);
    }
    
    updateIndicatorPosition() {
        if (!this.indicator) return;
        
        // 获取时间轴容器的宽度
        const containerWidth = this.timelineWrapper.offsetWidth;
        
        // 计算指示标应该在容器中的位置（始终居中）
        const indicatorLeft = containerWidth / 2;
        
        // 使用 Math.round 确保像素对齐，避免模糊
        this.indicator.style.left = '' + Math.round(indicatorLeft) + 'px';
        this.indicator.style.top = '-25px';
        
        // 确保指示标可见
        this.indicator.style.display = 'block';
        this.indicator.style.visibility = 'visible';
        this.indicator.style.opacity = '1';
    }
    
    selectPointByDate(date) {
        if (!this.pointsContainer) return;
        
        // 统一使用 YYYY-MM-DD 格式进行匹配
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        // 查找匹配的点数据
        const matchedPointData = this.allPointsData.find(pointData => 
            pointData.date === dateStr
        );
        
        if (matchedPointData) {
            // 确保该点可见
            this.renderVisiblePoints();
            
            // 查找DOM元素
            const pointIndex = this.allPointsData.indexOf(matchedPointData);
            const pointElement = this.pointsContainer.querySelector(`[data-index="${pointIndex}"]`);
            
            // 如果找到了匹配的点，则选中它并滑动到中心
            if (pointElement) {
                this.selectPoint(pointElement);
                this.scrollToCenter(pointElement);
            } else {
                // 如果没有找到匹配的点，取消当前选中状态
                if (this.activePoint) {
                    this.activePoint.classList.remove('active');
                    this.activePoint = null;
                }
            }
        } else {
            // 如果没有找到匹配的点，取消当前选中状态
            if (this.activePoint) {
                this.activePoint.classList.remove('active');
                this.activePoint = null;
            }
        }
    }
}

// 日历类
class Calendar {
    constructor(timeline) {
        this.timeline = timeline;
        this.currentDate = new Date();
        this.displayMonth = this.currentDate.getMonth();
        this.displayYear = this.currentDate.getFullYear();
        this.selectedDate = null;
        this.isRendered = false; // 标记是否已渲染
        this.init();
    }
    
    init() {
        // 延迟初始化直到需要时
        this.bindEvents();
    }
    
    bindEvents() {
        // 使用事件委托处理日历事件
        document.addEventListener('click', (e) => {
            // 处理上个月按钮
            if (e.target.id === 'prev-month') {
                this.changeMonth(-1);
                e.preventDefault();
            }
            
            // 处理下个月按钮
            if (e.target.id === 'next-month') {
                this.changeMonth(1);
                e.preventDefault();
            }
            
            // 处理日历切换按钮
            if (e.target.id === 'toggle-calendar') {
                const calendarContainer = document.getElementById('calendar-container');
                if (calendarContainer) {
                    calendarContainer.classList.toggle('collapsed');
                }
                e.preventDefault();
            }
            
            // 处理日期点击
            if (e.target.classList.contains('day') && e.target.dataset.date) {
                const dateStr = e.target.dataset.date;
                const [year, month, day] = dateStr.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                this.selectDate(date);
                e.preventDefault();
            }
        });
        
        // 监听时间轴选择事件
        window.addEventListener('timelineDateSelected', (e) => {
            this.selectDate(e.detail.date);
        });
    }
    
    // 按需渲染日历
    renderIfNeeded() {
        if (!this.isRendered) {
            this.renderCalendar();
            this.isRendered = true;
        }
    }
    
    changeMonth(delta) {
        this.displayMonth += delta;
        if (this.displayMonth > 11) {
            this.displayMonth = 0;
            this.displayYear++;
        } else if (this.displayMonth < 0) {
            this.displayMonth = 11;
            this.displayYear--;
        }
        this.renderCalendar();
    }
    
    renderCalendar() {
        const currentMonthElement = document.getElementById('current-month');
        const daysGrid = document.getElementById('days-grid');
        
        if (!currentMonthElement || !daysGrid) return;
        
        // 更新月份显示
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月',
                           '7月', '8月', '9月', '10月', '11月', '12月'];
        currentMonthElement.textContent = `${this.displayYear}年 ${monthNames[this.displayMonth]}`;
        
        // 获取该月第一天和最后一天
        const firstDay = new Date(this.displayYear, this.displayMonth, 1);
        const lastDay = new Date(this.displayYear, this.displayMonth + 1, 0);
        
        // 获取该月第一天是星期几
        const firstDayOfWeek = firstDay.getDay();
        
        // 获取上个月的最后一天
        const prevMonthLastDay = new Date(this.displayYear, this.displayMonth, 0).getDate();
        
        // 清空日历网格
        daysGrid.innerHTML = '';
        
        // 添加上个月的日期
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day other-month';
            dayElement.textContent = prevMonthLastDay - i;
            dayElement.dataset.date = `${(this.displayMonth === 0 ? this.displayYear - 1 : this.displayYear)}-${String(this.displayMonth === 0 ? 12 : this.displayMonth).padStart(2, '0')}-${String(prevMonthLastDay - i).padStart(2, '0')}`;
            daysGrid.appendChild(dayElement);
        }
        
        // 添加当前月的日期
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day';
            dayElement.textContent = i;
            dayElement.dataset.date = `${this.displayYear}-${String(this.displayMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            
            // 标记今天
            const today = new Date();
            if (this.displayYear === today.getFullYear() && 
                this.displayMonth === today.getMonth() && 
                i === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // 标记选中的日期
            if (this.selectedDate && 
                this.displayYear === this.selectedDate.getFullYear() && 
                this.displayMonth === this.selectedDate.getMonth() && 
                i === this.selectedDate.getDate()) {
                dayElement.classList.add('selected');
            }
            
            daysGrid.appendChild(dayElement);
        }
        
        // 添加下个月的日期以填满网格
        const totalCells = 42; // 6行7列
        const remainingCells = totalCells - (firstDayOfWeek + lastDay.getDate());
        for (let i = 1; i <= remainingCells; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day other-month';
            dayElement.textContent = i;
            dayElement.dataset.date = `${(this.displayMonth === 11 ? this.displayYear + 1 : this.displayYear)}-${String(this.displayMonth === 11 ? 1 : this.displayMonth + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            daysGrid.appendChild(dayElement);
        }
    }
    
    selectDate(date) {
        this.selectedDate = date;
        
        // 更新日历视图
        this.displayMonth = date.getMonth();
        this.displayYear = date.getFullYear();
        
        // 确保日历已渲染
        this.renderIfNeeded();
        
        // 更新时间轴
        if (this.timeline) {
            this.timeline.selectPointByDate(date);
        }
    }
    
    markToday() {
        // 在初始化时选中今天
        this.selectDate(new Date());
    }
}

// 初始化时间轴和日历功能
export function initTimeCapsuleFeatures() {
    // 创建时间轴
    const timeline = new Timeline();
    
    // 创建日历
    const calendar = new Calendar(timeline);
    
    return { timeline, calendar };
}