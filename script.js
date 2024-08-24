// Скрытие меню "Пуск" по умолчанию
const startMenu = document.getElementById('start-menu');
const startButton = document.getElementById('start-button');
const taskbar = document.getElementById('taskbar');
const taskbarWindows = document.getElementById('taskbar-windows');
const desktop = document.getElementById('desktop');

// Обработка нажатия кнопки "Пуск"
startButton.addEventListener('click', function() {
    startMenu.style.display = startMenu.style.display === 'none' || startMenu.style.display === '' ? 'block' : 'none';
});

// Открытие окон при нажатии на иконки на рабочем столе или через меню "Пуск"
document.getElementById('my-computer').addEventListener('click', function() {
    openWindow('my-computer-window', 'Мой Компьютер');
});

document.getElementById('recycle-bin').addEventListener('click', function() {
    openWindow('recycle-bin-window', 'Корзина');
});

document.getElementById('calculator-option').addEventListener('click', function() {
    openWindow('calculator-window', 'Калькулятор');
});

document.getElementById('mini-game-option').addEventListener('click', function() {
    openWindow('mini-game-window', 'Мини-игра');
});

document.getElementById('settings-option').addEventListener('click', function() {
    openWindow('settings-window', 'Настройки');
});

document.getElementById('browser-icon').addEventListener('click', function() {
    openWindow('browser-window', 'Браузер');
});

document.getElementById('browser-option').addEventListener('click', function() {
    openWindow('browser-window', 'Браузер');
});

// Функция открытия окна
function openWindow(windowId, title) {
    const windowElement = document.getElementById(windowId);

    // Гарантируем, что окно открывается в изначальном (неразвернутом) размере
    windowElement.classList.remove('fullscreen');
    windowElement.style.width = windowElement.classList.contains('large-window') ? '400px' : '300px';
    windowElement.style.height = windowElement.id === 'settings-window' ? '500px' : (windowElement.classList.contains('large-window') ? '400px' : '200px');
    windowElement.style.top = '50px';
    windowElement.style.left = '50px';

    windowElement.style.display = 'block';

    // Проверка наличия окна на панели задач
    if (!isWindowInTaskbar(windowId)) {
        addToTaskbar(windowId, title);
    }

    // Функция закрытия окна
    windowElement.querySelector('.close-window').addEventListener('click', function() {
        windowElement.style.display = 'none';
        removeFromTaskbar(windowId);
    });

    // Функция уменьшения окна
    windowElement.querySelector('.minimize-window').addEventListener('click', function() {
        windowElement.style.display = 'none';
    });

    // Функция увеличения/уменьшения окна
    windowElement.querySelector('.maximize-window').addEventListener('click', function() {
        if (windowElement.classList.contains('fullscreen')) {
            windowElement.classList.remove('fullscreen');
            // Возврат окна в исходное положение и размер при уменьшении
            windowElement.style.width = windowElement.classList.contains('large-window') ? '400px' : '300px';
            windowElement.style.height = windowElement.classList.contains('large-window') ? '400px' : '200px';
            windowElement.style.top = '50px';
            windowElement.style.left = '50px';
            if (windowElement.id === 'browser-window') {
                document.getElementById('browser-frame').style.height = '400px';
            }
        } else {
            windowElement.classList.add('fullscreen');
            // Развертывание окна на весь экран
            windowElement.style.width = '100vw';
            windowElement.style.height = 'calc(100vh - 40px)';
            windowElement.style.top = '0';
            windowElement.style.left = '0';
            if (windowElement.id === 'browser-window') {
                document.getElementById('browser-frame').style.height = '600px';
            }
        }
    });

    // Реализуем перетаскивание окна
    let isDragging = false;
    let offsetX, offsetY;

    windowElement.querySelector('.window-header').addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging && !windowElement.classList.contains('fullscreen')) {
            windowElement.style.left = e.clientX - offsetX + 'px';
            windowElement.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
}

// Проверка, находится ли окно на панели задач
function isWindowInTaskbar(windowId) {
    return !!document.querySelector(`.taskbar-window[data-window-id="${windowId}"]`);
}

