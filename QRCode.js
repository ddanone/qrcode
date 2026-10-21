/**
 * QRCode Generator - ISO/IEC 18004 compliant
 * 2026-002-03 1st version
 */
class QRCode {
    static EC_LEVELS = { L: 0, M: 1, Q: 2, H: 3 };
    static EC_CODEWORDS_PER_BLOCK = [
        [7, 10, 13, 17], [10, 16, 22, 28], [15, 26, 18, 22], [20, 18, 26, 16],
        [26, 24, 18, 22], [18, 16, 24, 28], [20, 18, 18, 26], [24, 22, 22, 26],
        [30, 22, 20, 24], [18, 26, 24, 28], [20, 30, 28, 24], [24, 22, 26, 28],
        [26, 22, 24, 22], [30, 24, 20, 24], [22, 24, 30, 24], [24, 28, 24, 30],
        [28, 28, 28, 28], [30, 26, 28, 28], [28, 26, 26, 26], [28, 26, 30, 28],
        [28, 26, 28, 30], [28, 28, 30, 24], [30, 28, 30, 30], [30, 28, 30, 30],
        [26, 28, 30, 30], [28, 28, 28, 30], [30, 28, 30, 30], [30, 28, 30, 30],
        [30, 28, 30, 30], [30, 28, 30, 30], [30, 28, 30, 30], [30, 28, 30, 30],
        [30, 28, 30, 30], [30, 28, 30, 30], [30, 28, 30, 30], [30, 28, 30, 30],
        [30, 28, 30, 30], [30, 28, 30, 30], [30, 28, 30, 30], [30, 28, 30, 30]
    ];
    
    static NUM_ERROR_CORRECTION_BLOCKS = [
        [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 2, 2], [1, 2, 2, 4],
        [1, 2, 4, 4], [2, 4, 4, 4], [2, 4, 6, 5], [2, 4, 6, 6],
        [2, 5, 8, 8], [4, 5, 8, 8], [4, 5, 8, 11], [4, 8, 10, 11],
        [4, 9, 12, 16], [4, 9, 16, 16], [6, 10, 12, 18], [6, 10, 17, 16],
        [6, 11, 16, 19], [6, 13, 18, 21], [7, 14, 21, 25], [8, 16, 20, 25],
        [8, 17, 23, 25], [9, 17, 23, 34], [9, 18, 25, 30], [10, 20, 27, 32],
        [12, 21, 29, 35], [12, 23, 34, 37], [12, 25, 34, 40], [13, 26, 35, 42],
        [14, 28, 38, 45], [15, 29, 40, 48], [16, 31, 43, 51], [17, 33, 45, 54],
        [18, 35, 48, 57], [19, 37, 51, 60], [19, 38, 53, 63], [20, 40, 56, 66],
        [21, 43, 59, 70], [22, 45, 62, 74], [24, 47, 65, 77], [25, 49, 68, 81]
    ];

    static BYTE_CAPACITY = [
        [17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34],
        [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84],
        [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155],
        [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250],
        [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382],
        [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511],
        [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658],
        [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842],
        [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051],
        [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]
    ];

