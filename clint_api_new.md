# توثيق واجهات API العامة للواجهة الأمامية

هذا التوثيق يغطي واجهات API المتاحة للواجهة الأمامية العامة للتطبيق.

**رابط الخادم الأساسي (Base URL):** `https://lib-dashboard-lovat.vercel.app/api/clint`

---

## 1. جلب قائمة المنتجات وتصفيتها

يستخدم هذا المسار لجلب قائمة المنتجات المتاحة للعملاء. يمكن تصفية النتائج باستخدام معلمات الاستعلام.

**Endpoint:** `/products`

**Method:** `GET`

**Query Parameters (اختياري):**

- `categoryId`: (string) فلترة حسب فئة معينة.
- `authorId`: (string) فلترة حسب مؤلف معين. **ملاحظة:** هذا الفلتر يعمل فقط إذا كانت الفئة المحددة (عبر `categoryId`) هي "كتب".
- `search`: (string) البحث النصي في عناوين المنتجات ووصفها.

**مثال على الطلب:**

`GET https://lib-dashboard-lovat.vercel.app/api/clint/products?categoryId=someCategoryId&authorId=someAuthorId&search=programming`

**الاستجابة المتوقعة (نجاح - Status 200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "productId1",
      "title": "عنوان المنتج",
      "description": "وصف المنتج",
      "price": 25.99,
      "quantity": 100,
      "category": {
        "_id": "categoryId",
        "name": "اسم الفئة"
      },
      "author": {
        // موجود فقط إذا كانت الفئة "كتب"
        "_id": "authorId",
        "name": "اسم المؤلف"
      },
      "image": "/path/to/image.jpg", // أو /main.jpg
      "createdAt": "ISO Date String",
      "updatedAt": "ISO Date String"
    }
    // ... المزيد من المنتجات
  ]
}
```

**الاستجابة المتوقعة (خطأ - Status 400/500):**

```json
{
  "success": false,
  "message": "رسالة الخطأ"
}
```

## 2. جلب بيانات منتج واحد

يستخدم هذا المسار لجلب تفاصيل منتج محدد باستخدام معرّفه.

**Endpoint:** `/products/{id}`

**Method:** `GET`

**Path Parameters:**

- `id`: (string, required) معرف المنتج.

**مثال على الطلب:**

`GET https://lib-dashboard-lovat.vercel.app/api/clint/products/someProductId`

**الاستجابة المتوقعة (نجاح - Status 200):**

```json
{
  "success": true,
  "data": {
    "_id": "productId1",
    "title": "عنوان المنتج",
    "description": "وصف المنتج",
    "price": 25.99,
    "quantity": 100,
    "category": {
      "_id": "categoryId",
      "name": "اسم الفئة"
    },
    "author": {
      // موجود فقط إذا كانت الفئة "كتب"
      "_id": "authorId",
      "name": "اسم المؤلف"
    },
    "image": "/path/to/image.jpg", // أو /main.jpg
    "createdAt": "ISO Date String",
    "updatedAt": "ISO Date String"
  }
}
```

**الاستجابة المتوقعة (خطأ - Status 400/404/500):**

```json
{
  "success": false,
  "message": "رسالة الخطأ" // مثلاً "معرّف منتج غير صالح" أو "المنتج غير موجود"
}
```

## 3. جلب قائمة الفئات

يستخدم هذا المسار لجلب قائمة بجميع فئات المنتجات.

**Endpoint:** `/categories`

**Method:** `GET`

**مثال على الطلب:**

`GET https://lib-dashboard-lovat.vercel.app/api/clint/categories`

**الاستجابة المتوقعة (نجاح - Status 200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "categoryId1",
      "name": "اسم الفئة 1",
      "createdAt": "ISO Date String",
      "updatedAt": "ISO Date String"
    }
    // ... المزيد من الفئات
  ]
}
```

**الاستجابة المتوقعة (خطأ - Status 500):**

```json
{
  "success": false,
  "message": "رسالة الخطأ"
}
```

## 4. جلب قائمة المؤلفين

يستخدم هذا المسار لجلب قائمة بجميع مؤلفي الكتب.

**Endpoint:** `/authors`

**Method:** `GET`

**مثال على الطلب:**

`GET https://lib-dashboard-lovat.vercel.app/api/clint/authors`

**الاستجابة المتوقعة (نجاح - Status 200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "authorId1",
      "name": "اسم المؤلف 1",
      "createdAt": "ISO Date String",
      "updatedAt": "ISO Date String"
    }
    // ... المزيد من المؤلفين
  ]
}
```

**الاستجابة المتوقعة (خطأ - Status 500):**

```json
{
  "success": false,
  "message": "رسالة الخطأ"
}
```

## 5. إنشاء طلب جديد

يستخدم هذا المسار لإنشاء طلب جديد للعميل. **ملاحظة:** إدارة المخزون (إنقاص الكمية) تحدث لاحقاً عند قبول الطلب من لوحة تحكم المدير.

**Endpoint:** `/orders`

**Method:** `POST`

**Request Body (JSON):**

```json
{
  "user_name": "اسم العميل", // مطلوب
  "total": 150.0, // المجموع الإجمالي للطلب (مطلوب، يمكن حسابه في الواجهة الأمامية)
  "items": [
    // قائمة المنتجات في الطلب (مطلوب، يجب أن تكون مصفوفة غير فارغة)
    {
      "product": "productId1", // معرف المنتج (مطلوب)
      "quantity": 2 // الكمية المطلوبة من هذا المنتج (مطلوب)
    },
    {
      "product": "productId2",
      "quantity": 1
    }
    // ... المزيد من عناصر الطلب
  ]
}
```

**الاستجابة المتوقعة (نجاح - Status 201 - Created):**

```json
{
  "success": true,
  "data": {
    "_id": "orderId",
    "user_name": "اسم العميل",
    "total": 150.0,
    "status": "pending", // الحالة الأولية
    "items": [
      {
        "_id": "orderItemId1",
        "productTitle": "عنوان المنتج", // الاسم مخزن مباشرة
        "price": 25.99, // السعر مخزن مباشرة
        "quantity": 2,
        "product": {
          // تفاصيل المنتج المأهولة بشكل جزئي
          "_id": "productId1",
          "image": "/path/to/image.jpg" // أو رابط Cloudinary
        }
      }
      // ... المزيد من عناصر الطلب
    ],
    "createdAt": "ISO Date String",
    "updatedAt": "ISO Date String"
  }
}
```

**الاستجابة المتوقعة (خطأ - Status 400/500):**

```json
{
  "success": false,
  "message": "رسالة الخطأ" // مثلاً "بيانات الطلب غير مكتملة" أو "هيكل عناصر الطلب غير صالح" أو رسالة من الواجهة الخلفية في حالة وجود مشكلة.
}
```
