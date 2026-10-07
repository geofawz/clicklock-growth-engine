import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print(f"Created: {path}")

# ==========================================
# 13_AI_Creative
# ==========================================

write_file('brand_brain/13_AI_Creative/01_Video_Prompts.md', """# 01. Video Prompts | موجهات توليد مقاطع الفيديو الذكية (AI Video Prompts)

## 1. موجهات توليد لقطات B-Roll فاخرة (Runway Gen-3 / Sora / Kling AI)
* **Prompt 1 (Macro Leather Texture & Gold Hardware):**
  * `Cinematic close-up macro 4k video, luxurious caviar leather handbag in deep teal color with gold interlocking CL metal padlock hardware, soft studio lighting reflecting warm golden sheen, slow panning camera movement, hyper-realistic, luxury brand commercial aesthetic, 60fps --ar 9:16`
* **Prompt 2 (The Boutique Box Ribbon Unboxing):**
  * `POV elegant female hands gently pulling a silk ivory ribbon to open a heavy rigid deep teal luxury boutique box, warm ambient boutique lighting, dustbag revealed inside, ultra-smooth movement, luxury ASMR aesthetic, high-end editorial commercial --ar 9:16`
* **Prompt 3 (Quiet Luxury Street Walk in Riyadh):**
  * `Side angle tracking shot of an elegant Saudi woman wearing a modern black silk abaya carrying a chic mini luxury leather handbag, walking gracefully outside an upscale modern minimalist café in Riyadh, warm afternoon sunlight, depth of field, high fashion editorial --ar 9:16`
""")

write_file('brand_brain/13_AI_Creative/02_Static_Generation.md', """# 02. Static Generation | موجهات توليد الصور الثابتة والبنرات (Midjourney / Flux)

## 1. موجهات تصوير المنتجات الفاخرة (Product Pedestals)
* **Prompt 1 (The Ivory & Teal Pedestal):**
  * `Professional luxury product photography of a premium 1:1 master quality leather designer bag placed on a warm ivory travertine pedestal, deep teal (#1F4E5A) matte background, soft directional warm studio light, subtle gold reflections, 8k resolution, Hasselblad medium format look, no text, hyper-detailed --ar 4:5`
* **Prompt 2 (Coordinated Bag & Heel Set):**
  * `Luxury flat lay composition of an iconic designer handbag and matching stiletto heels on a textured cream silk surface, boutique packaging box and cards in background, elegant minimalist aesthetic, Vogue magazine editorial lighting --ar 4:5`
""")

write_file('brand_brain/13_AI_Creative/03_Static_Recreation.md', """# 03. Static Recreation | مسار إعادة تشكيل التصاميم الفائزة

## 1. خطوات إعادة إنتاج الإعلانات الثابتة الرابحة بهوية Clicklock
1. استخراج الهيكل الإعلاني الفائز (صورة المنتج في المنتصف + عنوان كسر التوقعات في الأعلى + شريط تمارا والتوصيل بـ 48 ساعة في الأسفل).
2. تطبيق ألوان Clicklock الرسمية: الخلفية بدرجة العاجي (`#F2EDE4`)، النصوص والعناصر بالتيل العميق (`#1F4E5A`).
3. استخدام خط `DIN Next Arabic` للعناوين البارزة و `PingARLT` للنصوص الفرعية.
4. تثبيت بادج تمارا وبادج "توصيل خلال 48 ساعة" كعناصر ثقة بصرية دائمة.
""")

write_file('brand_brain/13_AI_Creative/04_Image_to_Video.md', """# 04. Image to Video | تحريك الصور الثابتة إلى مقاطع فيديو ديناميكية

## 1. تقنيات تحريك صور الكتالوج (Motion Animation Workflows)
* **تأثير مسح الإضاءة (Light Sweep Effect):** تمرير وميض ضوئي ذهبي ناعم فوق قفل الهاردوير لإبراز لمعانه.
* **تأثير المنظر المجسم (3D Parallax Depth):** تحريك الشنطة ببطء للأمام مع إبقاء الخلفية العاجية ثابتة لإعطاء عمق سينمائي ثلاثي الأبعاد.
* **تأثير الدوران البطيء (Subtle 15-Degree Turntable):** تحريك زاوية الشنطة لإظهار دقة الخياطة الجانبية وسماكة القاعدة.
""")

write_file('brand_brain/13_AI_Creative/05_First_and_Last_Frame.md', """# 05. First & Last Frame | هندسة الإطار الأول وإطار الختام

## 1. الإطار الأول (The First Frame / 0.0 - 0.5s):
* يجب أن يحتوي الإطار الأول على حركة بصرية مفاجئة (حمل الشنطة بسرعة، تقريب الكاميرا على القفل، أو إيماءة يد معبرة) مع نص كبير وواضح يقرأ في أقل من ثانية واحدة (مثال: *"وفرت 15,000 ريال!"*).

## 2. الإطار الأخير (The Last Frame / Outro Card):
* شاشة ختامية احترافية مدتها 3 ثوانٍ تتضمن:
  * شعار Clicklock الرسمي والمونوغرام.
  * شعار تمارا (4 دفعات بدون فوائد).
  * عبارة التحفيز: *"التوصيل خلال 48 ساعة بالرياض.. اضغطي للطلب الآن!"*
""")

