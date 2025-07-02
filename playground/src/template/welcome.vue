<template>
    <div class="welcome">
        <div class="logo">
            <h1>🎯 EwVueComponent</h1>
            <p class="subtitle">强大的Vue组件动态渲染库</p>
        </div>

        <div class="features">
            <div class="feature">
                <h3>💡 智能渲染</h3>
                <p>支持动态组件渲染和切换</p>
            </div>
            <div class="feature">
                <h3>🔧 易于使用</h3>
                <p>简单的API，开箱即用</p>
            </div>
            <div class="feature">
                <h3>⚡ 高性能</h3>
                <p>优化的渲染性能</p>
            </div>
        </div>

        <div class="get-started">
            <p>👈 从左侧选择示例开始体验</p>
        </div>
    </div>
</template>

<style scoped>
.welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 40px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    text-align: center;
}

.logo h1 {
    color: #42b883;
    font-size: 3em;
    margin: 0 0 10px 0;
    font-weight: 700;
}

.subtitle {
    color: #666;
    font-size: 1.2em;
    margin-bottom: 40px;
}

.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    max-width: 400px;
    margin-bottom: 40px;
}

.feature {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.feature:hover {
    transform: translateY(-2px);
}

.feature h3 {
    color: #2d3748;
    margin: 0 0 10px 0;
    font-size: 1.1em;
}

.feature p {
    color: #666;
    margin: 0;
    line-height: 1.5;
}

.get-started {
    background: #42b883;
    color: white;
    padding: 15px 30px;
    border-radius: 8px;
    font-weight: 600;
}

.get-started p {
    margin: 0;
}
</style>