    static ALIGNMENT_PATTERN_POSITIONS = [
        [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
        [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54],
        [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74],
        [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
    ];

    static EXP = new Uint8Array(512);
    static LOG = new Uint8Array(256);
    
    static {
        let x = 1;
        for (let i = 0; i < 255; i++) {
            QRCode.EXP[i] = x;
            QRCode.LOG[x] = i;
            x <<= 1;
            if (x >= 256) x ^= 0x11d;
        }
        for (let i = 255; i < 512; i++) QRCode.EXP[i] = QRCode.EXP[i - 255];
    }

    constructor(text, options = {}) {
        this.text = text;
        this.ecLevel = QRCode.EC_LEVELS[options.ecLevel] ?? QRCode.EC_LEVELS.M;
        this.version = this._findVersion();
        this.size = this.version * 4 + 17;
        
        this.modules = Array.from({ length: this.size }, () => Array(this.size).fill(false));
        this.isFunction = Array.from({ length: this.size }, () => Array(this.size).fill(false));
        
        this._drawFunctionPatterns();
        const allCodewords = this._encodeSegments();
        this._drawCodewords(allCodewords);
        
        if (options.mask !== undefined && options.mask >= 0 && options.mask <= 7) {
            this._applyMask(options.mask);
            this._drawFormatBits(options.mask);
        } else {
            const mask = this._findBestMask();
            this._applyMask(mask);
            this._drawFormatBits(mask);
        }
        
        if (this.version >= 7) this._drawVersionBits();
    }

    _findVersion() {
        const dataLen = new TextEncoder().encode(this.text).length;
        for (let v = 1; v <= 40; v++) {
            if (QRCode.BYTE_CAPACITY[v - 1][this.ecLevel] >= dataLen) return v;
        }
        throw new Error('Data too long');
    }

    _getNumDataCodewords() {
        const total = Math.floor(this._getNumRawDataModules() / 8);
        const ecPerBlock = QRCode.EC_CODEWORDS_PER_BLOCK[this.version - 1][this.ecLevel];
        const numBlocks = QRCode.NUM_ERROR_CORRECTION_BLOCKS[this.version - 1][this.ecLevel];
        return total - ecPerBlock * numBlocks;
    }

    _getNumRawDataModules() {
        let result = (16 * this.version + 128) * this.version + 64;
        if (this.version >= 2) {
            const numAlign = Math.floor(this.version / 7) + 2;
            result -= (25 * numAlign - 10) * numAlign - 55;
            if (this.version >= 7) result -= 36;
        }
        return result;
    }

    _drawFunctionPatterns() {
        // Separators around finder patterns
        for (let i = 0; i < 8; i++) {
            this._setFunctionModule(i, 7, false);
            this._setFunctionModule(7, i, false);
            this._setFunctionModule(this.size - 8, i, false);
            this._setFunctionModule(this.size - 1 - i, 7, false);
            this._setFunctionModule(i, this.size - 8, false);
            this._setFunctionModule(7, this.size - 1 - i, false);
        }
        
        // Finder patterns
        this._drawFinderPattern(0, 0);
        this._drawFinderPattern(this.size - 7, 0);
        this._drawFinderPattern(0, this.size - 7);
        
        // Alignment patterns
        const alignPos = QRCode.ALIGNMENT_PATTERN_POSITIONS[this.version - 1];
        for (let i = 0; i < alignPos.length; i++) {
            for (let j = 0; j < alignPos.length; j++) {
                const x = alignPos[j], y = alignPos[i];
                if ((x <= 8 && y <= 8) || (x <= 8 && y >= this.size - 9) || (x >= this.size - 9 && y <= 8)) continue;
                this._drawAlignmentPattern(x, y);
            }
        }
        
        // Timing patterns
        for (let i = 8; i < this.size - 8; i++) {
            this._setFunctionModule(i, 6, i % 2 === 0);
            this._setFunctionModule(6, i, i % 2 === 0);
        }
        
        // Dark module
        this._setFunctionModule(8, 4 * this.version + 9, true);
        
        // Reserve format areas
        for (let i = 0; i < 9; i++) { this.isFunction[8][i] = true; this.isFunction[i][8] = true; }
        for (let i = 0; i < 8; i++) { this.isFunction[8][this.size - 1 - i] = true; this.isFunction[this.size - 1 - i][8] = true; }
        
        // Reserve version areas
        if (this.version >= 7) {
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 3; j++) {
                    this.isFunction[i][this.size - 11 + j] = true;
                    this.isFunction[this.size - 11 + j][i] = true;
                }
            }
        }
    }

    _drawFinderPattern(x, y) {
        for (let dy = 0; dy < 7; dy++) {
            for (let dx = 0; dx < 7; dx++) {
                const dist = Math.max(Math.abs(dx - 3), Math.abs(dy - 3));
                this._setFunctionModule(x + dx, y + dy, dist !== 2);
            }
        }
    }