# ==========================================
# 14_Iteration
# ==========================================

write_file('brand_brain/14_Iteration/01_Which_Ads_Deserve_It.md', """# 01. Which Ads Deserve It | شجرة قرارات تدوير وتطوير الإعلانات

```mermaid
graph TD
    A[تقييم أداء الإعلان بعد 72 ساعة] --> B{هل حقق الإعلان مبيعات بـ CPA < 50 ر.س؟}
    B -- نعم Winner --> C[الإعلان يستحق التطوير الفوري: إنتاج 4 خطافات جديدة + توسيع الميزانية]
    B -- لا --> D{هل نسبة النقر CTR > 1.4% ولكن بدون مبيعات؟}
    D -- نعم Potential --> E[المشكلة في صفحة الهبوط أو السعر: تغيير زاوية العرض وإبراز تمارا]
    D -- لا Loser --> F[إيقاف الإعلان فوراً واستبدال الزاوية بالكامل]
```
""")

write_file('brand_brain/14_Iteration/02_Hook_Swap.md', """# 02. Hook Swap | آلية تبديل الخطافات لمضاعفة عمر الإعلان

## 1. نموذج تبديل الخطافات (Hook Swapping Protocol)
عندما يبدأ فيديو ناجح بفقدان كفاءته وتراجع الـ ROAS، يتم الاحتفاظ بصلب الفيديو (عرض المنتج والـ Unboxing) واستبدال أول 3 ثوانٍ فقط بأحد الخيارات التالية:

* **النسخة الأصلية A:** "لا تدفعين 20 ألف في شنطة ديور.. تعالي شوفي البديل الذكي!"
* **النسخة البديلة B (زاوية المناسبات):** "زواج صديقتك بالويكند؟ كليك لوك يوصلك هالكشخة بـ 48 ساعة!"
* **النسخة البديلة C (زاوية التغليف والهدية):** "أفخم بوكس unboxing ممكن تستلمينه بحياتك بضغطة زر!"
* **النسخة البديلة D (زاوية تمارا الصريحة):** "كشخي بأقوى هبة للموسم بـ 180 ريال بس مع تمارا!"
""")

write_file('brand_brain/14_Iteration/03_Angle_Swap.md', """# 03. Angle Swap | تبديل الزاوية التسويقية لنفس المنتج

| الزاوية التسويقية | المدخل النفسي | نص الرسالة |
| :--- | :--- | :--- |
| **زاوية التوفير والذكاء المالي** | الفخر بالذكاء الاستهلاكي | "وفرت 90% من سعر البوتيك وطلعت بنفس الفخامة والوجاهة." |
| **زاوية السرعة والإنقاذ** | إزالة التوتر وضيق الوقت | "توصيل سريع لباب بيتك بـ 48 ساعة قبل مناسبة الويكند." |
| **زاوية الجودة والجلد الطبيعي** | تجنب الإحراج وفوبيا التقليد | "جلود طبيعية 100% وهاردوير مطابق بالوزن والملمس." |
""")

write_file('brand_brain/14_Iteration/04_Format_Swap.md', """# 04. Format Swap | تحويل وتدوير الصيغ الإعلانية

* **من فيديو UGC إلى كاروسيل إنستغرام (UGC to Carousel):** أخذ لقطات ثابتة عالية الدقة من الفيديو وعرضها في بوست كاروسيل من 4 شرائح (1. الشنطة كاملة، 2. ماكرو الجلد، 3. محتويات البوكس، 4. تفاصيل تمارا).
* **من إعلان كتالوج إلى فيديو سلايدشو تيك توك (DPA to TikTok Slideshow):** دمج صور المنتج الواقعية مع صوت تريند ومؤثرات نصية سريعة.
""")

write_file('brand_brain/14_Iteration/05_Frankenstein_and_Mashup.md', """# 05. Frankenstein & Mashup | دمج العناصر الفائزة (Mashup Production)

## 1. معادلة الماش اب الإعلاني:
$$\\text{New Scaler Ad} = \\text{أقوى خطاف من إعلان A (0-3s)} + \\text{أقوى لقطة جلد ماكرو من إعلان B (3-12s)} + \\text{أقوى دعوة للشراء وتمارا من إعلان C (12-25s)}$$
""")

# ==========================================
# 15_Quality_Gates
# ==========================================

write_file('brand_brain/15_Quality_Gates/01_Grounding_Review.md', """# 01. Grounding Review | مراجعة التطابق والواقعية

## 1. قائمة التحقق الإلزامية قبل نشر أي حملة (Pre-Launch Checklist)
* [ ] هل المنتج المعروض في الإعلان متوفر فعلياً في المستودع المحلي بالرياض؟
* [ ] هل السعر المذكور في الإعلان يطابق السعر المعروض في صفحة المنتج على متجر سلة؟
* [ ] هل خيار الدفع عبر تمارا مفعل ويعمل بسلاسة في صفحة الدفع؟
* [ ] هل مدة التوصيل المعلنة (24-48 ساعة) قابلة للتحقيق مع شركة الشحن المعتمدة؟
""")

