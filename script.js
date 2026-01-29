const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.querySelector(".palette-container");

generateBtn.addEventListener("click", generatePalette);

paletteContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("copy-btn")) {
    const hexValue = e.target.previousElementSibling.textContent;

    navigator.clipboard
        .writeText(hexValue)
        .then(() => showCopySuccess(e.target))
        .catch((err) => console.log(err));
    } else if (e.target.classList.contains("color")) {
    const hexValue = e.target.nextElementSibling.querySelector(".hex-value").textContent;
    navigator.clipboard
        .writeText(hexValue)
        .then(() => showCopySuccess(e.target.nextElementSibling.querySelector(".copy-btn")))
        .catch((err) => console.log(err));
    }
});

function showCopySuccess(element) {
    element.classList.remove("far", "fa-copy");
    element.classList.add("fas", "fa-check");

    element.style.color = "#48bb78";

    setTimeout(() => {
        element.classList.remove("fas", "fa-check");
        element.classList.add("far", "fa-copy");
        element.style.color = "";
    }, 1500);
}

function generatePalette() {
    // Generate a random base color
    const baseColor = generateRandomColor();
    
    // Convert hex to RGB
    const rgb = hexToRgb(baseColor);
    
    // Convert RGB to HSL to manipulate lightness
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Create 5 shades from dark to light
    const colors = generateShades(hsl);
    
    // Convert HSL shades back to hex
    const hexColors = colors.map(hslColor => hslToHex(hslColor.h, hslColor.s, hslColor.l));
    
    updatePaletteDisplay(hexColors);
}

function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
        return color;
}

// Generate 5 shades from dark to light based on a base HSL color
function generateShades(baseHsl) {
    const shades = [];
    const lightnessValues = [20, 35, 50, 65, 80]; // Dark to light percentages
    
    for (let lightness of lightnessValues) {
        shades.push({
            h: baseHsl.h,
            s: baseHsl.s,
            l: lightness
        });
    }
    
    return shades;
}

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Convert HSL to Hex
function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function updatePaletteDisplay(colors) {
    const colorBoxes = document.querySelectorAll(".color-box");

    colorBoxes.forEach((box, index) => {
    const color = colors[index];
    const colorDiv = box.querySelector(".color");
    const hexValue = box.querySelector(".hex-value");

    // Add animation class
    colorDiv.classList.add('color-updated');
    
    // Smooth transition for color change
    setTimeout(() => {
        colorDiv.style.backgroundColor = color;
    }, 50);
    
    hexValue.textContent = color;
    
    // Remove animation class after animation completes
    setTimeout(() => {
        colorDiv.classList.remove('color-updated');
    }, 600);
    });
}

// Trigger page load animation
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to body after a short delay
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Generate initial palette on load
    generatePalette();
});