    _drawAlignmentPattern(cx, cy) {
        for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
                this._setFunctionModule(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
            }
        }
    }

    _setFunctionModule(x, y, isDark) {
        this.modules[y][x] = isDark;
        this.isFunction[y][x] = true;
    }

    _encodeSegments() {
        const data = new TextEncoder().encode(this.text);
        const bb = [];
        
        bb.push(0, 1, 0, 0);
        const ccBits = this.version <= 9 ? 8 : 16;
        for (let i = ccBits - 1; i >= 0; i--) bb.push((data.length >> i) & 1);
        for (const byte of data) for (let i = 7; i >= 0; i--) bb.push((byte >> i) & 1);
        
        const capacity = this._getNumDataCodewords() * 8;
        const termLen = Math.min(4, capacity - bb.length);
        for (let i = 0; i < termLen; i++) bb.push(0);
        while (bb.length % 8 !== 0) bb.push(0);
        
        const padBytes = [0xEC, 0x11];
        for (let i = 0; bb.length < capacity; i++) {
            for (let j = 7; j >= 0; j--) bb.push((padBytes[i % 2] >> j) & 1);
        }
        
        const dataCodewords = [];
        for (let i = 0; i < bb.length; i += 8) {
            let byte = 0;
            for (let j = 0; j < 8; j++) byte = (byte << 1) | bb[i + j];
            dataCodewords.push(byte);
        }
        
        return this._addEccAndInterleave(dataCodewords);
    }

    _addEccAndInterleave(data) {
        const numBlocks = QRCode.NUM_ERROR_CORRECTION_BLOCKS[this.version - 1][this.ecLevel];
        const blockEccLen = QRCode.EC_CODEWORDS_PER_BLOCK[this.version - 1][this.ecLevel];
        const rawCodewords = Math.floor(this._getNumRawDataModules() / 8);
        const numShortBlocks = numBlocks - rawCodewords % numBlocks;
        const shortBlockDataLen = Math.floor(rawCodewords / numBlocks) - blockEccLen;
        
        const rsDiv = this._reedSolomonComputeDivisor(blockEccLen);
        const blocks = [];
        
        let k = 0;
        for (let i = 0; i < numBlocks; i++) {
            const datLen = shortBlockDataLen + (i < numShortBlocks ? 0 : 1);
            const dat = data.slice(k, k + datLen);
            k += datLen;
            const ecc = this._reedSolomonComputeRemainder(dat, rsDiv);
            blocks.push({ data: dat, ecc: ecc });
        }
        
        // Interleave data codewords
        const result = [];
        for (let i = 0; i < shortBlockDataLen + 1; i++) {
            for (let j = 0; j < numBlocks; j++) {
                // Skip the padding position in short blocks
                if (i < shortBlockDataLen || j >= numShortBlocks) {
                    result.push(blocks[j].data[i < blocks[j].data.length ? i : blocks[j].data.length - 1]);
                }
            }
        }
        
        // Interleave EC codewords
        for (let i = 0; i < blockEccLen; i++) {
            for (let j = 0; j < numBlocks; j++) {
                result.push(blocks[j].ecc[i]);
            }
        }
        
        return result;
    }

    _reedSolomonComputeDivisor(degree) {
        const result = Array(degree).fill(0);
        result[degree - 1] = 1;
        let root = 1;
        for (let i = 0; i < degree; i++) {
            for (let j = 0; j < result.length; j++) {
                result[j] = this._reedSolomonMultiply(result[j], root);
                if (j + 1 < result.length) result[j] ^= result[j + 1];
            }
            root = this._reedSolomonMultiply(root, 2);
        }
        return result;
    }

    _reedSolomonComputeRemainder(data, divisor) {
        const result = Array(divisor.length).fill(0);
        for (const b of data) {
            const factor = b ^ result.shift();
            result.push(0);
            for (let i = 0; i < divisor.length; i++) result[i] ^= this._reedSolomonMultiply(divisor[i], factor);
        }
        return result;
    }

    _reedSolomonMultiply(x, y) {
        if (x === 0 || y === 0) return 0;
        return QRCode.EXP[QRCode.LOG[x] + QRCode.LOG[y]];
    }

    _drawCodewords(data) {
        let i = 0;
        for (let right = this.size - 1; right >= 1; right -= 2) {
            if (right === 6) right = 5;
            for (let vert = 0; vert < this.size; vert++) {
                for (let j = 0; j < 2; j++) {
                    const x = right - j;
                    const upward = ((right + 1) & 2) === 0;
                    const y = upward ? this.size - 1 - vert : vert;
                    if (!this.isFunction[y][x] && i < data.length * 8) {
                        this.modules[y][x] = ((data[Math.floor(i / 8)] >> (7 - (i % 8))) & 1) !== 0;
                        i++;
                    }
                }
            }
        }
    }

    _applyMask(mask) {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.isFunction[y][x]) continue;
                let invert;
                switch (mask) {
                    case 0: invert = (x + y) % 2 === 0; break;
                    case 1: invert = y % 2 === 0; break;
                    case 2: invert = x % 3 === 0; break;
                    case 3: invert = (x + y) % 3 === 0; break;
                    case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
                    case 5: invert = x * y % 2 + x * y % 3 === 0; break;
                    case 6: invert = (x * y % 2 + x * y % 3) % 2 === 0; break;
                    case 7: invert = ((x + y) % 2 + x * y % 3) % 2 === 0; break;
                }
                if (invert) this.modules[y][x] = !this.modules[y][x];
            }
        }
    }

    _findBestMask() {
        let bestMask = 0, minPenalty = Infinity;
        for (let mask = 0; mask < 8; mask++) {
            this._applyMask(mask);
            this._drawFormatBits(mask);
            const penalty = this._getPenaltyScore();
            if (penalty < minPenalty) { minPenalty = penalty; bestMask = mask; }
            this._applyMask(mask);
        }
        return bestMask;
    }

    _getPenaltyScore() {
        let result = 0;
        for (let y = 0; y < this.size; y++) {
            let runColor = false, runLen = 0;
            for (let x = 0; x < this.size; x++) {
                if (this.modules[y][x] === runColor) { runLen++; if (runLen === 5) result += 3; else if (runLen > 5) result++; }
                else { runColor = this.modules[y][x]; runLen = 1; }
            }
        }
        for (let x = 0; x < this.size; x++) {
            let runColor = false, runLen = 0;
            for (let y = 0; y < this.size; y++) {
                if (this.modules[y][x] === runColor) { runLen++; if (runLen === 5) result += 3; else if (runLen > 5) result++; }
                else { runColor = this.modules[y][x]; runLen = 1; }
            }
        }
        for (let y = 0; y < this.size - 1; y++) {
            for (let x = 0; x < this.size - 1; x++) {
                const c = this.modules[y][x];
                if (c === this.modules[y][x+1] && c === this.modules[y+1][x] && c === this.modules[y+1][x+1]) result += 3;
            }
        }
        let dark = 0;
        for (const row of this.modules) for (const c of row) if (c) dark++;
        result += Math.abs(Math.ceil(dark * 20 / (this.size * this.size)) - 10) * 10;
        return result;
    }

    _drawFormatBits(mask) {
        const EC_BITS = [1, 0, 3, 2];
        const data = (EC_BITS[this.ecLevel] << 3) | mask;
        let rem = data;
        for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >> 9) * 0x537);
        const bits = ((data << 10) | rem) ^ 0x5412;
        
        for (let i = 0; i <= 5; i++) this._setFunctionModule(8, i, ((bits >> i) & 1) !== 0);
        this._setFunctionModule(8, 7, ((bits >> 6) & 1) !== 0);
        this._setFunctionModule(8, 8, ((bits >> 7) & 1) !== 0);
        this._setFunctionModule(7, 8, ((bits >> 8) & 1) !== 0);
        for (let i = 9; i < 15; i++) this._setFunctionModule(14 - i, 8, ((bits >> i) & 1) !== 0);
        
        for (let i = 0; i < 8; i++) this._setFunctionModule(this.size - 1 - i, 8, ((bits >> i) & 1) !== 0);
        for (let i = 8; i < 15; i++) this._setFunctionModule(8, this.size - 15 + i, ((bits >> i) & 1) !== 0);
    }

    _drawVersionBits() {
        let rem = this.version;
        for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >> 11) * 0x1F25);
        const bits = (this.version << 12) | rem;
        for (let i = 0; i < 18; i++) {
            const bit = ((bits >> i) & 1) !== 0;
            const a = this.size - 11 + (i % 3), b = Math.floor(i / 3);
            this._setFunctionModule(a, b, bit);
            this._setFunctionModule(b, a, bit);
        }
    }

    toCanvas(canvas, options = {}) {
        const scale = options.scale || 10, margin = options.margin ?? 4;
        const dark = options.darkColor || '#000000', light = options.lightColor || '#ffffff';
        const total = (this.size + margin * 2) * scale;
        canvas.width = canvas.height = total;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = light; ctx.fillRect(0, 0, total, total);
        ctx.fillStyle = dark;
        for (let y = 0; y < this.size; y++)
            for (let x = 0; x < this.size; x++)
                if (this.modules[y][x]) ctx.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale);
        return canvas;
    }

    toSVG(options = {}) {
        const scale = options.scale || 10, margin = options.margin ?? 4;
        const dark = options.darkColor || '#000', light = options.lightColor || '#fff';
        const total = (this.size + margin * 2) * scale;
        let path = '';
        for (let y = 0; y < this.size; y++)
            for (let x = 0; x < this.size; x++)
                if (this.modules[y][x]) path += `M${(x+margin)*scale},${(y+margin)*scale}h${scale}v${scale}h-${scale}z`;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}"><rect width="100%" height="100%" fill="${light}"/><path fill="${dark}" d="${path}"/></svg>`;
    }

    toDataURL(options = {}) {
        const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
        if (!canvas) throw new Error('Canvas not available');
        this.toCanvas(canvas, options);
        return canvas.toDataURL('image/png');
    }

    toString(dark = '██', light = '  ') {
        return this.modules.map(row => row.map(c => c ? dark : light).join('')).join('\n');
    }

    get moduleCount() { return this.size; }
}

if (typeof module !== 'undefined' && module.exports) module.exports = QRCode;