write_file('brand_brain/15_Quality_Gates/02_Voice_Review.md', """# 02. Voice Review | مراجعة نبرة الصوت وهوية الخطاب

* [ ] هل يخلو النص تماماً من الألفاظ المحظورة (مثل: تقليد، رخيص، صيني، حراج)؟
* [ ] هل تبدو اللهجة السعودية طبيعية وراقية وغير مبتذلة؟
* [ ] هل يعكس الإعلان روح الفخامة الذكية واليقين التي يمثلها اسم Clicklock؟
""")

write_file('brand_brain/15_Quality_Gates/03_Brand_Lens.md', """# 03. Brand Lens | مراجعة التوافق البصري ومعايير الهوية

* [ ] هل تم الالتزام بالألوان الرسمية: التيل العميق (`#1F4E5A`) والعاجي (`#F2EDE4`)؟
* [ ] هل تم تطبيق المسافة الآمنة للشعار وعدم تشويه أبعاده؟
* [ ] هل الخطوط المستخدمة هي `DIN Next Arabic` أو `PingARLT`؟
* [ ] هل تبرز الصور خامات المنتجات بإضاءة دافئة وفخمة؟
""")

write_file('brand_brain/15_Quality_Gates/04_Source_Receipts.md', """# 04. Source Receipts | سجل الإثباتات والوثائق الداعمة

## 1. أرشيف الإثباتات المعتمدة للردود والتسويق
* **إثبات الجلد الطبيعي:** مقاطع فحص مسامات الجلد ومرونة الخياطة.
* **إثبات التوصيل السريع:** بوليصات شحن حقيقية لعميلات استلمن خلال 24 - 48 ساعة بالرياض والدمام.
* **إثبات الملحقات الكاملة:** صور البوكسات الأصلية الثقيلة وأكياس القماش وكروت العناية.
""")

write_file('brand_brain/15_Quality_Gates/05_Read_Aloud_Test.md', """# 05. Read-Aloud Test | اختبار القراءة الجهرية للسكربتات

## 1. قاعدة الـ 10 ثوانٍ الأولى:
يجب قراءة السكربت بصوت مسموع؛ إذا تعثرت القارئة في أي جملة أو شعرت بأنها تقرأ نصاً إعلانياً جامداً ومصطنعاً، يتم إعادة صياغة الجملة فوراً لتصبح كأنها محادثة حقيقية بين صديقتين!
""")

# ==========================================
# 16_The_Brain_Runs_Itself
# ==========================================

write_file('brand_brain/16_The_Brain_Runs_Itself/01_Refresh_Context.md', """# 01. Refresh Context | بروتوكول التحديث التلقائي للسياق

## 1. دورات تحديث الـ Brand Brain
* **تحديث أسبوعي:** مزامنة أرقام الصرف الإعلاني، أسعار التكلفة CPA، وقائمة المنتجات الأكثر مبيعاً على سلة.
* **تحديث شهري:** مراجعة وتحليل تقارير المنافسين والمواسم السعودية الجديدة.
* **تحديث ربع سنوي:** مراجعة شاملة لملفات الشخصيات والاستراتيجية التسويقية.
""")

write_file('brand_brain/16_The_Brain_Runs_Itself/02_Dream.md', """# 02. Dream | التوليد الذاتي للأفكار والفرص المستقبلية

## 1. محفزات التفكير التوليدي (Autonomous Prompts)
* *"ما هي الشنطة أو الماركة العالمية التي بدأت تتصدر تريندات تيك توك في باريس ولندن ولم تتوفر بعد في المتاجر السعودية؟"*
* *"كيف يمكن تصميم باقة خاصة بيوم التأسيس تجمع بين حقيبة أيقونية وحذاء بتطريز تراثي فخم؟"*
""")

write_file('brand_brain/16_The_Brain_Runs_Itself/03_Harvest_and_Evaluate.md', """# 03. Harvest & Evaluate | حصاد وتقييم الأداء تلقائياً

## 1. آلية تصنيف البيانات المستمرة
جمع تعليقات الإعلانات الإيجابية والسلبية أسبوعياً وتفريغها في ملف `02_The_Customer/02_Ad_Comments.md` لتحويلها تلقائياً إلى خطافات إعلانية في الدورة القادمة.
""")

write_file('brand_brain/16_The_Brain_Runs_Itself/04_Research_Loops.md', """# 04. Research Loops | حلقات البحث المستمر في السوق

## 1. مهام البحث الدوري الآلي:
1. فحص مكتبة إعلانات تيك توك وسناب شات أسبوعياً لرصد أي زوايا إعلانية جديدة للمنافسين.
2. متابعة حسابات الفاشينيستات السعوديات لرصد حقائب "الهبة" المتكررة في إطلالاتهن.
""")

