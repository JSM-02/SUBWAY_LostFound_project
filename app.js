const express = require('express');  
require('dotenv').config();
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Railway mysql 
// const pool = mysql.createPool({
//     uri: process.env.MYSQL_URL 
// });
// 로컬 mysql
const pool = mysql.createPool(
    process.env.MYSQL_URL || {
        host: process.env.LOCAL_DB_HOST,
        user: process.env.LOCAL_DB_USER,
        password: process.env.LOCAL_DB_PASSWORD,
        database: process.env.LOCAL_DB_DATABASE,
        port: 3306
    }
);

app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'static')));

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// 이름 정제 
function cleanNm(locationNm) {
    if (!locationNm) return "";
    let lcNm = locationNm.split('(')[0].replace(/:/g, "").trim();
    if (!(lcNm.endsWith("역") || lcNm.endsWith("센터"))) lcNm += "역";
    return lcNm;
}

// 페이지네이션 계산
function getPagination(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}

// 유실물 센터 위치
const stationToCenter = {
    "시청역": "시청유실물센터",
    "충무로역": "충무로유실물센터",
    "왕십리역": "왕십리유실물센터",
    "태릉입구역": "태릉유실물센터",
    "종합운동장역": "종합운동장유실물센터"
};

// 장소로 검색
app.get('/location/:name', async (req, res) => {
    // 입력 데이터 정제
    const stationNm = cleanNm(req.params.name);
    const centerNm = stationToCenter[stationNm] || stationNm;
    const { page, limit, offset } = getPagination(req.query);
    try {
        // stationNm으로 시작하거나 centerNm으로 시작하는 데이터만 조회
        const where = "WHERE depPlace LIKE ? OR depPlace LIKE ?";
        const queryParams = [`${stationNm}%`, `${centerNm}%`];
        const [rows] = await pool.query(
            `SELECT * FROM keeping_items ${where} ORDER BY fdymd DESC LIMIT ? OFFSET ?`, 
            [...queryParams, limit, offset]
        );

        const [totalRows] = await pool.query(
            `SELECT COUNT(*) as total FROM keeping_items ${where}`,
            queryParams
        );

        const totalItems = totalRows[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            items: rows,
            totalPages: totalPages,
            totalItems: totalItems,
            currentPage: page
        });

    } catch (err) {
        console.error(`[DB Error] ${err.message}`); 
        res.status(500).json({ error: "잠시 후 다시 시도해주세요." });
    }
});

// 물품명으로 검색
app.get('/item/:name', async (req, res) => {
    const itemName = req.params.name;
    const { page, limit, offset } = getPagination(req.query);

    try {
        // 데이터 조회 
        const [rows] = await pool.query(
            "SELECT * FROM keeping_items WHERE fdPrdtNm LIKE ? ORDER BY fdymd DESC LIMIT ? OFFSET ?",
            [`%${itemName}%`, limit, offset]
        );

        // 전체 개수 조회
        const [totalRows] = await pool.query(
            "SELECT COUNT(*) as total FROM keeping_items WHERE fdPrdtNm LIKE ?",
            [`%${itemName}%`]
        );

        res.json({
            items: rows,
            totalPages: Math.ceil(totalRows[0].total / limit),
            totalItems: totalRows[0].total, 
            currentPage: page
        });

    } catch (err) {
        console.error(`[DB Error] ${err.message}`); 
        res.status(500).json({ error: "잠시 후 다시 시도해주세요." });
    }
});

app.listen(port);