// Добавление окна на панель задач
function addToTaskbar(windowId, title) {
    let taskbarWindow = document.createElement('div');
    taskbarWindow.className = 'taskbar-window';
    taskbarWindow.innerText = title;
    taskbarWindow.dataset.windowId = windowId;

    // Обычный клик - разворачивает окно
    taskbarWindow.addEventListener('click', function() {
        let windowElement = document.getElementById(windowId);
        windowElement.style.display = 'block';
    });

    // ПКМ - закрыть окно
    taskbarWindow.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        let windowElement = document.getElementById(windowId);
        windowElement.style.display = 'none';
        removeFromTaskbar(windowId);
    });

    taskbarWindows.appendChild(taskbarWindow);
}

// Удаление окна с панели задач
function removeFromTaskbar(windowId) {
    let taskbarWindow = document.querySelector(`.taskbar-window[data-window-id="${windowId}"]`);
    if (taskbarWindow) {
        taskbarWindow.remove();
    }
}

// Показ файлов в "Мой компьютер"
document.getElementById('show-files').addEventListener('click', function() {
    const diskList = document.getElementById('disk-list');
    diskList.style.display = diskList.style.display === 'none' ? 'block' : 'none';
});

// Реализуем функционал "Мой компьютер" и "Корзина"
document.querySelectorAll('#disk-list .file').forEach(file => {
    file.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (confirm(`Удалить ${file.textContent}?`)) {
            document.getElementById('recycle-list').appendChild(file);
        }
    });
});

document.getElementById('restore-file').addEventListener('click', function() {
    const file = document.getElementById('recycle-list').lastElementChild;
    if (file) {
        document.getElementById('disk-list').appendChild(file);
    }
});

document.getElementById('delete-file').addEventListener('click', function() {
    const file = document.getElementById('recycle-list').lastElementChild;
    if (file) {
        file.remove();
    }
});

// Реализуем работу калькулятора
const calcDisplay = document.getElementById('calc-display');
let currentInput = '';
let operator = '';
let previousInput = '';

document.querySelectorAll('#calc-buttons button').forEach(button => {
    button.addEventListener('click', function() {
        const value = this.textContent;

        if (value === 'C') {
            // Очистка экрана калькулятора
            currentInput = '';
            operator = '';
            previousInput = '';
            calcDisplay.value = '';
        } else if (!isNaN(value) || value === '.') {
            currentInput += value;
            calcDisplay.value = currentInput;
        } else if (value === '=') {
            if (operator && previousInput !== '') {
                currentInput = eval(`${previousInput}${operator}${currentInput}`).toString();
                calcDisplay.value = currentInput;
                operator = '';
                previousInput = '';
            }
        } else {
            operator = value;
            previousInput = currentInput;
            currentInput = '';
        }
    });
});

// Мини-игра
const gameCanvas = document.getElementById('game-canvas');
const ctx = gameCanvas.getContext('2d');
let gameInterval;

document.getElementById('start-game').addEventListener('click', function() {
    clearInterval(gameInterval);
    let x = 150, y = 100, dx = 2, dy = 2, radius = 10;
    
    function drawBall() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();

        // Ошибка: мяч может вылетать за границы холста, надо бы исправить
        if (x + dx > gameCanvas.width - radius || x + dx < radius) {
            dx = -dx;
        }
        if (y + dy > gameCanvas.height - radius || y + dy < radius) {
            dy = -dy;
        }

        x += dx;
        y += dy;
    }

    gameInterval = setInterval(drawBall, 10);
});

// Настройки
document.getElementById('background-color-picker').addEventListener('input', function() {
    desktop.style.backgroundColor = this.value;
});

document.getElementById('system-color-picker').addEventListener('input', function() {
    taskbar.style.backgroundColor = this.value;
});

document.getElementById('taskbar-position').addEventListener('change', function() {
    if (this.value === 'top') {
        taskbar.style.top = '0';
        taskbar.style.bottom = '';
        desktop.style.height = 'calc(100% - 40px)';
    } else {
        taskbar.style.bottom = '0';
        taskbar.style.top = '';
        desktop.style.height = 'calc(100% - 40px)';
    }
});