write_file('brand_brain/16_The_Brain_Runs_Itself/05_Self_Improve.md', """# 05. Self-Improve | التحسين الذاتي المستمر لقواعد المعرفة

## 1. مراجعة وثيقة التسويق المركزية:
تحديث وثيقة `.agents/product-marketing.md` دورياً مع كل تغيير في عروض المنتجات أو استراتيجية التموضع لضمان عمل كافة الوكلاء الأذكياء بنفس المعطيات الحديثة.
""")

# ==========================================
# 17_The_Factory
# ==========================================

write_file('brand_brain/17_The_Factory/01_Templates.md', """# 01. Templates | النماذج والقوالب الإعلانية القياسية

## 1. قالب بريف الإعلان السريع (Universal Ad Brief Template)
* **اسم المفهوم:** [اسم المفهوم والزاوية]
* **المنتج والماركة:** [المنتج المستهدف ورابط المتجر]
* **المنصة المستهدفة:** [TikTok / Snapchat / Instagram]
* **الخطاف المقترح (0-3s):** [نص الخطاف المكتوب والمرئي]
* **مشاهد الإثبات والعرض (3-20s):** [وصف اللقطات والتركيز على الجلد والهاردوير والتغليف]
* **دعوة الشراء وعكس المخاطر (20-30s):** [التوصيل بـ 48 ساعة + تقسيط تمارا + كود الخصم]
""")

write_file('brand_brain/17_The_Factory/02_Three_Phase_Model.md', """# 02. Three-Phase Model | نموذج المراحل الثلاث لتشغيل البراند

```mermaid
graph LR
    P1[المرحلة 1: البحث والاستكشاف Research & Mining] --> P2[المرحلة 2: الإنتاج والاختبار Production & Testing]
    P2 --> P3[المرحلة 3: التحجيم والنمو Scaling & Moat Building]
```
""")

write_file('brand_brain/17_The_Factory/03_Growing_the_Brain.md', """# 03. Growing the Brain | بروتوكول توسيع وتغذية الـ Brand Brain

* كل تجربة إعلانية ناجحة يجب توثيق نتيجتها في `07_Open_Loops/04_Validations.md`.
* كل مراجعة عميل جديدة أو إطراء مميز يجب إضافته إلى `02_The_Customer/01_Customer_Reviews.md`.
* أي تحديث في درجات الألوان أو الخطوط يجب توثيقه فوراً في `01_The_Brand/05_Visual_Vocabulary.md`.
""")

write_file('brand_brain/17_The_Factory/04_Propagate_to_Other_Brands.md', """# 04. Propagate to Other Brands | استنساخ البنية لبراندات أخرى

## 1. خطوات استنساخ هيكل الـ Brand Brain لأي علامة تجارية جديدة:
1. نسخ البنية الشجرية للمجلدات الـ 17 كاملة.
2. تفريغ وتعديل وحدات الهوية والمنتج والشخصيات (`The Brand`, `The Customer`, `Personas`).
3. ربط مؤشرات الأداء وحسابات الإعلانات الخاصة بالمتجر الجديد.
4. تفعيل نظام التشغيل الذاتي ومصنع الإعلانات (`The Brain Runs Itself` & `The Factory`).
""")

# ==========================================
# README.md Master Index
# ==========================================

