// Лабораторна робота №4
// Робота з циклами, функціями та функціональними виразами в JavaScript.

const noiseLevels = [
    42, 55, 61, 78, 83, 67, 49, 72, 91, 58, 64, 76,
    53, 47, 88, 69, 74, 82, 95, 51, 71, -1, 85, 63,
    79, 39, 141, 86
];

const warningLevel = 70;
const criticalLevel = 85;
const minValidLevel = 30;
const maxValidLevel = 130;

// Перевірка коректності вимірювання.
function isValidLevel(level, min, max) {
    return Number.isFinite(level) && level >= min && level <= max;
}

// Function Declaration: середнє значення.
function calculateAverage(data, min, max) {
    let sum = 0;
    let count = 0;

    for (const level of data) {
        if (!isValidLevel(level, min, max)) {
            continue;
        }
        sum += level;
        count++;
    }

    return count === 0 ? null : sum / count;
}

// Function Expression: пошук мінімального значення.
const findMinimum = function (data, min, max) {
    let minimum = null;

    for (const level of data) {
        if (!isValidLevel(level, min, max)) {
            continue;
        }

        if (minimum === null || level < minimum) {
            minimum = level;
        }
    }

    return minimum;
};

// Function Expression: пошук максимального значення.
const findMaximum = function (data, min, max) {
    let maximum = null;

    for (const level of data) {
        if (!isValidLevel(level, min, max)) {
            continue;
        }

        if (maximum === null || level > maximum) {
            maximum = level;
        }
    }

    return maximum;
};

// Function Expression + callback.
// Передана функція викликається синхронно для кожного коректного вимірювання.
const processValidMeasurements = function (data, min, max, callback) {
    for (const level of data) {
        if (!isValidLevel(level, min, max)) {
            continue;
        }
        callback(level);
    }
};

// Arrow Function: один параметр.
const statusLabel = value => `Рівень: ${value} dB`;

// Arrow Function: кілька параметрів.
const isAbove = (value, threshold) => value > threshold;

// Підрахунок категорій.
const countByCategory = function (data, warning, critical, min, max) {
    let safe = 0;
    let warningCount = 0;
    let criticalCount = 0;
    let invalid = 0;
    let total = 0;
    let sum = 0;

    for (const level of data) {
        total++;

        if (!isValidLevel(level, min, max)) {
            invalid++;
            continue;
        }

        sum += level;

        if (level <= warning) {
            safe++;
        } else if (level <= critical) {
            warningCount++;
        } else {
            criticalCount++;
        }
    }

    return {
        total,
        valid: total - invalid,
        invalid,
        sum,
        safe,
        warning: warningCount,
        critical: criticalCount
    };
};

// Пошук першого критичного вимірювання за допомогою for + break.
function findFirstCritical(data, critical, min, max) {
    for (let i = 0; i < data.length; i++) {
        const level = data[i];

        if (!isValidLevel(level, min, max)) {
            continue;
        }

        if (level > critical) {
            return {
                value: level,
                position: i + 1
            };
        }

        // break виконається після знаходження критичного значення.
        // return одразу завершує функцію, тому нижче наведений алгоритм
        // фактично зупиняється на першому критичному записі.
    }

    return null;
}

// Пошук трьох безпечних вимірювань поспіль після першого критичного.
function findRecovery(data, critical, warning, min, max) {
    const firstCritical = findFirstCritical(data, critical, min, max);

    if (firstCritical === null) {
        return null;
    }

    let index = firstCritical.position; // наступний елемент після критичного
    let safeCount = 0;
    let thirdSafePosition = null;

    while (index < data.length) {
        const level = data[index];

        if (!isValidLevel(level, min, max) || level > warning) {
            safeCount = 0;
        } else {
            safeCount++;

            if (safeCount === 3) {
                thirdSafePosition = index + 1;
                break;
            }
        }

        index++;
    }

    return thirdSafePosition === null
        ? null
        : {
            position: thirdSafePosition,
            value: data[thirdSafePosition - 1]
        };
}

// Пошук першого коректного вимірювання за допомогою do...while.
function findFirstValid(data, min, max) {
    if (data.length === 0) {
        return null;
    }

    let index = 0;

    do {
        if (isValidLevel(data[index], min, max)) {
            return {
                value: data[index],
                position: index + 1
            };
        }

        index++;
    } while (index < data.length);

    return null;
}

// Перевірка серії через callback.
// Тут передається Function Expression без дужок виклику.
function analyzeWithCallback(data, min, max, handler) {
    processValidMeasurements(data, min, max, handler);
}

