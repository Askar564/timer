function getNextSeptemberFirst() {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Месяцы в JS с 0, сентябрь = 8
    const septemberFirstThisYear = new Date(currentYear, 8, 1, 0, 0, 0, 0);
    if (now < septemberFirstThisYear) {
        return septemberFirstThisYear;
    } else {
        return new Date(currentYear + 1, 8, 1, 0, 0, 0, 0);
    }
}

let customTarget = null;

function getTargetDate() {
    return customTarget || getNextSeptemberFirst();
}

function updateTargetLabel() {
    const label = document.getElementById('target-label');
    if (!label) return;
    if (customTarget) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        label.textContent = customTarget.toLocaleString('ru-RU', options);
    } else {
        label.textContent = '1 сентября';
    }
}

function updateTimer() {
    const now = new Date();
    const target = getTargetDate();
    const diff = target - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Проверяем, что элементы существуют на странице
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Генерация анимированных "искр"
document.addEventListener('DOMContentLoaded', () => {
    updateTimer();
    setInterval(updateTimer, 1000);
    const sparks = document.querySelector('.sparks');
    if (sparks) {
        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            // Случайные начальные и конечные координаты
            const x0 = Math.random() * 90;
            const y0 = Math.random() * 90;
            const x1 = Math.random() * 90;
            const y1 = Math.random() * 90;
            spark.style.setProperty('--x0', `${x0}vw`);
            spark.style.setProperty('--y0', `${y0}vh`);
            spark.style.setProperty('--x1', `${x1}vw`);
            spark.style.setProperty('--y1', `${y1}vh`);
            // Немного разной задержки для каждой искры
            spark.style.animationDelay = `${Math.random() * 2}s`;
            sparks.appendChild(spark);
        }
    }

    // Заполнить форму текущей датой по умолчанию
    const now = new Date();
    document.getElementById('year-input').value = now.getFullYear();
    document.getElementById('month-input').value = now.getMonth() + 1;
    document.getElementById('day-input').value = now.getDate();
    document.getElementById('hour-input').value = now.getHours();
    document.getElementById('minute-input').value = now.getMinutes();

    updateTargetLabel();
    updateTimer();
    setInterval(updateTimer, 1000);

    // Обработка формы выбора даты
    const form = document.getElementById('date-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const year = parseInt(document.getElementById('year-input').value, 10);
        const month = parseInt(document.getElementById('month-input').value, 10) - 1; // JS: 0-11
        const day = parseInt(document.getElementById('day-input').value, 10);
        const hour = parseInt(document.getElementById('hour-input').value, 10);
        const minute = parseInt(document.getElementById('minute-input').value, 10);

        // Проверка на валидность даты
        const candidate = new Date(year, month, day, hour, minute, 0, 0);
        if (
            candidate.getFullYear() === year &&
            candidate.getMonth() === month &&
            candidate.getDate() === day &&
            candidate.getHours() === hour &&
            candidate.getMinutes() === minute
        ) {
            customTarget = candidate;
            updateTargetLabel();
            updateTimer();
        } else {
            alert('Некорректная дата!');
        }
    });

    // Панель выбора даты (выдвижение)
    const panel = document.getElementById('date-panel');
    const toggle = document.getElementById('date-panel-toggle');
    if (panel && toggle) {
        toggle.addEventListener('click', () => {
            panel.classList.toggle('open');
        });
        // Автоматически закрывать при клике вне панели
        document.addEventListener('mousedown', (e) => {
            if (!panel.contains(e.target) && panel.classList.contains('open')) {
                panel.classList.remove('open');
            }
        });
    }

    // Воспроизвести неоновый звук при входе (3 сек)
    const neonAudio = document.getElementById('neon-audio');
    if (neonAudio) {
        neonAudio.src = "neon.mp3";
        neonAudio.load();

        const playNeon = () => {
            try {
                neonAudio.pause();
                neonAudio.currentTime = 0;
                neonAudio.volume = 1.0;
                const playPromise = neonAudio.play();
                if (playPromise && typeof playPromise.then === "function") {
                    playPromise.catch(() => {});
                }
                setTimeout(() => {
                    neonAudio.pause();
                    neonAudio.currentTime = 0;
                }, 3000);
            } catch (e) {
                // ignore
            }
        };

        // Всегда запускать при первом клике/тапе/клавише и при загрузке
        let played = false;
        const tryPlay = () => {
            playNeon();
            played = true;
        };
        // Попытка сразу (может не сработать из-за политики браузера)
        setTimeout(tryPlay, 100);

        document.body.addEventListener('pointerdown', tryPlay, { once: true });
        document.body.addEventListener('keydown', tryPlay, { once: true });

        // Воспроизводить звук при Ctrl+R (или Cmd+R)
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R')) {
                playNeon();
            }
        });
    }
});