write_file('brand_brain/README.md', """# 🧠 CLICKLOCK BRAND BRAIN | العقل المركزي للعلامة التجارية

مرحباً بك في **CLICKLOCK BRAND BRAIN**؛ النظام المعرفي والتشغيلي المتكامل لمتجر [Clicklock.sa](https://clicklock.sa/) المتخصص في منتجات الماستر كواليتي (1:1) للحقائب والأحذية والإكسسوارات الفاخرة في السوق السعودي.

---

## 🗂️ خريطة المجلدات والوحدات الـ 17 (Architecture Map)

### 📂 01. The Brand (العلامة التجارية والهوية)
* [01. Identity & Positioning](file:///e:/vs%20project/clicklock/brand_brain/01_The_Brand/01_Identity_and_Positioning.md): الهوية، قصة الشعار، الشعار اللفظي `PREMIUM BRANDS. ONE CLICK.`، ومصفوفة التموضع والقيمة.
* [02. Product & Website](file:///e:/vs%20project/clicklock/brand_brain/01_The_Brand/02_Product_and_Website.md): بنية متجر سلة، تشكيلة الماركات (Dior, Chanel, Bottega, Hermes)، وسائل الدفع وتمارا والتوصيل.
* [03. Category & Market](file:///e:/vs%20project/clicklock/brand_brain/01_The_Brand/03_Category_and_Market.md): تحليل السوق السعودي، بيانات وزارة التجارة Q2 2026، وظاهرة الاستهلاك الذكي.
* [04. Brand Rules & Claims Gates](file:///e:/vs%20project/clicklock/brand_brain/01_The_Brand/04_Brand_Rules_and_Claims_Gates.md): الادعاءات المصرح بها والمحظورة وبوابات الرقابة.
* [05. Visual Vocabulary](file:///e:/vs%20project/clicklock/brand_brain/01_The_Brand/05_Visual_Vocabulary.md): كود الألوان (التيل العميق `#1F4E5A` والعاجي `#F2EDE4`)، الخطوط وقواعد الشعار.

### 📂 02. The Customer (العميل ونبض السوق)
* [01. Customer Reviews](file:///e:/vs%20project/clicklock/brand_brain/02_The_Customer/01_Customer_Reviews.md): تجارب الشراء، إشادات الجلد الطبيعي وسرعة الشحن.
* [02. Ad Comments](file:///e:/vs%20project/clicklock/brand_brain/02_The_Customer/02_Ad_Comments.md): رصد تعليقات الإعلانات والردود النموذجية على تمارا والملحقات.
* [03. Reddit & Forums](file:///e:/vs%20project/clicklock/brand_brain/02_The_Customer/03_Reddit_and_Forums.md): نبض المنتديات وتويتر وحواء حول أسعار الماركات وجودة الـ 1:1.
* [04. Reputation](file:///e:/vs%20project/clicklock/brand_brain/02_The_Customer/04_Reputation.md): عوامل الثقة وبوابات الدفع الرسمية.
* [05. Post-Purchase Surveys](file:///e:/vs%20project/clicklock/brand_brain/02_The_Customer/05_Post_Purchase_Surveys.md): قياس الرضا ومؤشرات NPS بعد الاستلام بـ 48 ساعة.

### 📂 03. Personas (شخصيات العملاء)
* [01. Persona Profiles](file:///e:/vs%20project/clicklock/brand_brain/03_Personas/01_Persona_Profiles.md): ملفات ريم (الهبة والجمعات)، سارة (الذكية والمقتصدة)، ومها (منقذة المناسبات).
* [02. Voice of Customer](file:///e:/vs%20project/clicklock/brand_brain/03_Personas/02_Voice_of_Customer.md): معجم المصطلحات السعودية الدارجة ("من وين هالكشخة، تواجه، تبيض الوجه").
* [03. Lifecycle & Journey Maps](file:///e:/vs%20project/clicklock/brand_brain/03_Personas/03_Lifecycle_and_Journey_Maps.md): رحلة التحول من إعلان UGC وحتى تكرار الشراء والولاء.
* [04. Anti-Language](file:///e:/vs%20project/clicklock/brand_brain/03_Personas/04_Anti_Language.md): قائمة الكلمات المحظورة وبدائلها الفاخرة المعتمدة.
* [05. Bias & Self-Echo Notes](file:///e:/vs%20project/clicklock/brand_brain/03_Personas/05_Bias_and_Self_Echo_Notes.md): التحيزات الإدراكية وتجنب فخ السعر المنخفض وحده.

### 📂 04. The Account (هيكلة الحسابات والإعلانات)
* [01. Spend & Structure](file:///e:/vs%20project/clicklock/brand_brain/04_The_Account/01_Spend_and_Structure.md): توزيع ميزانية الـ 300 ريال يومياً (تيك توك 170 ر.س + سناب 130 ر.س) وخطة التوسع.
* [02. Performance Targets](file:///e:/vs%20project/clicklock/brand_brain/04_The_Account/02_Performance_Targets.md): مؤشرات الأداء (Target CPA 35-50 SAR, Target ROAS > 4.0x).
* [03. Fatigue & Diversity](file:///e:/vs%20project/clicklock/brand_brain/04_The_Account/03_Fatigue_and_Diversity.md): دورة حياة الإعلان ومعادلة التنوع الإبداعي (UGC, DPA, Macro).
* [04. Placements & Demographics](file:///e:/vs%20project/clicklock/brand_brain/04_The_Account/04_Placements_and_Demographics.md): استهداف مدن الفئة الأولى (الرياض، جدة، الشرقية) والإناث 20-35 سنة.
* [05. Marketing Calendar](file:///e:/vs%20project/clicklock/brand_brain/04_The_Account/05_Marketing_Calendar.md): التقويم التسويقي للمواسم السعودية (موسم الرياض، يوم التأسيس، رمضان، اليوم الوطني).

### 📂 05. The Competition (تحليل المنافسين)
* [01. The Tracked Set](file:///e:/vs%20project/clicklock/brand_brain/05_The_Competition/01_The_Tracked_Set.md): تصنيف المنافسين (متاجر سلة، بائعات تليغرام، الدروب شيبينغ، والبوتيكات).
* [02. Their Ad Libraries](file:///e:/vs%20project/clicklock/brand_brain/05_The_Competition/02_Their_Ad_Libraries.md): تفكيك إعلانات المنافسين ونقاط ضعفهم الإعلانية.
* [03. Their Customer Language](file:///e:/vs%20project/clicklock/brand_brain/05_The_Competition/03_Their_Customer_Language.md): شكاوى عملاء المنافسين واستغلالها كمسكنات آلام في إعلاناتنا.
* [04. Their Organic](file:///e:/vs%20project/clicklock/brand_brain/05_The_Competition/04_Their_Organic.md): تشريح المحتوى العضوي واستراتيجية التفوق بالمحتوى الواقعي السعودي.
* [05. Working Thesis](file:///e:/vs%20project/clicklock/brand_brain/05_The_Competition/05_Working_Thesis.md): معادلة التفوق التنافسي لـ Clicklock وحسم الثقة بضغطة واحدة.

### 📂 06. Audits (المراجعات الدورية)
* [01. Weekly Snapshot](file:///e:/vs%20project/clicklock/brand_brain/06_Audits/01_Weekly_Snapshot.md): فحص الأداء الأسبوعي للميزانية ونسبة تمارا.
* [02. Biweekly Iterations](file:///e:/vs%20project/clicklock/brand_brain/06_Audits/02_Biweekly_Iterations.md): مصفوفة تدوير وتطوير الإعلانات كل 14 يوماً.
* [03. Monthly Hooks & Organic](file:///e:/vs%20project/clicklock/brand_brain/06_Audits/03_Monthly_Hooks_and_Organic.md): رصد الأصوات والتريندات الرائجة في السعودية.
* [04. Quarterly 90-Day](file:///e:/vs%20project/clicklock/brand_brain/06_Audits/04_Quarterly_90_Day.md): المراجعة الربعية لتوسيع المخزون وتطوير المتجر.
* [05. Whitespace](file:///e:/vs%20project/clicklock/brand_brain/06_Audits/05_Whitespace.md): المساحات البيضاء (باقات الهدايا، أطقم الشنطة والكعب، نادي VIP).

### 📂 07. Open Loops (حلقات الاختبار والفرضيات)
* [01. The Four Territories](file:///e:/vs%20project/clicklock/brand_brain/07_Open_Loops/01_The_Four_Territories.md): الأراضي الأربع للتجربة (الزوايا، الماركات، الجغرافيا، العروض).
* [02. Grading & Promotion](file:///e:/vs%20project/clicklock/brand_brain/07_Open_Loops/02_Grading_and_Promotion.md): سلم تصنيف وترقية الإعلانات من D إلى A.
* [03. Hypotheses](file:///e:/vs%20project/clicklock/brand_brain/07_Open_Loops/03_Hypotheses.md): سجل فرضيات الأداء قيد الاختبار.
* [04. Validations](file:///e:/vs%20project/clicklock/brand_brain/07_Open_Loops/04_Validations.md): سجل الحقائق التسويقية المؤكدة بالأرقام.
* [05. Missing Context](file:///e:/vs%20project/clicklock/brand_brain/07_Open_Loops/05_Missing_Context.md): خطة سد الفجوات المعرفية والبيانات المفقودة.

### 📂 08. Strategy (الاستراتيجية الكبرى)
* [01. Strategic Roadmap](file:///e:/vs%20project/clicklock/brand_brain/08_Strategy/01_Strategic_Roadmap.md): خارطة الطريق لـ 12 شهراً ومراحل النمو.
* [02. Product Priority](file:///e:/vs%20project/clicklock/brand_brain/08_Strategy/02_Product_Priority.md): أولويات الترويج للمنتجات وقادة المبيعات (Dior, Chanel, Bottega).
* [03. Persona Strategy](file:///e:/vs%20project/clicklock/brand_brain/08_Strategy/03_Persona_Strategy.md): استراتيجية الاستهداف المخصصة لكل شخصية.
* [04. Messaging Strategy](file:///e:/vs%20project/clicklock/brand_brain/08_Strategy/04_Messaging_Strategy.md): الأعمدة التسويقية الأربعة للخطاب الإعلاني.
* [05. Creator & Talent Strategy](file:///e:/vs%20project/clicklock/brand_brain/08_Strategy/05_Creator_and_Talent_Strategy.md): بروتوكول التعاقد مع صانعات محتوى UGC السعوديات.

### 📂 09. Ideation (توليد الأفكار والزوايا)
* [01. The Cold Pass](file:///e:/vs%20project/clicklock/brand_brain/09_Ideation/01_The_Cold_Pass.md): أفكار استقطاب الجمهور البارد بصدمة السعر والتسليم الفوري.
* [02. Customer Language Lane](file:///e:/vs%20project/clicklock/brand_brain/09_Ideation/02_Customer_Language_Lane.md): تحويل عبارات العميلات الحقيقية إلى زوايا إعلانية مباشرة.
* [03. Organic & Trend Lane](file:///e:/vs%20project/clicklock/brand_brain/09_Ideation/03_Organic_and_Trend_Lane.md): أفكار GRWM ومحتوى الدوام وموسم الرياض.
* [04. Old Ads Lane](file:///e:/vs%20project/clicklock/brand_brain/09_Ideation/04_Old_Ads_Lane.md): تدوير أطر المقارنة المباشرة وعكس المخاطر.
* [05. Wildcard Lane](file:///e:/vs%20project/clicklock/brand_brain/09_Ideation/05_Wildcard_Lane.md): الأفكار الجريئة (اختبار خبير الجلود الأعمى واختبار الخدش).

### 📂 10. Evaluation (التقييم والاختيار)
* [01. Score vs Roadmap](file:///e:/vs%20project/clicklock/brand_brain/10_Evaluation/01_Score_vs_Roadmap.md): مصفوفة تقييم الأفكار من 25 نقطة قبل الإنتاج.
* [02. Evidence Strength](file:///e:/vs%20project/clicklock/brand_brain/10_Evaluation/02_Evidence_Strength.md): شروط إعلان الفوز لتكلفة الاستحواذ ونسب النقر.
* [03. Roads Not Taken](file:///e:/vs%20project/clicklock/brand_brain/10_Evaluation/03_Roads_Not_Taken.md): الأفكار المرفوضة لحماية هيبة العلامة التجارية.
* [04. Ranked Shortlist](file:///e:/vs%20project/clicklock/brand_brain/10_Evaluation/04_Ranked_Shortlist.md): القائمة القصيرة لأفضل 5 مفاهيم جاهزة للإنتاج.
* [05. What the Bank Is Missing](file:///e:/vs%20project/clicklock/brand_brain/10_Evaluation/05_What_the_Bank_Is_Missing.md): الأصول الإبداعية الناقصة واللقطات المطلوبة فوراً.

### 📂 11. Briefing (التوجيه والإعداد للإنتاج)
* [01. Sprint Plan](file:///e:/vs%20project/clicklock/brand_brain/11_Briefing/01_Sprint_Plan.md): خطة سبرنت الإنتاج لمدة 14 يوماً.
* [02. Concept Map](file:///e:/vs%20project/clicklock/brand_brain/11_Briefing/02_Concept_Map.md): خريطة ربط المفاهيم بالمنتجات والمنصات.
* [03. Creative Briefs](file:///e:/vs%20project/clicklock/brand_brain/11_Briefing/03_Creative_Briefs.md): بريف إعلاني متكامل وجاهز للتصوير الفوري.
* [04. Shot Direction](file:///e:/vs%20project/clicklock/brand_brain/11_Briefing/04_Shot_Direction.md): دليل اللقطات الإلزامية والإضاءة وزوايا الماكرو.
* [05. Persona & SKU Split](file:///e:/vs%20project/clicklock/brand_brain/11_Briefing/05_Persona_and_SKU_Split.md): مصفوفة توزيع المنتجات والمنصات على كل شخصية.

### 📂 12. Hooks & Scripts (الخطافات والسكربتات)
* [01. Hook Formats](file:///e:/vs%20project/clicklock/brand_brain/12_Hooks_and_Scripts/01_Hook_Formats.md): بنك يضم أكثر من 20 خطافاً إعلانياً سعودياً مجرباً.
* [02. Hook Psychology](file:///e:/vs%20project/clicklock/brand_brain/12_Hooks_and_Scripts/02_Hook_Psychology.md): التحليل النفسي لدوافع تجنب الخزي الاجتماعي والذكاء المالي.
* [03. Script Processes](file:///e:/vs%20project/clicklock/brand_brain/12_Hooks_and_Scripts/03_Script_Processes.md): معادلة السكربت الخماسية (Hook -> Agitate -> Proof -> Risk Reversal -> CTA).
* [04. Brand Voice Profile](file:///e:/vs%20project/clicklock/brand_brain/12_Hooks_and_Scripts/04_Brand_Voice_Profile.md): محددات نبرة الصوت الواثقة والأنيقة والمعاصرة.
* [05. AI Writing Tells](file:///e:/vs%20project/clicklock/brand_brain/12_Hooks_and_Scripts/05_AI_Writing_Tells.md): الكلمات الروبوتية المبتذلة الممنوعة في كتابة الإعلانات.

### 📂 13. AI Creative (الإبداع بالذكاء الاصطناعي)
* [01. Video Prompts](file:///e:/vs%20project/clicklock/brand_brain/13_AI_Creative/01_Video_Prompts.md): موجهات Runway و Sora لتوليد لقطات B-Roll سينمائية للمنتجات والتغليف.
* [02. Static Generation](file:///e:/vs%20project/clicklock/brand_brain/13_AI_Creative/02_Static_Generation.md): موجهات Midjourney لتوليد صور المنتجات على قواعد التيل والعاجي.
* [03. Static Recreation](file:///e:/vs%20project/clicklock/brand_brain/13_AI_Creative/03_Static_Recreation.md): مسار إعادة تشكيل الإعلانات الثابتة الفائزة بهوية Clicklock.
* [04. Image to Video](file:///e:/vs%20project/clicklock/brand_brain/13_AI_Creative/04_Image_to_Video.md): تقنيات تحريك صور الكتالوج بإضاءة سينمائية وتأثير 3D.
* [05. First & Last Frame](file:///e:/vs%20project/clicklock/brand_brain/13_AI_Creative/05_First_and_Last_Frame.md): هندسة الإطار الأول لإيقاف التمرير والإطار الأخير لتحفيز الشراء بتمارا.

### 📂 14. Iteration (تطوير وتدوير الإعلانات)
* [01. Which Ads Deserve It](file:///e:/vs%20project/clicklock/brand_brain/14_Iteration/01_Which_Ads_Deserve_It.md): شجرة قرارات التدوير أو الإيقاف أو التوسع.
* [02. Hook Swap](file:///e:/vs%20project/clicklock/brand_brain/14_Iteration/02_Hook_Swap.md): بروتوكول تبديل الخطافات لمضاعفة عمر الإعلان 3 أضعاف.
* [03. Angle Swap](file:///e:/vs%20project/clicklock/brand_brain/14_Iteration/03_Angle_Swap.md): تبديل الزاوية النفسية لنفس المنتج (توفير vs سرعة vs جودة).
* [04. Format Swap](file:///e:/vs%20project/clicklock/brand_brain/14_Iteration/04_Format_Swap.md): تحويل الفيديوهات إلى كاروسيل وسلايدشو تيك توك.
* [05. Frankenstein & Mashup](file:///e:/vs%20project/clicklock/brand_brain/14_Iteration/05_Frankenstein_and_Mashup.md): دمج أفضل خطاف مع أفضل لقطة إثبات وأفضل دعوة للشراء.

### 📂 15. Quality Gates (بوابات الجودة والرقابة)
* [01. Grounding Review](file:///e:/vs%20project/clicklock/brand_brain/15_Quality_Gates/01_Grounding_Review.md): التحقق من توفر المخزون وصحة الأسعار وتفعيل تمارا.
* [02. Voice Review](file:///e:/vs%20project/clicklock/brand_brain/15_Quality_Gates/02_Voice_Review.md): فحص أصالة اللهجة السعودية وغياب الألفاظ المبتذلة.
* [03. Brand Lens](file:///e:/vs%20project/clicklock/brand_brain/15_Quality_Gates/03_Brand_Lens.md): فحص الألوان (التيل العميق والعاجي) والخطوط وسلامة الشعار.
* [04. Source Receipts](file:///e:/vs%20project/clicklock/brand_brain/15_Quality_Gates/04_Source_Receipts.md): أرشيف الإثباتات والوثائق وبوليصات الشحن الحقيقية.
* [05. Read-Aloud Test](file:///e:/vs%20project/clicklock/brand_brain/15_Quality_Gates/05_Read_Aloud_Test.md): اختبار القراءة الجهرية للتأكد من عفوية وانسيابية السكربت.

### 📂 16. The Brain Runs Itself (التشغيل والأتمتة الذاتية)
* [01. Refresh Context](file:///e:/vs%20project/clicklock/brand_brain/16_The_Brain_Runs_Itself/01_Refresh_Context.md): بروتوكول التحديث الدوري الأسبوعي والشهري.
* [02. Dream](file:///e:/vs%20project/clicklock/brand_brain/16_The_Brain_Runs_Itself/02_Dream.md): التوليد الذاتي للأفكار المستقبلية واستباق التريندات.
* [03. Harvest & Evaluate](file:///e:/vs%20project/clicklock/brand_brain/16_The_Brain_Runs_Itself/03_Harvest_and_Evaluate.md): حصاد التعليقات وتصنيف بيانات الأداء المستمر.
* [04. Research Loops](file:///e:/vs%20project/clicklock/brand_brain/16_The_Brain_Runs_Itself/04_Research_Loops.md): مسح مكتبات إعلانات المنافسين وحسابات الفاشينيستات.
* [05. Self-Improve](file:///e:/vs%20project/clicklock/brand_brain/16_The_Brain_Runs_Itself/05_Self_Improve.md): التطوير الذاتي المستمر لوثيقة السياق التسويقي المركزية.

### 📂 17. The Factory (مصنع الإنتاج والتوسع)
* [01. Templates](file:///e:/vs%20project/clicklock/brand_brain/17_The_Factory/01_Templates.md): قوالب البريف السريع والنصوص القياسية.
* [02. Three-Phase Model](file:///e:/vs%20project/clicklock/brand_brain/17_The_Factory/02_Three_Phase_Model.md): نموذج المراحل الثلاث (البحث -> الإنتاج -> التحجيم).
* [03. Growing the Brain](file:///e:/vs%20project/clicklock/brand_brain/17_The_Factory/03_Growing_the_Brain.md): بروتوكول إضافة النتائج والأفكار الجديدة للعقل المركزي.
* [04. Propagate to Other Brands](file:///e:/vs%20project/clicklock/brand_brain/17_The_Factory/04_Propagate_to_Other_Brands.md): دليل استنساخ وتطبيق هذه المنظومة على علامات تجارية جديدة.

---

## 🎯 الدليل المرجعي السريع للوكلاء الذكاء الاصطناعي (AI Marketing Skills Hook)
تمت مزامنة هذا العقل المركزي أيضاً مع ملف سياق التسويق الأساسي في:
👉 [`.agents/product-marketing.md`](file:///e:/vs%20project/clicklock/.agents/product-marketing.md)
""")

print("Modules 13 to 17 and Master README successfully created!")