// Установка пользовательских обоев
document.getElementById('background-image-picker').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            desktop.style.backgroundImage = `url(${event.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});

// Установка вида фона
document.getElementById('background-style').addEventListener('change', function() {
    const style = this.value;
    if (style === 'cover') {
        desktop.style.backgroundSize = 'cover';
        desktop.style.backgroundRepeat = 'no-repeat';
    } else if (style === 'contain') {
        desktop.style.backgroundSize = 'contain';
        desktop.style.backgroundRepeat = 'no-repeat';
    } else if (style === 'repeat') {
        desktop.style.backgroundSize = 'auto';
        desktop.style.backgroundRepeat = 'repeat';
    }
});

// Браузер
document.getElementById('browser-go').addEventListener('click', function() {
    const url = document.getElementById('browser-url').value;
    if (url) {
        const iframe = document.getElementById('browser-frame');
        
        // Изменяем высоту iframe в зависимости от размера окна
        if (document.getElementById('browser-window').classList.contains('fullscreen')) {
            iframe.style.height = '600px';
        } else {
            iframe.style.height = '300px';
        }

        iframe.src = url;
    }
});

const helpIcon = document.getElementById('help-icon');
const helpWindow = document.getElementById('help-window');

// Обработка нажатия на иконку справки
helpIcon.addEventListener('click', function() {
    helpWindow.style.display = 'block';
});

// Обработка закрытия окна справки
helpWindow.querySelector('.close-window').addEventListener('click', function() {
    helpWindow.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    const contextMenu = document.getElementById('context-menu');
    const desktop = document.getElementById('desktop');
    const folderNameInput = document.getElementById('folder-name');
    const createFolderButton = document.getElementById('create-folder');
    const folderWindowTemplate = document.getElementById('folder-window-template');

    const forbiddenWords = ['con', 'noob', 'idiot'];

    // Показ контекстного меню
    desktop.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
    });

    // Скрытие контекстного меню
    document.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    });

    // Создание папки
    createFolderButton.addEventListener('click', function() {
        const folderName = folderNameInput.value.trim();
        if (folderName === '') {
            alert('Имя папки не может быть пустым!');
            return;
        }

        if (forbiddenWords.some(word => folderName.toLowerCase().includes(word))) {
            alert('Это имя недопустимо!');
            return;
        }

        const folder = document.createElement('div');
        folder.className = 'icon folder';
        folder.textContent = folderName;
        desktop.appendChild(folder);

        // Скрытие контекстного меню и очистка ввода
        contextMenu.style.display = 'none';
        folderNameInput.value = '';
        
        // Добавление обработчика клика на папку
        folder.addEventListener('click', function() {
            openFolderWindow(folderName);
        });
    });

    /*function openFolderWindow(folderName) {
        const folderWindow = folderWindowTemplate.cloneNode(true);
        folderWindow.id = `folder-window-${folderName}`;
        folderWindow.querySelector('.window-title').textContent = folderName;

        // Добавление содержимого папки (пока пустое, можно добавить элементы)
        const folderContent = folderWindow.querySelector('#folder-content');
        // Можно добавить содержимое папки сюда

        document.body.appendChild(folderWindow);
        folderWindow.style.display = 'block';

        // Функции управления окном
        folderWindow.querySelector('.close-window').addEventListener('click', function() {
            folderWindow.style.display = 'none';
        });

        folderWindow.querySelector('.minimize-window').addEventListener('click', function() {
            folderWindow.style.display = 'none';
        });

        folderWindow.querySelector('.maximize-window').addEventListener('click', function() {
            if (folderWindow.classList.contains('fullscreen')) {
                folderWindow.classList.remove('fullscreen');
                folderWindow.style.width = '300px';
                folderWindow.style.height = '300px';
            } else {
                folderWindow.classList.add('fullscreen');
                folderWindow.style.width = '100vw';
                folderWindow.style.height = 'calc(100vh - 40px)';
            }
        });

        // Реализуем перетаскивание окна
        let isDragging = false;
        let offsetX, offsetY;

        folderWindow.querySelector('.window-header').addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - folderWindow.offsetLeft;
            offsetY = e.clientY - folderWindow.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging && !folderWindow.classList.contains('fullscreen')) {
                folderWindow.style.left = e.clientX - offsetX + 'px';
                folderWindow.style.top = e.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    }*/
});