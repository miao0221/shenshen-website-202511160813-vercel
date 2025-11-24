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
export class ParticleSystem {
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

// 初始化全局粒子系统
export function initGlobalParticleSystem() {
    // 检查粒子画布是否已存在
    let canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        // 创建粒子画布（如果不存在）
        canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        document.body.appendChild(canvas);
    }
    
    // 创建粒子系统实例
    return new ParticleSystem();
}