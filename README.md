==================================================
        📚 BekBOOK ONLAYN KITOB DO'KONI
             LOYIHASI ARXITEKTURASI
==================================================

--------------------------------------------------
1. 📂 LOYIHA FAYL TUZILMASI VA VAZIFALARI
--------------------------------------------------

* index.html
    Vazifasi: Ilovada ko'rinadigan barcha elementlarning "skeleti" (tuzilmasi).
    Nimalar joylashgan: Bosh sahifa interfeysi, tugmalar, formalar, savat va avtorizatsiya uchun modallar, kitoblar ro'yxati.

* style.css
    Vazifasi: Ilovaning tashqi ko'rinishi va dizayni.
    Nimalar joylashgan: Ranglar, shriftlar, elementlarning joylashuvi, **Dark Mode / Light Mode** (tungi/kunduzgi rejim) boshqaruvi.

* script.js
    Vazifasi: Ilovaning "miyyasi" (asosiy mantiq va funksional).
    Nimalar joylashgan: Tugmalarni bosganda harakatga kelish, kirish/ro'yxatdan o'tish, ma'lumotlarni boshqarish.

* data.json
    Vazifasi: Statik "ma'lumotlar bazasi".
    Nimalar joylashgan: Sotuvdagi barcha kitoblar haqidagi ma'lumotlar (nomi, narxi, muallifi, janri).

--------------------------------------------------
2. 💡 TEXNOLOGIYALAR VA MA'LUMOTLARNI SAQLASH
--------------------------------------------------

* Front-End Asosi
    HTML, CSS, JavaScript (JS) ning zamonaviy versiyalari ishlatilgan. Loyiha faqat brauzerda ishlaydi (server qismi yo'q).

* Ma'lumotlarni Saqlash
    Texnologiya: **LocalStorage (Brauzer xotirasi)**
    Saqlanadi: Ro'yxatdan o'tgan foydalanuvchilar, joriy foydalanuvchining savati va foydalanuvchi tanlagan tema (Dark/Light).

--------------------------------------------------
3. 🧠 ASOSIY FUNKSIONAL MANTIQ (script.js ichida)
--------------------------------------------------

3.1. Ma'lumotni Ko'rsatish
    * Yuklash: data.json dan kitoblarni va LocalStorage dan foydalanuvchi ma'lumotlarini yuklaydi.
    * Filtrlash/Qidiruv: Kitoblarni janr yoki qidiruv so'zi bo'yicha saralaydi va sahifaga chiqaradi.

3.2. Avtorizatsiya (Kirish / Ro'yxatdan o'tish)
    * Ro'yxatdan o'tish: Yangi foydalanuvchi ma'lumotlarini tekshirib, ularni LocalStorage ga saqlaydi.
    * Tizimga kirish: Kiritilgan email/parolni LocalStorage dagi ro'yxat bilan solishtiradi.

3.3. Savatni Boshqarish
    * Qo'shish: "Savatga" tugmasi bosilganda, kitobni savat ro'yxatiga qo'shadi.
    * Yangilash: Savatdagi mahsulot miqdorini oshirish, kamaytirish yoki butunlay olib tashlash imkoniyati mavjud.

3.4. 🚀 Buyurtma Berish (Muhim Xususiyat!)
    * Jarayon: Foydalanuvchi buyurtma formasini to'ldirgach, ilova ma'lumotlarni yig'adi.
    * Uzatish: Dastur maxsus **Telegram Bot API** orqali buyurtmaning barcha tafsilotlarini (kitoblar ro'yxati, umumiy narx, mijoz ma'lumoti) belgilangan Telegram chatga yuboradi.
    * Xulosa: Muvaffaqiyatli yuborilgandan so'ng, foydalanuvchining savatini bo'shatadi va tasdiqlash xabarini beradi.