// Підсумковий аналіз.
const categories = countByCategory(
    noiseLevels,
    warningLevel,
    criticalLevel,
    minValidLevel,
    maxValidLevel
);

const average = calculateAverage(noiseLevels, minValidLevel, maxValidLevel);
const minimum = findMinimum(noiseLevels, minValidLevel, maxValidLevel);
const maximum = findMaximum(noiseLevels, minValidLevel, maxValidLevel);
const firstCritical = findFirstCritical(
    noiseLevels,
    criticalLevel,
    minValidLevel,
    maxValidLevel
);
const recovery = findRecovery(
    noiseLevels,
    criticalLevel,
    warningLevel,
    minValidLevel,
    maxValidLevel
);
const firstValid = findFirstValid(
    noiseLevels,
    minValidLevel,
    maxValidLevel
);

// Демонстрація синхронного callback.
let callbackCount = 0;
analyzeWithCallback(
    noiseLevels,
    minValidLevel,
    maxValidLevel,
    function (level) {
        callbackCount++;
    }
);

console.group("Акустична варта -- звіт моніторингу");

console.log(
    `Пороги: попередження > ${warningLevel} dB; критичний рівень > ${criticalLevel} dB`
);
console.log(`Усього вимірювань: ${categories.total}`);
console.log(`Коректних: ${categories.valid}`);
console.log(`Некоректних: ${categories.invalid}`);

console.table({
    "Без перевищення": categories.safe,
    "Попередження": categories.warning,
    "Критичні": categories.critical
});

console.log(
    `Середній рівень: ${average === null ? null : average.toFixed(2)} dB`
);
console.log(`Мінімальний рівень: ${minimum} dB`);
console.log(`Максимальний рівень: ${maximum} dB`);

if (firstCritical === null) {
    console.log("Перше критичне вимірювання: не знайдено");
} else {
    console.warn(
        `Перше критичне вимірювання: ${firstCritical.value} dB, позиція ${firstCritical.position}`
    );
}

if (recovery === null) {
    console.log(
        "Відновлення -- три безпечні вимірювання поспіль: не знайдено"
    );
} else {
    console.log(
        `Відновлення -- третє безпечне вимірювання: ${recovery.value} dB, позиція ${recovery.position}`
    );
}

console.log(`Поріг ${warningLevel} dB перевищено у ${categories.warning + categories.critical} вимірюваннях.`);

for (let i = 0; i < noiseLevels.length; i++) {
    if (!isValidLevel(noiseLevels[i], minValidLevel, maxValidLevel)) {
        console.error(
            `Некоректні дані: позиція ${i + 1} (${noiseLevels[i]} dB).`
        );
    }
}

console.log(
    `Перше коректне вимірювання: ${firstValid === null ? "не знайдено" : `${firstValid.value} dB, позиція ${firstValid.position}`}`
);

console.log(
    `Виконання callback: оброблено ${callbackCount} коректних вимірювань.`
);

console.log(
    `Приклад Arrow Function: ${statusLabel(noiseLevels[0])}; 86 > ${criticalLevel}: ${isAbove(86, criticalLevel)}`
);

console.log(
    `Висновок: зафіксовано ${categories.critical} критичних вимірювань; ` +
    (recovery === null
        ? "після першого з них стійкого відновлення не виявлено."
        : `відновлення знайдено на позиції ${recovery.position}.`)
);

console.groupEnd();

// Окремі тестові набори з умови.
console.group("Перевірка тестових наборів");

console.log("[]:", {
    average: calculateAverage([], minValidLevel, maxValidLevel),
    minimum: findMinimum([], minValidLevel, maxValidLevel),
    maximum: findMaximum([], minValidLevel, maxValidLevel),
    firstValid: findFirstValid([], minValidLevel, maxValidLevel)
});

console.log("[-1, 141]:", {
    categories: countByCategory(
        [-1, 141],
        warningLevel,
        criticalLevel,
        minValidLevel,
        maxValidLevel
    ),
    firstValid: findFirstValid([-1, 141], minValidLevel, maxValidLevel)
});

console.log("[70, 85, 86]:", {
    categories: countByCategory(
        [70, 85, 86],
        warningLevel,
        criticalLevel,
        minValidLevel,
        maxValidLevel
    ),
    firstCritical: findFirstCritical(
        [70, 85, 86],
        criticalLevel,
        minValidLevel,
        maxValidLevel
    )
});

console.log("Перевірка відновлення на серії [90, 65, 66, 67]:",
    findRecovery(
        [90, 65, 66, 67],
        criticalLevel,
        warningLevel,
        minValidLevel,
        maxValidLevel
    )
);

console.groupEnd();
